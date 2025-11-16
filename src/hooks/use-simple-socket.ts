'use client';

import { useEffect, useState } from 'react';

export const useSimpleSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  useEffect(() => {
    // Simple connection check
    const checkConnection = async () => {
      try {
        const response = await fetch('/api/socket');
        const data = await response.json();
        setIsConnected(true);
        setLastUpdate(`Connected at ${new Date().toLocaleTimeString()}`);
      } catch (error) {
        console.error('Socket connection failed:', error);
        setIsConnected(false);
      }
    };

    // Check connection every 5 seconds
    checkConnection();
    const interval = setInterval(checkConnection, 5000);

    return () => clearInterval(interval);
  }, []);

  const emit = async (event: string, data: any) => {
    try {
      await fetch('/api/socket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event, data })
      });
    } catch (error) {
      console.error('Socket emit failed:', error);
    }
  };

  return {
    isConnected,
    lastUpdate,
    emit
  };
};