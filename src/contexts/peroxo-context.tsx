'use client';
import React, {
    createContext, useContext, useEffect, useRef, useState,
    useCallback, ReactNode
} from 'react';
import { useApp } from './app-context';

const PEROXO_SOCKET_URL = process.env.NEXT_PUBLIC_PEROXO_SOCKET_URL || 'ws://localhost:4001';

type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

interface WebSocketContextType {
    connectionStatus: ConnectionStatus;
    error: string | null;
    reconnectAttempts: number;
    isConnected: boolean;
    isConnecting: boolean;
    isDisconnected: boolean;
    sendMessage: (message: string | object) => boolean;
    connect: () => void;
    disconnect: () => void;
    reconnect: () => void;
    addMessageHandler: (handler: (message: any) => void) => () => void;
    addConnectionHandler: (handler: (status: ConnectionStatus, event?: CloseEvent | Event) => void) => () => void;
}

interface PeroxoWebSocketProviderProps { children: ReactNode; }

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export const useWebSocket = (): WebSocketContextType => {
    const ctx = useContext(WebSocketContext);
    if (!ctx) throw new Error('useWebSocket must be used within a WebSocketProvider');
    return ctx;
};

export const PeroxoWebSocketProvider: React.FC<PeroxoWebSocketProviderProps> = ({ children }) => {
    const { user } = useApp();

    // Keep user_id stable and react to cross-tab changes
    const [userId, setUserId] = useState<string | null>(null);
    useEffect(() => {
        const id = user?.id ?? (typeof window !== 'undefined' ? localStorage.getItem('user_id') : null);
        setUserId(id ?? null);
        const onStorage = (e: StorageEvent) => {
            if (e.key === 'user_id') setUserId(e.newValue);
        };
        window.addEventListener('storage', onStorage);
        return () => window.removeEventListener('storage', onStorage);
    }, [user?.id]);

    const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
    const [error, setError] = useState<string | null>(null);
    const [reconnectAttempts, setReconnectAttempts] = useState(0);

    const socketRef = useRef<WebSocket | null>(null);
    const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const manualCloseRef = useRef(false);

    const messageHandlersRef = useRef(new Set<(message: any) => void>());
    const connectionHandlersRef = useRef(new Set<(status: ConnectionStatus, event?: CloseEvent | Event) => void>());

    const MAX_RECONNECT_ATTEMPTS = 5;
    const BASE_RECONNECT_INTERVAL = 1500;

    const safeClearTimer = () => {
        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
            reconnectTimeoutRef.current = null;
        }
    };

    const hardCloseSocket = () => {
        const s = socketRef.current;
        if (!s) return;
        s.onopen = null;
        s.onclose = null;
        s.onerror = null;
        s.onmessage = null;
        try { s.close(); } catch { }
        socketRef.current = null;
    };

    const cleanup = useCallback(() => {
        safeClearTimer();
        hardCloseSocket();
    }, []);

    const notifyConnectionHandlers = (status: ConnectionStatus, evt?: CloseEvent | Event) => {
        for (const h of connectionHandlersRef.current) {
            try { h(status, evt); } catch (e) { console.error('Error in connection handler:', e); }
        }
    };

    const sendMessage = useCallback((message: string | object): boolean => {
        const s = socketRef.current;
        if (!s || s.readyState !== WebSocket.OPEN) throw new Error('WebSocket is not connected');
        s.send(typeof message === 'string' ? message : JSON.stringify(message));
        return true;
    }, []);

    const addMessageHandler = useCallback((handler: (message: any) => void) => {
        messageHandlersRef.current.add(handler);
        return () => { messageHandlersRef.current.delete(handler); };
    }, []);

    const addConnectionHandler = useCallback((handler: (status: ConnectionStatus, event?: CloseEvent | Event) => void) => {
        connectionHandlersRef.current.add(handler);
        return () => { connectionHandlersRef.current.delete(handler); };
    }, []);

    // Core single-flight connect using token = user_id
    const connectOnce = useCallback(() => {
        const authKey = userId ? String(userId) : null;
        if (!authKey) {
            setConnectionStatus('disconnected');
            setError('User ID is required for connection');
            return;
        }

        // prevent duplicate connects if OPEN or CONNECTING
        const existing = socketRef.current;
        if (existing && (existing.readyState === WebSocket.OPEN || existing.readyState === WebSocket.CONNECTING)) {
            return;
        }

        manualCloseRef.current = false;
        cleanup();
        setConnectionStatus('connecting');
        setError(null);

        try {
            const wsUrl = `${PEROXO_SOCKET_URL.replace(/\/$/, '')}/ws?token=${encodeURIComponent(authKey)}`;
            const ws = new WebSocket(wsUrl);
            socketRef.current = ws;

            ws.onopen = () => {
                setConnectionStatus('connected');
                setReconnectAttempts(0);
                setError(null);
                notifyConnectionHandlers('connected');
            };

            ws.onmessage = (evt: MessageEvent) => {
                try {
                    const msg = JSON.parse(evt.data);
                    for (const h of messageHandlersRef.current) {
                        try { h(msg); } catch (e) { console.error('Error in message handler:', e); }
                    }
                } catch (e) {
                    console.error('Failed to parse WebSocket message:', e);
                }
            };

            ws.onerror = (evt) => {
                console.error('WebSocket error:', evt);
                setError('WebSocket connection error');
                setConnectionStatus('error');
                notifyConnectionHandlers('error', evt);
            };

            ws.onclose = (evt: CloseEvent) => {
                socketRef.current = null;
                setConnectionStatus('disconnected');
                notifyConnectionHandlers('disconnected', evt);

                if (manualCloseRef.current || evt.code === 1000) return;         // no auto-reconnect on manual/normal close
                if (!authKey) return;                                            // no creds → no reconnect

                setReconnectAttempts(prev => {
                    const next = prev + 1;
                    if (next <= MAX_RECONNECT_ATTEMPTS) {
                        const delay = BASE_RECONNECT_INTERVAL * Math.pow(2, prev);
                        reconnectTimeoutRef.current = setTimeout(() => {
                            if (socketRef.current == null && !manualCloseRef.current) connectOnce();
                        }, delay);
                    } else {
                        setError('Maximum reconnection attempts reached');
                    }
                    return next;
                });
            };
        } catch (e) {
            console.error('Failed to create WebSocket connection:', e);
            setError('Failed to create WebSocket connection');
            setConnectionStatus('error');
        }
    }, [userId, cleanup]);

    // Auto-connect when userId is available
    useEffect(() => {
        if (!userId) {
            cleanup();
            setConnectionStatus('disconnected');
            setReconnectAttempts(0);
            return;
        }
        if (connectionStatus === 'disconnected') {
            connectOnce();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId]); // keep lean to avoid loops

    const disconnect = useCallback(() => {
        manualCloseRef.current = true; // suppress auto-reconnect
        cleanup();
        setConnectionStatus('disconnected');
        setReconnectAttempts(0);
    }, [cleanup]);

    const reconnect = useCallback(() => {
        manualCloseRef.current = false;
        cleanup();
        setReconnectAttempts(0);
        setConnectionStatus('disconnected');
        connectOnce();
    }, [cleanup, connectOnce]);

    const connect = useCallback(() => {
        if (connectionStatus === 'disconnected') connectOnce();
    }, [connectionStatus, connectOnce]);

    // Visibility / online handlers
    useEffect(() => {
        const onVisible = () => {
            if (document.visibilityState === 'visible' && connectionStatus === 'disconnected' && userId) {
                reconnect();
            }
        };
        const onOnline = () => {
            if (connectionStatus === 'disconnected' && userId) reconnect();
        };
        const onOffline = () => {
            setConnectionStatus('disconnected');
            cleanup();
        };
        document.addEventListener('visibilitychange', onVisible);
        window.addEventListener('online', onOnline);
        window.addEventListener('offline', onOffline);
        return () => {
            document.removeEventListener('visibilitychange', onVisible);
            window.removeEventListener('online', onOnline);
            window.removeEventListener('offline', onOffline);
        };
    }, [connectionStatus, userId, reconnect, cleanup]);

    const value: WebSocketContextType = {
        connectionStatus,
        error,
        reconnectAttempts,
        isConnected: connectionStatus === 'connected',
        isConnecting: connectionStatus === 'connecting',
        isDisconnected: connectionStatus === 'disconnected',
        sendMessage,
        connect,
        disconnect,
        reconnect,
        addMessageHandler,
        addConnectionHandler,
    };

    return <WebSocketContext.Provider value={value}>{children}</WebSocketContext.Provider>;
};
