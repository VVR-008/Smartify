import React, { createContext, useState, useEffect, useContext } from "react";

const WebSocketContext = createContext();

export const useWebSocket = () => {
    return useContext(WebSocketContext);
};

export const WebSocketProvider = ({ children }) => {
    const [ws, setWs] = useState(null);
    const [messages, setMessages] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const socket = new WebSocket(process.env.REACT_APP_WS);

        socket.onopen = () => {
            console.log("WebSocket connected!");
            setIsConnected(true);
        };

        socket.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data);
                console.log("Received message from WebSocket:", message);
                setMessages(message);
            } catch (error) {
                console.error("Error parsing WebSocket message:", error);
            }
        };
        

        socket.onerror = (error) => {
            console.error("WebSocket error:", error);
            setIsConnected(false);
        };

        socket.onclose = () => {
            console.log("WebSocket connection closed");
            setIsConnected(false);
        };

        setWs(socket);

        return () => {
            if (socket) {
                socket.close();
            }
        };
    }, []);

    const sendMessage = (message) => {
        if (ws && isConnected) {
            ws.send(message);
            console.log("Sent message to WebSocket:", message);
        } else {
            console.log("WebSocket is not connected, message not sent.");
        }
    };

    return (
        <WebSocketContext.Provider value={{ sendMessage, messages, isConnected }}>
            {children}
        </WebSocketContext.Provider>
    );
};
