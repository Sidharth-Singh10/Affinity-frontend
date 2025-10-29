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
    isLoadingHistory: boolean;
    hasMoreHistory: boolean;
    error: Error | null;
    addMessage: (message: ChatMessage) => boolean;
    updateMessageStatus: (
        messageId: string,
        newStatus: "sent" | "pending" | "failed",
        serverData?: Partial<ChatMessage>
    ) => boolean;
    retryMessage: (messageId: string) => boolean;
    loadMoreHistory: () => Promise<void>;
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

export const useMessageCache = (chatId?: string): UseMessageCacheResult => {
    const messageCache = getMessageCache();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [pendingMessages, setPendingMessages] = useState<ChatMessage[]>([]);
    const [failedMessages, setFailedMessages] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);
    const [hasMoreHistory, setHasMoreHistory] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const chatIdRef = useRef<string | undefined>(chatId);
    const abortControllerRef = useRef<AbortController | null>(null);
    const historyRequestIdRef = useRef<number>(0);

    const { addMessageHandler, sendMessage, isConnected } = useWebSocket();
    const { user } = useApp();

    if (!user || !user.id) {
        logger.error("useMessageCache: No user in context");
        throw new Error("User not available in context");
    }

    const normalizedUserId = String(user.id);

    // ===== Handle ChatHistoryResponse from WebSocket =====
    useEffect(() => {
        logger.debug('Registering ChatHistoryResponse handler');

        const unsubscribe = addMessageHandler((message: any) => {
            const historyResponse = message?.ChatHistoryResponse;
            if (!historyResponse) return;

            logger.debug('ChatHistoryResponse received:', historyResponse);

            const { messages: historyMessages, has_more, next_cursor } = historyResponse;

            if (!chatIdRef.current) {
                logger.warn('Received history response but no active chat');
                return;
            }

            const currentChatId = chatIdRef.current;

            // Convert server messages to ChatMessage format
            const convertedMessages: ChatMessage[] = (historyMessages || []).map((msg: any) => ({
                id: msg.message_id,
                from: String(msg.sender_id),
                to: String(msg.recipient_id),
                content: msg.message_text,
                incoming: String(msg.sender_id) !== normalizedUserId,
                timestamp: new Date(msg.created_at),
                status: "sent" as const,
            }));

            logger.debug(`Processing ${convertedMessages.length} history messages for chat:`, currentChatId);

            // Add messages to cache (prepend as they are older)
            if (convertedMessages.length > 0) {
                messageCache.addMessages(currentChatId, convertedMessages, true);
            }

            // Update pagination state
            messageCache.updatePaginationState(currentChatId, has_more, next_cursor);
            messageCache.setHistoryLoadingState(currentChatId, false);

            // Update UI state if still on same chat
            if (chatIdRef.current === currentChatId) {
                setMessages((prev) => {
                    // Merge and deduplicate
                    const existingIds = new Set(prev.map(m => m.id));
                    const newMessages = convertedMessages.filter(m => !existingIds.has(m.id));
                    return [...newMessages, ...prev].sort((a, b) =>
                        a.timestamp.getTime() - b.timestamp.getTime()
                    );
                });
                setHasMoreHistory(has_more);
                setIsLoadingHistory(false);
            }
        });

        return () => {
            logger.debug('Unsubscribing ChatHistoryResponse handler');
            unsubscribe();
        };
    }, [normalizedUserId, addMessageHandler, messageCache]);

    // ===== Handle DirectMessage from WebSocket =====
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

            const senderId = String(from);
            const receiverId = String(to);

            if (!message_id || !content) {
                logger.warn('Message missing required fields, ignoring');
                return;
            }

            if (senderId !== normalizedUserId && receiverId !== normalizedUserId) {
                logger.debug('Message not for current user, ignoring');
                return;
            }

            const otherId = senderId === normalizedUserId ? receiverId : senderId;
            const userIdNum = Number(normalizedUserId);
            const otherIdNum = Number(otherId);

            if (isNaN(userIdNum) || isNaN(otherIdNum)) {
                logger.error('Invalid user IDs for chat derivation');
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

            try {
                const added = messageCache.addMessage(derivedChatId, messageData);
                logger.debug('Message added to cache:', added, 'for chat:', derivedChatId);
            } catch (err) {
                logger.error('Failed to add message to cache:', err);
            }

            if (derivedChatId === chatIdRef.current) {
                logger.debug('Updating UI state for current chat');
                setMessages((prev) => {
                    if (prev.some(m => m.id === message_id)) {
                        logger.debug('Message already exists in state, skipping');
                        return prev;
                    }
                    const newMessages = [...prev, messageData];
                    logger.debug('State updated with new message. Total messages:', newMessages.length);
                    return newMessages;
                });
            }
        });

        return () => {
            logger.debug('Unsubscribing WebSocket message handler');
            unsubscribe();
        };
    }, [normalizedUserId, addMessageHandler, messageCache]);

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
            setHasMoreHistory(true);
            return;
        }

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

                const paginationState = messageCache.getPaginationState(chatId);

                logger.debug('Messages loaded:', {
                    confirmed: confirmed.length,
                    pending: pending.length,
                    failed: failed.length,
                    hasMore: paginationState.hasMore,
                });

                const controller = abortControllerRef.current;
                const aborted = controller?.signal.aborted ?? false;

                if (chatIdRef.current === chatId && !aborted) {
                    setMessages(confirmed);
                    setPendingMessages(pending);
                    setFailedMessages(failed);
                    setHasMoreHistory(paginationState.hasMore);

                    messageCache.markChatAsRead(chatId);

                    // Auto-load history if no messages exist
                    if (confirmed.length === 0 && paginationState.hasMore && isConnected) {
                        logger.debug('No messages in cache, auto-loading history');
                        loadMoreHistory();
                    }
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
    }, [chatId, messageCache, isConnected]);

    // ===== Load more history =====
    const loadMoreHistory = useCallback(async () => {
        if (!chatId || !isConnected || isLoadingHistory || !hasMoreHistory) {
            logger.debug('Cannot load history:', { chatId, isConnected, isLoadingHistory, hasMoreHistory });
            return;
        }

        const requestId = ++historyRequestIdRef.current;
        logger.debug('Loading more history for chat:', chatId, 'Request ID:', requestId);

        setIsLoadingHistory(true);
        messageCache.setHistoryLoadingState(chatId, true);

        try {
            const paginationState = messageCache.getPaginationState(chatId);
            const request: any = {
                GetPaginatedMessages: {
                    conversation_id: chatId,
                }
            };

            // Include cursor if we have one (for subsequent pages)
            if (paginationState.nextCursor) {
                request.GetPaginatedMessages.message_id = paginationState.nextCursor;
            }

            logger.debug('Sending history request:', request);
            sendMessage(request);

            // Response will be handled by the ChatHistoryResponse listener
        } catch (err) {
            // Only update state if this is still the latest request
            if (requestId === historyRequestIdRef.current) {
                const e = err instanceof Error ? err : new Error(String(err));
                setError(e);
                setIsLoadingHistory(false);
                messageCache.setHistoryLoadingState(chatId, false);
                logger.error('Failed to load history:', e);
            }
        }
    }, [chatId, isConnected, isLoadingHistory, hasMoreHistory, sendMessage, messageCache]);

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
        isLoadingHistory,
        hasMoreHistory,
        error,
        addMessage,
        updateMessageStatus,
        retryMessage,
        loadMoreHistory,
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