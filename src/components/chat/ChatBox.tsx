'use client'
import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";
import MessageBox from "./MessageBox";
import ChatHeader from "./ChatHeader";
import { useWebSocket } from "@/contexts/peroxo-context";
import useMessageCache from "@/hooks/use-messageCache";
import { logger } from "@/lib/logger";
import { useApp } from "@/contexts/app-context";

const ChatBox = () => {
    const { user, currentChat } = useApp();
    const { sendMessage, isConnected,addMessageHandler } = useWebSocket();

    // Compute chatId with proper validation and type safety
    const chatId = useMemo(() => {
        if (!user || !currentChat) {
            logger.debug('Cannot derive chatId: missing user or currentChat');
            return null;
        }

        // Normalize to string first
        const userId = String(user.id);
        const otherUserId = String(currentChat.user_id);

        // Convert to numbers for comparison
        const a = Number(userId);
        const b = Number(otherUserId);

        if (Number.isNaN(a) || Number.isNaN(b)) {
            logger.error('Invalid user IDs for chat derivation', { userId, otherUserId });
            return null;
        }

        const derivedId = `${Math.min(a, b)}_${Math.max(a, b)}`;
        logger.debug('Derived chatId:', derivedId, 'from users:', userId, otherUserId);
        return derivedId;
    }, [user, currentChat]);

    const {
        failedMessages,
        allMessages,
        isLoading,
        error,
        addMessage,
        updateMessageStatus,
        markAsRead,
        clearFromMemory,
        getMessageCounts,
    } = useMessageCache(chatId ?? undefined);

    const [input, setInput] = useState("");
    const bottomRef = useRef<HTMLDivElement | null>(null);
    const previousChatIdRef = useRef<string | null>(null);
    const pendingAcksRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

    // Clear memory when chat changes
    useEffect(() => {
        if (previousChatIdRef.current && previousChatIdRef.current !== chatId) {
            logger.debug('Chat changed, clearing previous chat from memory');
            clearFromMemory();

            // Clear any pending timeouts for the old chat
            pendingAcksRef.current.forEach(timeout => clearTimeout(timeout));
            pendingAcksRef.current.clear();
        }
        previousChatIdRef.current = chatId;
    }, [chatId, clearFromMemory]);

    // Scroll to bottom when messages change
    useEffect(() => {
        if (allMessages.length > 0) {
            bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [allMessages.length]);

    // Mark as read
    useEffect(() => {
        if (chatId && allMessages.length > 0) {
            const timer = setTimeout(() => {
                markAsRead();
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [chatId, allMessages.length, markAsRead]);

    useEffect(() => {
        if (!chatId) return;

        const handleAck = (message: any) => {
            // Check if this is a MessageAck
            if (message.MessageAck) {
                const { message_id, status } = message.MessageAck;

                logger.debug('Received ack for message:', message_id, 'status:', status);

                // Clear the timeout
                const timeout = pendingAcksRef.current.get(message_id);
                if (timeout) {
                    clearTimeout(timeout);
                    pendingAcksRef.current.delete(message_id);
                }

                // Update message status based on server response
                if (status === 'Persisted') {
                    updateMessageStatus(message_id, 'sent');
                } else {
                    // Handle other status types if needed
                    updateMessageStatus(message_id, 'sent');
                }
            }
        };

        const unsubscribe = addMessageHandler(handleAck);
        return unsubscribe;
    }, [chatId, updateMessageStatus, addMessageHandler]);



    // Cleanup timeouts on unmount
    useEffect(() => {
        return () => {
            pendingAcksRef.current.forEach(timeout => clearTimeout(timeout));
            pendingAcksRef.current.clear();
        };
    }, []);

    // Send new message
    const handleSend = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!input.trim() || !currentChat || !isConnected || !chatId || !user) {
            logger.warn('Cannot send message: missing required data', {
                hasInput: !!input.trim(),
                hasCurrentChat: !!currentChat,
                isConnected,
                hasChatId: !!chatId,
                hasUser: !!user
            });
            return;
        }

        const content = input.trim();
        const message_id = uuidv4();
        const now = new Date();

        // Normalize IDs to strings
        const fromId = String(user.id);
        const toId = String(currentChat.user_id);

        const message = {
            id: message_id,
            from: fromId,
            to: toId,
            content,
            incoming: false,
            timestamp: now,
            status: "sent" as const,
        };

        logger.debug('Sending message:', message_id, 'to user:', toId);
        const success = addMessage(message);

        if (success) {
            // Send to backend - normalize to numbers if backend expects numbers
            const payload = {
                DirectMessage: {
                    from: Number(fromId),
                    to: Number(toId),
                    content,
                    message_id,
                },
            };

            logger.debug('WebSocket payload:', payload);

            try {
                sendMessage(payload);

                // Set a timeout to mark as failed if no ack
                const timeout = setTimeout(() => {
                    logger.warn('Message timeout - no ack received:', message_id);
                    updateMessageStatus(message_id, "failed");
                    pendingAcksRef.current.delete(message_id);
                }, 30000);

                pendingAcksRef.current.set(message_id, timeout);

            } catch (err) {
                logger.error("WebSocket send error:", err);
                updateMessageStatus(message_id, "failed");
            }

            setInput("");
        } else {
            logger.error('Failed to add message to cache');
        }
    };

    // Retry failed message
    const handleRetry = useCallback(
        (messageId: string) => {
            const failedMessage = failedMessages.find((m) => m.id === messageId);
            if (!failedMessage) {
                logger.warn('Failed message not found:', messageId);
                return;
            }

            logger.debug('Retrying failed message:', messageId);
            updateMessageStatus(messageId, "pending");

            const payload = {
                DirectMessage: {
                    from: Number(failedMessage.from),
                    to: Number(failedMessage.to),
                    content: failedMessage.content,
                    message_id: messageId,
                },
            };

            try {
                sendMessage(payload);

                const timeout = setTimeout(() => {
                    logger.warn('Retry timeout - no ack received:', messageId);
                    updateMessageStatus(messageId, "failed");
                    pendingAcksRef.current.delete(messageId);
                }, 30000);

                pendingAcksRef.current.set(messageId, timeout);

            } catch (err) {
                logger.error("WebSocket retry error:", err);
                updateMessageStatus(messageId, "failed");
            }
        },
        [failedMessages, updateMessageStatus, sendMessage]
    );

    const messageCounts = getMessageCounts();

    // Validation checks
    if (!user) {
        logger.error("User not found in ChatBox");
        return (
            <div className="flex items-center justify-center h-full text-gray-500">
                User not authenticated. Please log in.
            </div>
        );
    }

    if (!currentChat) {
        return (
            <div className="flex items-center justify-center h-full text-gray-500">
                Select a chat to start messaging.
            </div>
        );
    }

    if (!chatId) {
        logger.error("Chat ID could not be determined in ChatBox");
        return (
            <div className="flex items-center justify-center h-full text-red-500">
                Error: Could not determine chat ID. Please refresh and try again.
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-red-500">
                <p>Error loading messages: {error.message}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                >
                    Reload Page
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full p-4 bg-neutral-900 rounded-lg">
            <div className="flex-shrink-0">
                <ChatHeader
                    userInfo={currentChat.other_user}
                />
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 py-2">
                {isLoading && allMessages.length === 0 && (
                    <div className="flex items-center justify-center p-4 text-gray-500">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#ff0059]"></div>
                        <span className="ml-2">Loading messages...</span>
                    </div>
                )}

                {!isLoading && allMessages.length === 0 && (
                    <div className="flex items-center justify-center p-4 text-gray-400">
                        No messages yet. Start the conversation!
                    </div>
                )}

                {allMessages.map((msg) => (
                    <MessageBox
                        key={msg.id}
                        content={msg.content}
                        incoming={msg.incoming}
                        timestamp={msg.timestamp}
                        status={msg.status}
                        onRetry={() => handleRetry(msg.id)}
                    />
                ))}

                {!isConnected && (
                    <div className="flex items-center justify-center p-2 bg-yellow-600/20 rounded-lg text-yellow-400 text-sm">
                        <span className="animate-pulse">●</span>
                        <span className="ml-2">Reconnecting...</span>
                    </div>
                )}

                <div ref={bottomRef} />
            </div>

            <form onSubmit={handleSend} className="mt-2 flex flex-shrink-0">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={isConnected ? "Type a message..." : "Connecting..."}
                    disabled={!isConnected}
                    className="flex-1 p-2 rounded-l-lg bg-neutral-800 text-white outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                    type="submit"
                    disabled={!input.trim() || !isConnected}
                    className="px-4 bg-[#ff0059] text-white rounded-r-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#ff0059]/90 transition-colors"
                >
                    Send
                </button>
            </form>

            {(messageCounts.pending > 0 || messageCounts.failed > 0) && (
                <div className="mt-1 text-xs text-gray-400 flex justify-between">
                    {messageCounts.pending > 0 && <span>📤 {messageCounts.pending} sending...</span>}
                    {messageCounts.failed > 0 && (
                        <span className="text-red-400">❌ {messageCounts.failed} failed (tap to retry)</span>
                    )}
                </div>
            )}
        </div>
    );
};

export default ChatBox;