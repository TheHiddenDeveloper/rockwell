import { useState, useEffect } from 'react';

interface NetworkStatus {
  isConnected: boolean;
  status: string;
  signalStrength: number;
  lastFailure: string | null;
  addAlert: (message: string, type: 'error' | 'warning' | 'info') => void;
}

export const useNetwork = () => {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    isConnected: true,
    status: 'Online',
    signalStrength: 100,
    lastFailure: null,
    addAlert: (message: string, type: 'error' | 'warning' | 'info') => {
      console.log(`Network Alert - ${type}: ${message}`);
      // You might want to integrate this with your toast system or alert system
    }
  });

  useEffect(() => {
    // Simulate network status changes
    const simulateNetworkChanges = () => {
      const randomSignal = Math.floor(Math.random() * 100);
      const isConnected = randomSignal > 20; // 20% chance of being disconnected
      
      setNetworkStatus(prev => ({
        ...prev,
        isConnected,
        status: isConnected ? 'Online' : 'Offline',
        signalStrength: randomSignal,
        lastFailure: !isConnected ? new Date().toISOString() : prev.lastFailure
      }));
    };

    // Initial check
    simulateNetworkChanges();
    // Update every 5 seconds
    const interval = setInterval(simulateNetworkChanges, 5000);

    return () => clearInterval(interval);
  }, []);

  const addAlert = (message: string, type: 'error' | 'warning' | 'info') => {
    // Here you can implement your alert logic
    console.log(`Network Alert - ${type}: ${message}`);
    // You might want to integrate this with your toast system or alert system
  };

  return {
    ...networkStatus,
    addAlert
  } as const;
};
