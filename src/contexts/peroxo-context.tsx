/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
    useCallback,
    ReactNode,
} from "react";
import { useApp } from "./app-context";
import { getAuthToken } from "@/lib/api";

const PEROXO_SOCKET_URL =
    process.env.NEXT_PUBLIC_PEROXO_SOCKET_URL || "ws://localhost:4001";

/** ---- TYPES ---- **/

type ConnectionStatus = "connecting" | "connected" | "disconnected" | "error";

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
    addConnectionHandler: (
        handler: (status: ConnectionStatus, event?: CloseEvent | Event) => void
    ) => () => void;
}

interface PeroxoWebSocketProviderProps {
    children: ReactNode;
}

/** ---- CONTEXT ---- **/

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export const useWebSocket = (): WebSocketContextType => {
    const context = useContext(WebSocketContext);
    if (!context) {
        throw new Error("useWebSockgetOnlineUserset must be used within a WebSocketProvider");
    }
    return context;
};

/** ---- PROVIDER COMPONENT ---- **/

export const PeroxoWebSocketProvider: React.FC<PeroxoWebSocketProviderProps> = ({
    children,
}) => {
    const { user } = useApp();
    const token = getAuthToken();

    const prevTokenRef = useRef<string | null>();
    useEffect(() => {
        if (prevTokenRef.current !== token) {
            console.log("PeroxoWebSocketProvider token changed:", token);
            prevTokenRef.current = token;
        }
    }, [token]);

    const [connectionStatus, setConnectionStatus] =
        useState<ConnectionStatus>("disconnected");
    const [error, setError] = useState<string | null>(null);
    const [reconnectAttempts, setReconnectAttempts] = useState(0);

    const socketRef = useRef<WebSocket | null>(null);
    const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
        null
    );
    const messageHandlersRef = useRef<Set<(message: any) => void>>(new Set());
    const connectionHandlersRef = useRef<
        Set<(status: ConnectionStatus, event?: CloseEvent | Event) => void>
    >(new Set());

    const MAX_RECONNECT_ATTEMPTS = 5;
    const RECONNECT_INTERVAL = 3000;

    /** ---- CLEANUP ---- **/
    const cleanup = useCallback(() => {
        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
            reconnectTimeoutRef.current = null;
        }

        if (socketRef.current) {
            socketRef.current.onopen = null;
            socketRef.current.onclose = null;
            socketRef.current.onerror = null;
            socketRef.current.onmessage = null;

            if (socketRef.current.readyState === WebSocket.OPEN) {
                socketRef.current.close();
            }
            socketRef.current = null;
        }
    }, []);

    /** ---- SEND MESSAGE ---- **/
    const sendMessage = useCallback((message: string | object): boolean => {
        if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
            throw new Error("WebSocket is not connected");
        }

        try {
            const messageStr =
                typeof message === "string" ? message : JSON.stringify(message);
            socketRef.current.send(messageStr);
            return true;
        } catch (err) {
            console.error("Failed to send message:", err);
            throw err;
        }
    }, []);

    /** ---- HANDLERS ---- **/
    const addMessageHandler = useCallback(
        (handler: (message: any) => void) => {
            messageHandlersRef.current.add(handler);
            return () => {
                messageHandlersRef.current.delete(handler);
            };
        },
        []
    );

    const addConnectionHandler = useCallback(
        (handler: (status: ConnectionStatus, event?: CloseEvent | Event) => void) => {
            connectionHandlersRef.current.add(handler);
            return () => {
                connectionHandlersRef.current.delete(handler);
            };
        },
        []
    );

    /** ---- DISCONNECT ---- **/
    const disconnect = useCallback(() => {
        cleanup();
        setConnectionStatus("disconnected");
        setReconnectAttempts(0);
    }, [cleanup]);

    /** ---- MAIN CONNECTION EFFECT ---- **/
    useEffect(() => {
        let currentSocket: WebSocket | null = null;
        let reconnectTimeout: ReturnType<typeof setTimeout> | null = null;

        const connectToWebSocket = () => {
            if (!token && !user?.id) {
                console.log("Token not available, skipping connection");
                setConnectionStatus("disconnected");
                setError("Token is required for connection");
                return;
            }

            // Clean up existing connection
            if (currentSocket) {
                currentSocket.onopen = null;
                currentSocket.onclose = null;
                currentSocket.onerror = null;
                currentSocket.onmessage = null;
                if (currentSocket.readyState === WebSocket.OPEN) {
                    currentSocket.close();
                }
            }

            if (reconnectTimeout) {
                clearTimeout(reconnectTimeout);
                reconnectTimeout = null;
            }

            setConnectionStatus("connecting");
            setError(null);

            try {
                const wsUrl = `${PEROXO_SOCKET_URL}/ws?token=${user?.id}`;
                console.log("Connecting to WebSocket:", wsUrl);

                currentSocket = new WebSocket(wsUrl);
                socketRef.current = currentSocket;

                currentSocket.onopen = () => {
                    console.log("WebSocket connected");
                    setConnectionStatus("connected");
                    setReconnectAttempts(0);
                    setError(null);

                    connectionHandlersRef.current.forEach((handler) => {
                        try {
                            handler("connected");
                        } catch (e) {
                            console.error("Error in connection handler:", e);
                        }
                    });
                };

                currentSocket.onclose = (event) => {
                    console.log("WebSocket disconnected:", event.code, event.reason);
                    setConnectionStatus("disconnected");

                    connectionHandlersRef.current.forEach((handler) => {
                        try {
                            handler("disconnected", event);
                        } catch (e) {
                            console.error("Error in connection handler:", e);
                        }
                    });

                    if (event.code !== 1000 && token) {
                        setReconnectAttempts((prev) => {
                            const newAttempts = prev + 1;
                            if (newAttempts <= MAX_RECONNECT_ATTEMPTS) {
                                console.log(
                                    `Scheduling reconnect attempt ${newAttempts}/${MAX_RECONNECT_ATTEMPTS}`
                                );
                                reconnectTimeout = setTimeout(() => {
                                    connectToWebSocket();
                                }, RECONNECT_INTERVAL * Math.pow(2, prev));
                            } else {
                                setError("Maximum reconnection attempts reached");
                            }
                            return newAttempts;
                        });
                    }
                };

                currentSocket.onerror = (event) => {
                    console.error("WebSocket error:", event);
                    setError("WebSocket connection error");
                    setConnectionStatus("disconnected");

                    connectionHandlersRef.current.forEach((handler) => {
                        try {
                            handler("error", event);
                        } catch (e) {
                            console.error("Error in connection handler:", e);
                        }
                    });
                };

                currentSocket.onmessage = (event: MessageEvent) => {
                    try {
                        const message = JSON.parse(event.data);
                        messageHandlersRef.current.forEach((handler) => {
                            try {
                                handler(message);
                            } catch (e) {
                                console.error("Error in message handler:", e);
                            }
                        });
                    } catch (err) {
                        console.error("Failed to parse WebSocket message:", err);
                    }
                };
            } catch (err) {
                console.error("Failed to create WebSocket connection:", err);
                setError("Failed to create WebSocket connection");
                setConnectionStatus("disconnected");
            }
        };

        if (token) {
            console.log("Token available, connecting to WebSocket");
            connectToWebSocket();
        } else {
            console.log("No token available, disconnecting WebSocket");
            if (socketRef.current) {
                socketRef.current.close();
            }

            setConnectionStatus("disconnected");
            setReconnectAttempts(0);
        }

        return () => {
            if (reconnectTimeout) clearTimeout(reconnectTimeout);
            if (currentSocket) {
                currentSocket.onopen = null;
                currentSocket.onclose = null;
                currentSocket.onerror = null;
                currentSocket.onmessage = null;
                if (currentSocket.readyState === WebSocket.OPEN) {
                    currentSocket.close();
                }
            }
        };
    }, [token, user?.id]);

    /** ---- MANUAL RECONNECT ---- **/
    const reconnect = useCallback(() => {
        setReconnectAttempts(0);
    }, []);

    const connect = useCallback(() => {
        if (token) {
            setReconnectAttempts(0);
        }
    }, [token]);

    /** ---- VISIBILITY / ONLINE HANDLERS ---- **/
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (
                document.visibilityState === "visible" &&
                connectionStatus === "disconnected" &&
                token
            ) {
                reconnect();
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, [connectionStatus, token, reconnect]);

    useEffect(() => {
        const handleOnline = () => {
            if (connectionStatus === "disconnected" && token) {
                reconnect();
            }
        };
        const handleOffline = () => {
            setConnectionStatus("disconnected");
        };

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, [connectionStatus, token, reconnect]);

    /** ---- CONTEXT VALUE ---- **/
    const contextValue: WebSocketContextType = {
        connectionStatus,
        error,
        reconnectAttempts,
        isConnected: connectionStatus === "connected",
        isConnecting: connectionStatus === "connecting",
        isDisconnected: connectionStatus === "disconnected",
        sendMessage,
        connect,
        disconnect,
        reconnect,
        addMessageHandler,
        addConnectionHandler,
    };

    return (
        <WebSocketContext.Provider value={contextValue}>
            {children}
        </WebSocketContext.Provider>
    );
};
