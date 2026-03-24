import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5001';

export function useSocket() {
  const [socket, setSocket] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const newSocket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
    });

    newSocket.on('connect', () => {
      setConnected(true);
    });

    newSocket.on('disconnect', () => {
      setConnected(false);
    });

    newSocket.on('newAlert', (alert) => {
      setAlerts(prev => [alert, ...prev]);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  return { socket, alerts, connected, setAlerts };
}
