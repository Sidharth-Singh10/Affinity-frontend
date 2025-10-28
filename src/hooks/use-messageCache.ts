import {
    useState,
    useEffect,
    useCallback,
    useRef,
    useMemo,
} from "react";
import { useApp } from "@/contexts/app-context";
import { useWebSocket } from "@/contexts/peroxo-context";
import { logger } from "@/lib/logger";
import { ChatMessage, getMessageCache } from "@/lib/message-cache";


interface UseMessageCacheResult {
    messages: ChatMessage[];
    pendingMessages: ChatMessage[];
    failedMessages: ChatMessage[];
    allMessages: ChatMessage[];
    isLoading: boolean;
    error: Error | null;
    addMessage: (message: ChatMessage) => boolean;
    updateMessageStatus: (
        messageId: string,
        newStatus: "sent" | "pending" | "failed",
        serverData?: Partial<ChatMessage>
    ) => boolean;
    retryMessage: (messageId: string) => boolean;
    markAsRead: () => void;
    clearFromMemory: () => void;
    getChatMetadata: () => any;
    getMessageCounts: () => {
        confirmed: number;
        pending: number;
        failed: number;
        total: number;
    };
    isEmpty: boolean;
}

// ===== Hook: useMessageCache =====

export const useMessageCache = (chatId?: string): UseMessageCacheResult => {
    const messageCache = getMessageCache();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [pendingMessages, setPendingMessages] = useState<ChatMessage[]>([]);
    const [failedMessages, setFailedMessages] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const chatIdRef = useRef<string | undefined>(chatId);
    const abortControllerRef = useRef<AbortController | null>(null);

    const { addMessageHandler } = useWebSocket();
    const { user } = useApp();

    // Early exit if no user
    if (!user || !user.id) {
        logger.error("useMessageCache: No user in context");
        throw new Error("User not available in context");
    }

    // Normalize user ID to string for consistent comparison
    const normalizedUserId = String(user.id);

    // ===== WebSocket listener for incoming messages =====
    useEffect(() => {
        logger.debug('Registering WebSocket message handler for user:', normalizedUserId);

        const unsubscribe = addMessageHandler((message: any) => {
            logger.debug('Raw WebSocket message received:', message);

            const dm = message?.DirectMessage;
            if (!dm) {
                logger.debug('Message is not a DirectMessage, ignoring');
                return;
            }

            logger.debug('DirectMessage payload:', dm);

            const { from, to, content, message_id, timestamp } = dm;

            // Normalize IDs to strings for consistent comparison
            const senderId = String(from);
            const receiverId = String(to);

            // Validate message
            if (!message_id) {
                logger.warn('Message missing message_id, ignoring');
                return;
            }

            if (!content) {
                logger.warn('Message missing content, ignoring');
                return;
            }

            // Check if message is for this user
            if (senderId !== normalizedUserId && receiverId !== normalizedUserId) {
                logger.debug('Message not for current user, ignoring', {
                    from: senderId,
                    to: receiverId,
                    currentUser: normalizedUserId
                });
                return;
            }

            // Derive chat ID consistently
            const otherId = senderId === normalizedUserId ? receiverId : senderId;
            const userIdNum = Number(normalizedUserId);
            const otherIdNum = Number(otherId);

            if (isNaN(userIdNum) || isNaN(otherIdNum)) {
                logger.error('Invalid user IDs for chat derivation', {
                    currentUserId: normalizedUserId,
                    otherId,
                });
                return;
            }

            const derivedChatId = `${Math.min(userIdNum, otherIdNum)}_${Math.max(userIdNum, otherIdNum)}`;

            logger.debug('Message for chat:', derivedChatId, 'Current chat:', chatIdRef.current);

            const time = timestamp ? new Date(timestamp) : new Date();
            const isIncoming = senderId !== normalizedUserId;

            const messageData: ChatMessage = {
                id: message_id,
                from: senderId,
                to: receiverId,
                content,
                incoming: isIncoming,
                timestamp: time,
                status: "sent",
            };

            // Add to global cache
            try {
                const added = messageCache.addMessage(derivedChatId, messageData);
                logger.debug('Message added to cache:', added, 'for chat:', derivedChatId);
            } catch (err) {
                logger.error('Failed to add message to cache:', err);
            }

            // If message belongs to current chat, update UI state
            if (derivedChatId === chatIdRef.current) {
                logger.debug('Updating UI state for current chat');
                setMessages((prev) => {
                    // Prevent duplicates
                    if (prev.some(m => m.id === message_id)) {
                        logger.debug('Message already exists in state, skipping');
                        return prev;
                    }
                    const newMessages = [...prev, messageData];
                    logger.debug('State updated with new message. Total messages:', newMessages.length);
                    return newMessages;
                });
            } else {
                logger.debug('Message not for current chat, UI not updated', {
                    derivedChatId,
                    currentChatId: chatIdRef.current
                });
            }
        });

        return () => {
            logger.debug('Unsubscribing WebSocket message handler');
            unsubscribe();
        };
    }, [normalizedUserId, addMessageHandler, messageCache]); // Include messageCache in dependencies

    // Update chatId ref whenever it changes
    useEffect(() => {
        chatIdRef.current = chatId;
        logger.debug('Current chatId updated to:', chatId);
    }, [chatId]);

    // ===== Load messages when chatId changes =====
    useEffect(() => {
        if (!chatId) {
            setMessages([]);
            setPendingMessages([]);
            setFailedMessages([]);
            setError(null);
            return;
        }

        // Cancel any pending operations
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        abortControllerRef.current = new AbortController();

        const loadMessages = async () => {
            setIsLoading(true);
            setError(null);

            try {
                logger.debug('Loading messages for chat:', chatId);
                messageCache.preloadChat(chatId);

                const { messages: confirmed, pending, failed } =
                    messageCache.getAllMessages(chatId);

                logger.debug('Messages loaded:', {
                    confirmed: confirmed.length,
                    pending: pending.length,
                    failed: failed.length
                });

                const controller = abortControllerRef.current;
                const aborted = controller?.signal.aborted ?? false;

                if (chatIdRef.current === chatId && !aborted) {
                    setMessages(confirmed);
                    setPendingMessages(pending);
                    setFailedMessages(failed);

                    messageCache.markChatAsRead(chatId);
                }
            } catch (err) {
                const controller = abortControllerRef.current;
                const aborted = controller?.signal.aborted ?? false;

                if (!aborted) {
                    const e = err instanceof Error ? err : new Error(String(err));
                    setError(e);
                    logger.error("Failed to load messages:", e);
                }
            } finally {
                const controller = abortControllerRef.current;
                const aborted = controller?.signal.aborted ?? false;

                if (!aborted) {
                    setIsLoading(false);
                }
            }
        };

        loadMessages();

        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [chatId, messageCache]); // Include messageCache

    // ===== Add message =====
    const addMessage = useCallback(
        (message: ChatMessage): boolean => {
            if (!chatId || !message) return false;
            try {
                logger.debug('Adding message:', message.id, 'to chat:', chatId);
                const success = messageCache.addMessage(chatId, message);

                if (!success) {
                    logger.warn('Failed to add message to cache');
                    return false;
                }

                if (chatIdRef.current === chatId) {
                    const msgWithDate = { ...message, timestamp: new Date(message.timestamp) };

                    if (message.status === "pending") {
                        setPendingMessages((prev) => [...prev, msgWithDate]);
                    } else if (message.status === "failed") {
                        setFailedMessages((prev) => [...prev, msgWithDate]);
                    } else {
                        setMessages((prev) => {
                            // Prevent duplicates
                            if (prev.some(m => m.id === message.id)) {
                                return prev;
                            }
                            return [...prev, msgWithDate];
                        });
                    }
                }
                return success;
            } catch (err) {
                const e = err instanceof Error ? err : new Error(String(err));
                setError(e);
                logger.error("Failed to add message:", e);
                return false;
            }
        },
        [chatId, messageCache]
    );

    // ===== Update message status =====
    const updateMessageStatus = useCallback(
        (
            messageId: string,
            newStatus: "sent" | "pending" | "failed",
            serverData: Partial<ChatMessage> = {}
        ): boolean => {
            if (!chatId || !messageId) return false;

            try {
                logger.debug('Updating message status:', messageId, 'to:', newStatus);
                const success = messageCache.updateMessageStatus(
                    chatId,
                    messageId,
                    newStatus,
                    serverData
                );

                if (success && chatIdRef.current === chatId) {
                    let messageToUpdate: ChatMessage | null = null;

                    setPendingMessages((prev) => {
                        const index = prev.findIndex((m) => m.id === messageId);
                        if (index !== -1) {
                            messageToUpdate = { ...prev[index], status: newStatus, ...serverData };
                            return prev.filter((_, i) => i !== index);
                        }
                        return prev;
                    });

                    if (!messageToUpdate) {
                        setFailedMessages((prev) => {
                            const index = prev.findIndex((m) => m.id === messageId);
                            if (index !== -1) {
                                messageToUpdate = { ...prev[index], status: newStatus, ...serverData };
                                return prev.filter((_, i) => i !== index);
                            }
                            return prev;
                        });
                    }

                    if (messageToUpdate) {
                        if (newStatus === "sent") {
                            setMessages((prev) => [...prev, messageToUpdate!]);
                        } else if (newStatus === "pending") {
                            setPendingMessages((prev) => [...prev, messageToUpdate!]);
                        } else if (newStatus === "failed") {
                            setFailedMessages((prev) => [...prev, messageToUpdate!]);
                        }
                    }
                }
                return success;
            } catch (err) {
                const e = err instanceof Error ? err : new Error(String(err));
                setError(e);
                logger.error("Failed to update message status:", e);
                return false;
            }
        },
        [chatId, messageCache]
    );

    // ===== Computed message lists =====
    // Use useMemo instead of useCallback to ensure this recalculates when dependencies change
    const allMessages = useMemo((): ChatMessage[] => {
        return [...messages, ...pendingMessages, ...failedMessages].sort(
            (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
        );
    }, [messages, pendingMessages, failedMessages]);

    const getChatMetadata = useCallback(() => {
        if (!chatId) return null;
        return messageCache.getChatMetadata(chatId);
    }, [chatId, messageCache]);

    const markAsRead = useCallback(() => {
        if (!chatId) return;
        messageCache.markChatAsRead(chatId);
    }, [chatId, messageCache]);

    const clearFromMemory = useCallback(() => {
        if (!chatId) return;
        messageCache.clearChatMemory(chatId);
    }, [chatId, messageCache]);

    const retryMessage = useCallback(
        (messageId: string): boolean => {
            return updateMessageStatus(messageId, "pending");
        },
        [updateMessageStatus]
    );

    const getMessageCounts = useCallback(() => {
        return {
            confirmed: messages.length,
            pending: pendingMessages.length,
            failed: failedMessages.length,
            total: messages.length + pendingMessages.length + failedMessages.length,
        };
    }, [messages, pendingMessages, failedMessages]);

    return {
        messages,
        pendingMessages,
        failedMessages,
        allMessages,
        isLoading,
        error,
        addMessage,
        updateMessageStatus,
        retryMessage,
        markAsRead,
        clearFromMemory,
        getChatMetadata,
        getMessageCounts,
        isEmpty:
            messages.length === 0 &&
            pendingMessages.length === 0 &&
            failedMessages.length === 0,
    };
};

export default useMessageCache;