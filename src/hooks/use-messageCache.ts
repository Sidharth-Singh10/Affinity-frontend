import {
    useState,
    useEffect,
    useCallback,
    useRef,
} from "react";
import { useApp } from "@/contexts/app-context";
import { useWebSocket } from "@/contexts/peroxo-context";
import { logger } from "@/lib/logger";
import { ChatMessage, getMessageCache } from "@/lib/message-cache"; // Adjust import path as needed


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

interface UseMultipleChatCacheResult {
    cacheStats: Record<string, any>;
    isInitialized: boolean;
    preloadChats: (chatIdsToPreload: string[]) => void;
    clearAllFromMemory: () => void;
    performCleanup: () => void;
    clearAllCache: () => void;
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

    // ===== WebSocket listener for incoming messages =====
    useEffect(() => {
        const unsubscribe = addMessageHandler((message: any) => {
            const dm = message?.DirectMessage;
            if (!dm) return;

            const { from, to, content, message_id, timestamp } = dm;
            const senderId = from;
            const receiverId = to;

            if (!message_id || (senderId !== user.id && receiverId !== user.id)) return;

            const otherId = senderId === user.id ? receiverId : senderId;
            const derivedChatId =
                user.id < otherId
                    ? `${user.id}_${otherId}`
                    : `${otherId}_${user.id}`;

            const time = timestamp ? new Date(timestamp) : new Date();

            const isIncoming = senderId !== user.id;

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
            messageCache.addMessage(derivedChatId, messageData);

            // If message belongs to current chat, update UI state
            if (derivedChatId === chatIdRef.current) {
                setMessages((prev) => [...prev, messageData]);
            }
        });

        return unsubscribe;
    }, [user.id, addMessageHandler]);

    // Update chatId ref
    useEffect(() => {
        chatIdRef.current = chatId;
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
                messageCache.preloadChat(chatId);

                const { messages: confirmed, pending, failed } =
                    messageCache.getAllMessages(chatId);

                const controller = abortControllerRef.current; // store locally for safety
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
                    console.error("Failed to load messages:", e);
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
    }, [chatId]);

    // ===== Add message =====
    const addMessage = useCallback(
        (message: ChatMessage): boolean => {
            if (!chatId || !message) return false;
            try {
                const success = messageCache.addMessage(chatId, message);
                if (success && chatIdRef.current === chatId) {
                    const msgWithDate = { ...message, timestamp: new Date(message.timestamp) };

                    if (message.status === "pending") {
                        setPendingMessages((prev) => [...prev, msgWithDate]);
                    } else if (message.status === "failed") {
                        setFailedMessages((prev) => [...prev, msgWithDate]);
                    } else {
                        setMessages((prev) => [...prev, msgWithDate]);
                    }
                }
                return success;
            } catch (err) {
                const e = err instanceof Error ? err : new Error(String(err));
                setError(e);
                console.error("Failed to add message:", e);
                return false;
            }
        },
        [chatId]
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
                console.error("Failed to update message status:", e);
                return false;
            }
        },
        [chatId]
    );

    // ===== Computed message lists =====
    const getAllMessages = useCallback((): ChatMessage[] => {
        return [...messages, ...pendingMessages, ...failedMessages].sort(
            (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
        );
    }, [messages, pendingMessages, failedMessages]);

    const getChatMetadata = useCallback(() => {
        if (!chatId) return null;
        return messageCache.getChatMetadata(chatId);
    }, [chatId]);

    const markAsRead = useCallback(() => {
        if (!chatId) return;
        messageCache.markChatAsRead(chatId);
    }, [chatId]);

    const clearFromMemory = useCallback(() => {
        if (!chatId) return;
        messageCache.clearChatMemory(chatId);
    }, [chatId]);

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
        allMessages: getAllMessages(),
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

// ===== Hook: useMultipleChatCache =====

export const useMultipleChatCache = (
    chatIds: string[] = []
): UseMultipleChatCacheResult => {
    const messageCache = getMessageCache();
    const [cacheStats, setCacheStats] = useState<Record<string, any>>({});
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        const updateStats = () => {
            const stats = messageCache.getStats();
            const chatStats: Record<string, any> = {};

            chatIds.forEach((chatId) => {
                if (chatId) {
                    chatStats[chatId] = {
                        metadata: messageCache.getChatMetadata(chatId),
                        messageCount: messageCache.getMessages(chatId).length,
                    };
                }
            });

            setCacheStats({
                global: stats,
                chats: chatStats,
            });
        };

        updateStats();
        setIsInitialized(true);

        const interval = setInterval(updateStats, 10000);
        return () => clearInterval(interval);
    }, [chatIds]);

    const preloadChats = useCallback((chatIdsToPreload: string[]) => {
        chatIdsToPreload.forEach((chatId) => {
            if (chatId) messageCache.preloadChat(chatId);
        });
    }, []);

    const clearAllFromMemory = useCallback(() => {
        chatIds.forEach((chatId) => {
            if (chatId) messageCache.clearChatMemory(chatId);
        });
    }, [chatIds]);

    const performCleanup = useCallback(() => {
        messageCache.cleanup();
    }, []);

    const clearAllCache = useCallback(() => {
        messageCache.clearAll();
        setCacheStats({});
    }, []);

    return {
        cacheStats,
        isInitialized,
        preloadChats,
        clearAllFromMemory,
        performCleanup,
        clearAllCache,
    };
};

export default useMessageCache;
