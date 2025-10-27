'use client'
import { useEffect, useState, useRef, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import MessageBox from "./MessageBox";
import ChatHeader from "./ChatHeader";
import { useWebSocket } from "@/contexts/peroxo-context";
import useMessageCache from "@/hooks/use-messageCache";
import { logger } from "@/lib/logger";
import { useApp } from "@/contexts/app-context";
const ChatBox = () => {

    const { user, currentChat } = useApp()
    const { sendMessage, isConnected } = useWebSocket();

    if (!user) {
        logger.error("User not found in ChatBox");
        return null;
    }

    const chatId = currentChat
        ? `${Math.min(Number(user.id), Number(currentChat.user_id))}_${Math.max(
            Number(user.id),
            Number(currentChat.user_id)
        )}`
        : null;
        
    if (!currentChat) {
        return (
            <div className="flex items-center justify-center h-full text-gray-500">
                Select a chat to start messaging.
            </div>
        );
    }
    console.log("ChatBox - chatId:", chatId);

    if (!chatId) {
        logger.error("Chat ID could not be determined in ChatBox");
        return null;
    }


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
    } = useMessageCache(chatId);

    const [input, setInput] = useState("");
    const bottomRef = useRef<HTMLDivElement | null>(null);
    const previousChatIdRef = useRef<string | null>(null);

    // Clear memory when chat changes
    useEffect(() => {
        if (previousChatIdRef.current && previousChatIdRef.current !== chatId) {
            clearFromMemory();
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

    // Send new message
    const handleSend = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!input.trim() || !currentChat || !isConnected || !chatId) return;

        const content = input.trim();
        const message_id = uuidv4();
        const now = new Date();

        const message = {
            id: message_id,
            from: user.id,
            to: String(currentChat.user_id),
            content,
            incoming: false,
            timestamp: now,
            status: "sent" as const,
        };

        const success = addMessage(message);

        if (success) {
            const payload = {
                DirectMessage: {
                    from: user.id,
                    to: currentChat.user_id,
                    content,
                    message_id, // REQUIRED by backend
                },
            };

            try {
                sendMessage(payload);

                // Set a timeout to mark as failed if no ack
                setTimeout(() => {
                    updateMessageStatus(message_id, "failed");
                }, 30000);
            } catch (err) {
                console.error("WebSocket send error:", err);
                updateMessageStatus(message_id, "failed");
            }

            setInput("");
        }
    };

    // Retry failed message
    const handleRetry = useCallback(
        (messageId: string) => {
            const failedMessage = failedMessages.find((m) => m.id === messageId);
            if (!failedMessage) return;

            // Set as pending
            updateMessageStatus(messageId, "pending");

            // Resend with same message_id
            const payload = {
                DirectMessage: {
                    from: failedMessage.from,
                    to: failedMessage.to,
                    content: failedMessage.content,
                    message_id: messageId,
                },
            };

            sendMessage(payload);

            setTimeout(() => {
                updateMessageStatus(messageId, "failed");
            }, 30000);
        },
        [failedMessages, updateMessageStatus, sendMessage]
    );

    const messageCounts = getMessageCounts();

    if (!currentChat) {
        return (
            <div className="flex items-center justify-center h-full text-gray-500">
                Select a chat to start messaging.
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-full text-red-500">
                Error loading messages: {error.message}
                <button
                    onClick={() => window.location.reload()}
                    className="ml-2 px-2 py-1 bg-red-600 text-white rounded text-sm"
                >
                    Reload
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full p-4 bg-neutral-900 rounded-lg">
            <div className="flex-shrink-0">
                <ChatHeader
                    userInfo={currentChat.other_user}
                    messageCounts={messageCounts}
                    isLoading={isLoading}
                />
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 py-2">
                {isLoading && allMessages.length === 0 && (
                    <div className="flex items-center justify-center p-4 text-gray-500">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#ff0059]"></div>
                        <span className="ml-2">Loading messages...</span>
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
                    {messageCounts.pending > 0 && (
                        <span>📤 {messageCounts.pending} sending...</span>
                    )}
                    {messageCounts.failed > 0 && (
                        <span className="text-red-400">
                            ❌ {messageCounts.failed} failed (tap to retry)
                        </span>
                    )}
                </div>
            )}
        </div>
    );
};

export default ChatBox;
