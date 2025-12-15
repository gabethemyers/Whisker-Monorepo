import { Client, IMessage } from '@stomp/stompjs';
import { useCallback, useEffect, useRef, useState } from 'react';
import SockJS from 'sockjs-client';
import { getJwt } from '../utils/auth';

export interface ChatMessage {
    id?: number; // Added for compatibility
    senderId: number;
    recipientId: number;
    content: string;
    timestamp?: string;
}

interface UseWebSocketProps {
    userId: number | null;
    wsUrl: string;
}

export function useWebSocket({ userId, wsUrl }: UseWebSocketProps) {
    const [connected, setConnected] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const clientRef = useRef<Client | null>(null);

    // Connect to WebSocket
    useEffect(() => {
        if (!userId) return;

        const connect = async () => {
            const token = await getJwt();

            const client = new Client({
                webSocketFactory: () => new SockJS(wsUrl),
                connectHeaders: {
                    Authorization: `Bearer ${token}`,
                },
                reconnectDelay: 5000,
                heartbeatIncoming: 4000,
                heartbeatOutgoing: 4000,
                onConnect: () => {
                    setConnected(true);

                    // Subscribe to private messages for this user
                    client.subscribe(`/user/queue/private-${userId}`, (message: IMessage) => {
                        try {
                            const receivedMessage: ChatMessage = JSON.parse(message.body);
                            setMessages((prev) => [...prev, receivedMessage]);
                        } catch (error) {
                            console.error('Error parsing message:', error);
                        }
                    });
                },
                onDisconnect: () => {
                    console.log('Disconnected from WebSocket');
                    setConnected(false);
                },
                onStompError: (frame) => {
                    console.error('STOMP error:', frame);
                    setConnected(false);
                },
            });

            client.activate();
            clientRef.current = client;
        };

        connect();

        return () => {
            if (clientRef.current) {
                clientRef.current.deactivate();
            }
        };
    }, [userId, wsUrl]);

    // Send message function
    const sendMessage = useCallback((recipientId: number, content: string) => {
        if (!clientRef.current || !connected || !userId) {
            console.error('Cannot send message: not connected or no userId');
            return;
        }

        const message: ChatMessage = {
            senderId: userId,
            recipientId,
            content,
        };

        try {
            clientRef.current.publish({
                destination: '/app/chat.sendMessage',
                body: JSON.stringify(message),
            });

            // Add sent message to local state
            setMessages((prev) => [...prev, { ...message, timestamp: new Date().toISOString() }]);
        } catch (error) {
            console.error('Error sending message:', error);
        }
    }, [connected, userId]);

    // Clear messages
    const clearMessages = useCallback(() => {
        setMessages([]);
    }, []);

    return {
        connected,
        messages,
        sendMessage,
        clearMessages,
    };
}
