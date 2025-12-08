import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Database, CloudUpload, AlertCircle } from 'lucide-react';
import { useNetwork } from '@/hooks/use-network';

interface SyncEvent {
  eventType: string;
  timestamp: string;
  data: any;
  attempts: number;
  lastAttempt: string | null;
}

const OfflineSync = () => {
  const { isConnected } = useNetwork();
  const [pendingSyncs, setPendingSyncs] = useState<SyncEvent[]>([]);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    // Simulate fetching pending sync events
    const fetchPendingSyncs = async () => {
      const mockSyncEvents: SyncEvent[] = [
        {
          eventType: 'Fatigue Alert',
          timestamp: '2025-06-23T10:25:00',
          data: { driverId: 'D-001', severity: 'High' },
          attempts: 3,
          lastAttempt: '2025-06-23T10:28:00'
        },
        {
          eventType: 'Speed Warning',
          timestamp: '2025-06-23T10:20:00',
          data: { truckId: 'T-002', speed: 85 },
          attempts: 2,
          lastAttempt: '2025-06-23T10:27:00'
        }
      ];
      setPendingSyncs(mockSyncEvents);
    };

    fetchPendingSyncs();
    const interval = setInterval(fetchPendingSyncs, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const handleSync = async () => {
    if (syncing || !isConnected) return;
    
    setSyncing(true);
    try {
      // Simulate sync process
      await new Promise(resolve => setTimeout(resolve, 2000));
      // In a real implementation, this would send data to your backend
      setPendingSyncs([]);
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Offline Sync Status</CardTitle>
          <Badge variant={isConnected ? 'default' : 'destructive'}>
            {isConnected ? 'Online' : 'Offline'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 mb-4">
          <Database className="h-4 w-4" />
          <span>Pending Syncs: {pendingSyncs.length}</span>
        </div>
        
        {pendingSyncs.map((event, index) => (
          <div key={index} className="flex items-center justify-between p-2 border rounded-md">
            <div>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                <span>{event.eventType}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Last Attempt: {event.lastAttempt ? new Date(event.lastAttempt).toLocaleTimeString() : 'Never'}
              </p>
            </div>
            <Badge variant="outline">{event.attempts} attempts</Badge>
          </div>
        ))}

        {!isConnected && (
          <div className="text-sm text-muted-foreground mt-2">
            Network is currently offline. Events will be synced automatically when connection is restored.
          </div>
        )}

        <button
          onClick={handleSync}
          disabled={syncing || !pendingSyncs.length || !isConnected}
          className={`mt-4 px-4 py-2 rounded-md ${
            syncing ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {syncing ? 'Syncing...' : 'Force Sync'}
        </button>
      </CardContent>
    </Card>
  );
};

export default OfflineSync;
