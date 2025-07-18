export const getServerURL = () => {
    const isServer = typeof window === 'undefined';
    if (isServer) {
        return process.env.INTERNAL_API_BASE_URL || 'http://localhost:8080/api';
    }
    return process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:8080/api';
};


export const getWebSocketURL = () => {
    const isServer = typeof window === 'undefined';
    return process.env.NEXT_PUBLIC_CHAT_URL || 'ws://localhost:8080/ws/chat';
};
