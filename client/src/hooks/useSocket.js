import { useEffect, useState } from 'react';

// In production (Vercel), skip WebSocket — serverless doesn't support it
const IS_DEV = typeof window !== 'undefined' && window.location.hostname === 'localhost';

export function useSocket() {
  const [alerts, setAlerts] = useState([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!IS_DEV) return; // skip socket in production

    let newSocket;
    import('socket.io-client').then(({ io }) => {
      newSocket = io('http://localhost:5001', {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionDelay: 1000,
        timeout: 5000,
      });

      newSocket.on('connect', () => setConnected(true));
      newSocket.on('disconnect', () => setConnected(false));
      newSocket.on('newAlert', (alert) => setAlerts(prev => [alert, ...prev]));
      newSocket.on('connect_error', () => setConnected(false));
    }).catch(() => {
      // socket.io-client not available — silently skip
    });

    return () => {
      if (newSocket) newSocket.close();
    };
  }, []);

  return { socket: null, alerts, connected, setAlerts };
}
