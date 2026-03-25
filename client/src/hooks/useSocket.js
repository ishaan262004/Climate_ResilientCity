import { useEffect, useState } from 'react';

// Socket.IO is only available in local development
// In production (Vercel), we skip WebSocket connections entirely
const IS_PRODUCTION = typeof window !== 'undefined' && !window.location.hostname.includes('localhost');

export function useSocket() {
  const [socket, setSocket] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Skip socket connection in production (serverless doesn't support WebSockets)
    if (IS_PRODUCTION) return;

    let newSocket;
    try {
      const { io } = require('socket.io-client');
      newSocket = io('http://localhost:5001', {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionDelay: 1000,
        timeout: 5000,
      });

      newSocket.on('connect', () => setConnected(true));
      newSocket.on('disconnect', () => setConnected(false));
      newSocket.on('newAlert', (alert) => setAlerts(prev => [alert, ...prev]));
      newSocket.on('connect_error', () => {
        // Silently fail — server may not be running
        setConnected(false);
      });

      setSocket(newSocket);
    } catch (e) {
      // socket.io-client may not be available
      console.warn('Socket.IO not available:', e.message);
    }

    return () => {
      if (newSocket) newSocket.close();
    };
  }, []);

  return { socket, alerts, connected, setAlerts };
}
