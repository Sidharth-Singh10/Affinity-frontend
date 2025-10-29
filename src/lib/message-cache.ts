// MessageCache.ts

export interface ChatMessage {
  id: string;
  from?: string;
  to?: string;
  content: string;
  incoming: boolean;
  timestamp: Date;
  status: "sent" | "pending" | "failed";
  [key: string]: any;
}

interface ChatData {
  chatId: string;
  messages: ChatMessage[];
  pendingMessages: ChatMessage[];
  failedMessages: ChatMessage[];
  hasMore?: boolean;
  nextCursor?: string | null;
  isLoadingHistory?: boolean;
}

interface ChatMetadata {
  lastAccessed: Date;
  lastMessageTime: Date;
  messageCount: number;
  unreadCount: number;
  hasUnread: boolean;
  isPinned?: boolean;
  hasMore?: boolean;
  nextCursor?: string | null;
  historyLoaded?: boolean;
}

interface MessageCacheOptions {
  maxMessagesPerChat?: number;
  maxCachedChats?: number;
  maxStorageSizeMB?: number;
  cleanupThresholdDays?: number;
}

interface CacheStats {
  memoryCacheSize: number;
  totalChats: number;
  storageUsage: { bytes: number; mb: string };
  oldestChat: Date | null;
  newestChat: Date | null;
}

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

export class MessageCache {
  private options: Required<MessageCacheOptions>;
  private memoryCache: Map<string, ChatData>;
  private chatMetadata: Map<string, ChatMetadata>;

  constructor(options: MessageCacheOptions = {}) {
    this.options = {
      maxMessagesPerChat: options.maxMessagesPerChat ?? 100,
      maxCachedChats: options.maxCachedChats ?? 30,
      maxStorageSizeMB: options.maxStorageSizeMB ?? 3,
      cleanupThresholdDays: options.cleanupThresholdDays ?? 30,
    };

    this.memoryCache = new Map();
    this.chatMetadata = new Map();

    this.initialize();
  }

  // Initialize cache from localStorage
  private initialize(): void {
    if (!isBrowser()) return;
    try {
      const metadata = this.getFromStorage<Record<string, ChatMetadata>>("chat_metadata");
      if (metadata) {
        Object.entries(metadata).forEach(([chatId, meta]) => {
          this.chatMetadata.set(chatId, {
            ...meta,
            lastAccessed: new Date(meta.lastAccessed),
            lastMessageTime: new Date(meta.lastMessageTime),
          });
        });
      }
      this.cleanupOldChats();
    } catch (error) {
      console.error("Failed to initialize message cache:", error);
      this.clearCorruptedData();
    }
  }

  // Get messages for a chat
  public getMessages(chatId: string): ChatMessage[] {
    if (!chatId) return [];

    if (this.memoryCache.has(chatId)) {
      this.updateChatAccess(chatId);
      return this.memoryCache.get(chatId)!.messages;
    }

    const chatData = this.loadChatFromStorage(chatId);
    if (chatData) {
      this.memoryCache.set(chatId, chatData);
      this.updateChatAccess(chatId);
      return chatData.messages;
    }

    return [];
  }

  // Add multiple messages (for history loading)
  public addMessages(chatId: string, messages: ChatMessage[], prepend: boolean = true): boolean {
    if (!chatId || !messages || messages.length === 0) return false;

    let chatData =
      this.memoryCache.get(chatId) || this.loadChatFromStorage(chatId) || {
        chatId,
        messages: [],
        pendingMessages: [],
        failedMessages: [],
      };

    const newMessages = messages.map(msg => ({
      ...msg,
      id: msg.id || this.generateMessageId(),
      timestamp: new Date(msg.timestamp),
      status: msg.status || "sent" as const,
    }));

    // Filter out duplicates
    const existingIds = new Set(chatData.messages.map(m => m.id));
    const uniqueMessages = newMessages.filter(m => !existingIds.has(m.id));

    if (uniqueMessages.length === 0) {
      return true; // All messages already exist
    }

    if (prepend) {
      // Add older messages to the beginning
      chatData.messages = [...uniqueMessages, ...chatData.messages];
    } else {
      // Add newer messages to the end
      chatData.messages = [...chatData.messages, ...uniqueMessages];
    }

    // Trim if exceeds max
    if (chatData.messages.length > this.options.maxMessagesPerChat * 2) {
      chatData.messages = chatData.messages.slice(-this.options.maxMessagesPerChat * 2);
    }

    this.memoryCache.set(chatId, chatData);

    const latestMessage = newMessages[newMessages.length - 1];
    this.updateChatMetadata(chatId, {
      messageCount: chatData.messages.length,
      lastMessageTime: latestMessage.timestamp,
    });

    setTimeout(() => this.saveChatToStorage(chatId), 0);
    return true;
  }

  // Add a new message
  public addMessage(chatId: string, message: ChatMessage): boolean {
    if (!chatId || !message) return false;

    const timestamp = new Date();
    const messageWithTimestamp: ChatMessage = {
      ...message,
      id: message.id || this.generateMessageId(),
      timestamp: message.timestamp || timestamp,
      status: message.status || "sent",
    };

    let chatData =
      this.memoryCache.get(chatId) || this.loadChatFromStorage(chatId) || {
        chatId,
        messages: [],
        pendingMessages: [],
        failedMessages: [],
      };

    // Check for duplicates in all arrays
    const isDuplicate =
      chatData.messages.some(m => m.id === messageWithTimestamp.id) ||
      chatData.pendingMessages.some(m => m.id === messageWithTimestamp.id) ||
      chatData.failedMessages.some(m => m.id === messageWithTimestamp.id);

    if (isDuplicate) {
      console.debug('Message already exists in cache:', messageWithTimestamp.id);
      return true;
    }

    if (messageWithTimestamp.status === "pending") {
      chatData.pendingMessages.push(messageWithTimestamp);
    } else if (messageWithTimestamp.status === "failed") {
      chatData.failedMessages.push(messageWithTimestamp);
    } else {
      chatData.messages.push(messageWithTimestamp);
      if (chatData.messages.length > this.options.maxMessagesPerChat) {
        chatData.messages = chatData.messages.slice(-this.options.maxMessagesPerChat);
      }
    }

    this.memoryCache.set(chatId, chatData);

    this.updateChatMetadata(chatId, {
      lastMessageTime: timestamp,
      messageCount: chatData.messages.length,
      hasUnread: message.incoming || false,
    });

    setTimeout(() => this.saveChatToStorage(chatId), 0);
    return true;
  }

  // Update message status
  public updateMessageStatus(
    chatId: string,
    messageId: string,
    newStatus: "sent" | "failed" | "pending",
    serverData: Partial<ChatMessage> = {}
  ): boolean {
    const chatData = this.memoryCache.get(chatId) || this.loadChatFromStorage(chatId);
    if (!chatData) return false;

    const pendingIndex = chatData.pendingMessages.findIndex((m) => m.id === messageId);
    if (pendingIndex !== -1) {
      const message = chatData.pendingMessages.splice(pendingIndex, 1)[0];
      message.status = newStatus;
      Object.assign(message, serverData);

      if (newStatus === "sent") chatData.messages.push(message);
      else chatData.failedMessages.push(message);

      this.memoryCache.set(chatId, chatData);
      setTimeout(() => this.saveChatToStorage(chatId), 0);
      return true;
    }

    return false;
  }

  public getAllMessages(chatId: string): {
    messages: ChatMessage[];
    pending: ChatMessage[];
    failed: ChatMessage[];
  } {
    let chatData = this.memoryCache.get(chatId);

    if (!chatData) {
      chatData = this.loadChatFromStorage(chatId) || undefined;
      if (chatData) {
        this.memoryCache.set(chatId, chatData);
      }
    }

    if (!chatData) {
      return { messages: [], pending: [], failed: [] };
    }

    return {
      messages: chatData.messages || [],
      pending: chatData.pendingMessages || [],
      failed: chatData.failedMessages || [],
    };
  }

  // Set history loading state
  public setHistoryLoadingState(chatId: string, isLoading: boolean): void {
    const chatData = this.memoryCache.get(chatId) || this.loadChatFromStorage(chatId);
    if (chatData) {
      chatData.isLoadingHistory = isLoading;
      this.memoryCache.set(chatId, chatData);
    }
  }

  // Update pagination state
  public updatePaginationState(chatId: string, hasMore: boolean, nextCursor: string | null): void {
    const chatData = this.memoryCache.get(chatId) || this.loadChatFromStorage(chatId);
    if (chatData) {
      chatData.hasMore = hasMore;
      chatData.nextCursor = nextCursor;
      this.memoryCache.set(chatId, chatData);
    }

    this.updateChatMetadata(chatId, {
      hasMore,
      nextCursor,
      historyLoaded: !hasMore,
    });

    setTimeout(() => this.saveChatToStorage(chatId), 0);
  }

  // Get pagination state
  public getPaginationState(chatId: string): { hasMore: boolean; nextCursor: string | null; isLoading: boolean } {
    const chatData = this.memoryCache.get(chatId) || this.loadChatFromStorage(chatId);
    const metadata = this.getChatMetadata(chatId);

    return {
      hasMore: chatData?.hasMore ?? metadata.hasMore ?? true,
      nextCursor: chatData?.nextCursor ?? metadata.nextCursor ?? null,
      isLoading: chatData?.isLoadingHistory ?? false,
    };
  }

  public clearChatMemory(chatId: string): void {
    if (this.memoryCache.has(chatId)) {
      this.saveChatToStorage(chatId);
      this.memoryCache.delete(chatId);
    }
  }

  public preloadChat(chatId: string): void {
    if (!this.memoryCache.has(chatId)) {
      const chatData = this.loadChatFromStorage(chatId);
      if (chatData) {
        this.memoryCache.set(chatId, chatData);
      }
    }
  }

  public getChatMetadata(chatId: string): ChatMetadata {
    return (
      this.chatMetadata.get(chatId) || {
        lastAccessed: new Date(),
        lastMessageTime: new Date(),
        messageCount: 0,
        unreadCount: 0,
        hasUnread: false,
        isPinned: false,
        hasMore: true,
        nextCursor: null,
        historyLoaded: false,
      }
    );
  }

  public updateChatMetadata(chatId: string, updates: Partial<ChatMetadata>): void {
    const existing = this.getChatMetadata(chatId);
    const updated: ChatMetadata = { ...existing, ...updates, lastAccessed: new Date() };
    this.chatMetadata.set(chatId, updated);
    this.saveMetadataToStorage();
  }

  public markChatAsRead(chatId: string): void {
    this.updateChatMetadata(chatId, { hasUnread: false, unreadCount: 0 });
  }

  private loadChatFromStorage(chatId: string): ChatData | null {
    try {
      const stored = this.getFromStorage<ChatData>(`chat_${chatId}`);
      if (stored) {
        stored.messages = (stored.messages || []).map((msg) => ({
          ...msg,
          timestamp: new Date(msg.timestamp!),
        }));
        stored.pendingMessages = (stored.pendingMessages || []).map((msg) => ({
          ...msg,
          timestamp: new Date(msg.timestamp!),
        }));
        stored.failedMessages = (stored.failedMessages || []).map((msg) => ({
          ...msg,
          timestamp: new Date(msg.timestamp!),
        }));
        return stored;
      }
    } catch (error) {
      console.error(`Failed to load chat ${chatId}:`, error);
    }
    return null;
  }

  private saveChatToStorage(chatId: string): void {
    const chatData = this.memoryCache.get(chatId);
    if (!chatData) return;

    try {
      if (this.isStorageQuotaExceeded()) {
        this.performEmergencyCleanup();
      }
      this.setToStorage(`chat_${chatId}`, chatData);
    } catch (error: any) {
      console.error(`Failed to save chat ${chatId}:`, error);
      if (error.name === "QuotaExceededError") this.handleStorageQuotaExceeded();
    }
  }

  private saveMetadataToStorage(): void {
    try {
      const metadata: Record<string, ChatMetadata> = {};
      this.chatMetadata.forEach((value, key) => {
        metadata[key] = value;
      });
      this.setToStorage("chat_metadata", metadata);
    } catch (error) {
      console.error("Failed to save metadata:", error);
    }
  }

  private updateChatAccess(chatId: string): void {
    this.updateChatMetadata(chatId, { lastAccessed: new Date() });
  }

  private generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getFromStorage<T>(key: string): T | null {
    if (!isBrowser()) return null;
    try {
      const item = localStorage.getItem(`msgcache_${key}`);
      return item ? (JSON.parse(item) as T) : null;
    } catch (error) {
      console.error(`Failed to get ${key} from storage:`, error);
      return null;
    }
  }

  private setToStorage(key: string, value: unknown): void {
    if (!isBrowser()) return;
    try {
      localStorage.setItem(`msgcache_${key}`, JSON.stringify(value));
    } catch (error: any) {
      if (error.name === "QuotaExceededError") throw error;
      console.error(`Failed to set ${key} to storage:`, error);
    }
  }

  private isStorageQuotaExceeded(): boolean {
    if (!isBrowser()) return false;
    try {
      let totalSize = 0;
      for (let key in localStorage) {
        if (key.startsWith("msgcache_")) totalSize += localStorage[key].length;
      }
      const usageMB = totalSize / (1024 * 1024);
      return usageMB > this.options.maxStorageSizeMB;
    } catch {
      return false;
    }
  }

  private performEmergencyCleanup(): void {
    console.warn("Performing emergency cleanup due to storage quota");
    const chatIds = Array.from(this.chatMetadata.keys()).sort((a, b) => {
      const metaA = this.chatMetadata.get(a)!;
      const metaB = this.chatMetadata.get(b)!;
      return metaA.lastAccessed.getTime() - metaB.lastAccessed.getTime();
    });

    const toRemove = Math.ceil(chatIds.length * 0.25);
    for (let i = 0; i < toRemove && i < chatIds.length; i++) {
      this.removeChatFromStorage(chatIds[i]);
    }
  }

  private handleStorageQuotaExceeded(): void {
    console.error("Storage quota exceeded, performing cleanup");
    this.performEmergencyCleanup();
  }

  private cleanupOldChats(): void {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - this.options.cleanupThresholdDays);

    this.chatMetadata.forEach((metadata, chatId) => {
      if (metadata.lastAccessed < cutoffDate && !metadata.isPinned) {
        this.removeChatFromStorage(chatId);
      }
    });
  }

  private removeChatFromStorage(chatId: string): void {
    if (!isBrowser()) return;
    try {
      localStorage.removeItem(`msgcache_chat_${chatId}`);
      this.chatMetadata.delete(chatId);
      this.memoryCache.delete(chatId);
    } catch (error) {
      console.error(`Failed to remove chat ${chatId}:`, error);
    }
  }

  private clearCorruptedData(): void {
    if (!isBrowser()) return;
    console.warn("Clearing corrupted cache data");
    this.memoryCache.clear();
    this.chatMetadata.clear();

    const keysToRemove: string[] = [];
    for (let key in localStorage) {
      if (key.startsWith("msgcache_")) keysToRemove.push(key);
    }
    keysToRemove.forEach((key) => localStorage.removeItem(key));
  }

  public getStats(): CacheStats {
    return {
      memoryCacheSize: this.memoryCache.size,
      totalChats: this.chatMetadata.size,
      storageUsage: this.getStorageUsage(),
      oldestChat: this.getOldestChatDate(),
      newestChat: this.getNewestChatDate(),
    };
  }

  private getStorageUsage(): { bytes: number; mb: string } {
    if (!isBrowser()) return { bytes: 0, mb: "0.00" };
    try {
      let totalSize = 0;
      for (let key in localStorage) {
        if (key.startsWith("msgcache_")) totalSize += localStorage[key].length;
      }
      return { bytes: totalSize, mb: (totalSize / (1024 * 1024)).toFixed(2) };
    } catch {
      return { bytes: 0, mb: "0.00" };
    }
  }

  private getOldestChatDate(): Date | null {
    let oldest: Date | null = null;
    this.chatMetadata.forEach((metadata) => {
      if (!oldest || metadata.lastAccessed < oldest) oldest = metadata.lastAccessed;
    });
    return oldest;
  }

  private getNewestChatDate(): Date | null {
    let newest: Date | null = null;
    this.chatMetadata.forEach((metadata) => {
      if (!newest || metadata.lastAccessed > newest) newest = metadata.lastAccessed;
    });
    return newest;
  }

  public cleanup(): void {
    this.cleanupOldChats();
    this.saveMetadataToStorage();
  }

  public clearAll(): void {
    this.memoryCache.clear();
    this.chatMetadata.clear();

    const keysToRemove: string[] = [];
    for (let key in localStorage) {
      if (key.startsWith("msgcache_")) keysToRemove.push(key);
    }
    keysToRemove.forEach((key) => localStorage.removeItem(key));
  }
}

// Export singleton
let messageCacheInstance: MessageCache | null = null;

export function getMessageCache(): MessageCache {
  if (!messageCacheInstance) {
    if (isBrowser()) {
      messageCacheInstance = new MessageCache({
        maxMessagesPerChat: 100,
        maxCachedChats: 30,
        maxStorageSizeMB: 3,
        cleanupThresholdDays: 30,
      });
    } else {
      messageCacheInstance = new MessageCache({});
    }
  }
  return messageCacheInstance;
}

export default MessageCache;