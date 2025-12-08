
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Clock, CheckCircle } from 'lucide-react';

interface TruckData {
  truckID: string;
  isSynced: boolean;
  lastSyncTime: string;
  networkStatus: 'Online' | 'Flaky' | 'Offline';
  bufferCount: number;
  pendingEvents: Array<{
    eventType: string;
    eventTime: string;
    delayMinutes: number;
  }>;
}

interface SmartAlertsProps {
  trucks: TruckData[];
  activeFilter: 'all' | 'delayed' | 'critical';
}

const SmartAlerts = ({ trucks, activeFilter }: SmartAlertsProps) => {
  const criticalTrucks = trucks.filter(truck => 
    !truck.isSynced && truck.pendingEvents.some(event => event.delayMinutes > 15)
  );
  const delayedTrucks = trucks.filter(truck => 
    !truck.isSynced && truck.pendingEvents.some(event => event.delayMinutes <= 15 && event.delayMinutes > 5)
  );
  const recentlyRestoredTrucks = trucks.filter(truck => 
    truck.isSynced && truck.networkStatus === 'Online'
  );

  const getFilteredAlerts = () => {
    switch (activeFilter) {
      case 'critical':
        return criticalTrucks;
      case 'delayed':
        return [...criticalTrucks, ...delayedTrucks];
      default:
        return trucks.filter(truck => !truck.isSynced);
    }
  };

  const filteredAlerts = getFilteredAlerts();

  return (
    <div className="space-y-3">
      {/* Critical Alerts */}
      {criticalTrucks.length > 0 && (activeFilter === 'all' || activeFilter === 'critical' || activeFilter === 'delayed') && (
        <Alert className="border-red-600 bg-red-950 text-red-100">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>🔴 CRITICAL SYNC FAILURE:</strong> {criticalTrucks.length} truck(s) with delays over 15 minutes - 
            Immediate attention required! ({criticalTrucks.map(t => t.truckID).join(', ')})
          </AlertDescription>
        </Alert>
      )}

      {/* Warning Alerts */}
      {delayedTrucks.length > 0 && (activeFilter === 'all' || activeFilter === 'delayed') && (
        <Alert className="border-yellow-500 bg-yellow-950 text-yellow-100">
          <Clock className="h-4 w-4" />
          <AlertDescription>
            <strong>🟡 SYNC WARNING:</strong> {delayedTrucks.length} truck(s) experiencing sync delays - 
            Monitor closely ({delayedTrucks.map(t => t.truckID).join(', ')})
          </AlertDescription>
        </Alert>
      )}

      {/* Success Alerts */}
      {recentlyRestoredTrucks.length > 0 && activeFilter === 'all' && (
        <Alert className="border-green-500 bg-green-950 text-green-100">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>✅ SYNC RESTORED:</strong> {recentlyRestoredTrucks.length} truck(s) successfully reconnected and syncing - 
            Data integrity maintained ({recentlyRestoredTrucks.map(t => t.truckID).join(', ')})
          </AlertDescription>
        </Alert>
      )}

      {/* No Alerts State */}
      {filteredAlerts.length === 0 && (
        <Alert className="border-green-500 bg-green-950 text-green-100">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            ✅ All trucks are synchronized successfully - No data at risk
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default SmartAlerts;
