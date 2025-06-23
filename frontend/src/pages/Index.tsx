
import React, { useState, useEffect } from 'react';
import { Clock, Wifi, WifiOff, MapPin, Database } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AlertFilters from '@/components/AlertFilters';
import SmartAlerts from '@/components/SmartAlerts';
import TooltipWrapper from '@/components/TooltipWrapper';
import RefreshControls from '@/components/RefreshControls';
import EventTypeIcon from '@/components/EventTypeIcon';

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

interface DeadZone {
  zoneName: string;
  failedTrucks: number;
}

const Index = () => {
  const [trucks, setTrucks] = useState<TruckData[]>([]);
  const [deadZones, setDeadZones] = useState<DeadZone[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeFilter, setActiveFilter] = useState<'all' | 'delayed' | 'critical'>('all');
  const [isAutoRefreshEnabled, setIsAutoRefreshEnabled] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Mock data generator
  const generateMockData = (): TruckData[] => {
    const truckIDs = ['T-001', 'T-002', 'T-003', 'T-004', 'T-005', 'T-006'];
    const eventTypes = ['Fatigue Alert', 'Speed Warning', 'Break Violation', 'Route Deviation'];
    const networkStatuses: ('Online' | 'Flaky' | 'Offline')[] = ['Online', 'Flaky', 'Offline'];
    
    return truckIDs.map(id => {
      const minutesAgo = Math.floor(Math.random() * 30);
      const lastSyncTime = new Date(Date.now() - minutesAgo * 60000);
      const isSynced = minutesAgo < 10;
      const networkStatus = networkStatuses[Math.floor(Math.random() * networkStatuses.length)];
      const bufferCount = isSynced ? 0 : Math.floor(Math.random() * 8) + 1;
      
      const pendingEvents = [];
      if (!isSynced) {
        for (let i = 0; i < bufferCount; i++) {
          const eventMinutesAgo = Math.floor(Math.random() * 25) + 5;
          pendingEvents.push({
            eventType: eventTypes[Math.floor(Math.random() * eventTypes.length)],
            eventTime: new Date(Date.now() - eventMinutesAgo * 60000).toLocaleTimeString(),
            delayMinutes: eventMinutesAgo
          });
        }
      }
      
      return {
        truckID: id,
        isSynced,
        lastSyncTime: lastSyncTime.toLocaleTimeString(),
        networkStatus,
        bufferCount,
        pendingEvents
      };
    });
  };

  const generateDeadZones = (): DeadZone[] => {
    return [
      { zoneName: 'Highway 401 - KM 240', failedTrucks: 3 },
      { zoneName: 'Industrial Zone B', failedTrucks: 2 },
      { zoneName: 'Route 17 Tunnel', failedTrucks: 4 },
      { zoneName: 'Downtown Core', failedTrucks: 1 }
    ];
  };

  const updateData = () => {
    setTrucks(generateMockData());
    setDeadZones(generateDeadZones());
    setCurrentTime(new Date());
    setLastUpdated(new Date());
    console.log('Data refreshed at', new Date().toLocaleTimeString());
  };

  const handleManualRefresh = () => {
    updateData();
  };

  const handleToggleAutoRefresh = () => {
    setIsAutoRefreshEnabled(!isAutoRefreshEnabled);
  };

  // Update data every 5 seconds if auto-refresh is enabled
  useEffect(() => {
    updateData(); // Initial load
    
    let interval: NodeJS.Timeout | null = null;
    if (isAutoRefreshEnabled) {
      interval = setInterval(updateData, 5000);
    }
    
    // Update current time every second for live timestamps
    const timeInterval = setInterval(() => setCurrentTime(new Date()), 1000);

    return () => {
      if (interval) clearInterval(interval);
      clearInterval(timeInterval);
    };
  }, [isAutoRefreshEnabled]);

  const getNetworkStatusIcon = (status: string) => {
    switch (status) {
      case 'Online': return <Wifi className="h-4 w-4 text-green-500" />;
      case 'Flaky': return <Wifi className="h-4 w-4 text-yellow-500" />;
      case 'Offline': return <WifiOff className="h-4 w-4 text-red-500" />;
      default: return <WifiOff className="h-4 w-4 text-gray-500" />;
    }
  };

  const getSyncStatusBadge = (truck: TruckData) => {
    if (truck.isSynced) {
      return <Badge variant="default" className="bg-green-500 hover:bg-green-600">✅ Synced</Badge>;
    } else {
      return <Badge variant="destructive">❌ Delayed</Badge>;
    }
  };

  const getFilteredTrucks = () => {
    switch (activeFilter) {
      case 'delayed':
        return trucks.filter(truck => !truck.isSynced);
      case 'critical':
        return trucks.filter(truck => 
          !truck.isSynced && truck.pendingEvents.some(event => event.delayMinutes > 15)
        );
      default:
        return trucks;
    }
  };

  const criticalTrucks = trucks.filter(truck => 
    !truck.isSynced && truck.pendingEvents.some(event => event.delayMinutes > 15)
  );
  const delayedTrucks = trucks.filter(truck => !truck.isSynced);
  const allPendingEvents = trucks.flatMap(truck => 
    truck.pendingEvents.map(event => ({ ...event, truckID: truck.truckID }))
  );

  const filteredTrucks = getFilteredTrucks();

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Truck Data Sync Monitor</h1>
          <p className="text-slate-300">Ensuring critical safety data is never lost</p>
          <div className="text-sm text-slate-400 mt-2">
            Current Time: {currentTime.toLocaleTimeString()} • 
            {isAutoRefreshEnabled ? ' Auto-refresh every 5 seconds' : ' Auto-refresh paused'}
          </div>
        </div>

        {/* Refresh Controls */}
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <RefreshControls
              onManualRefresh={handleManualRefresh}
              isAutoRefreshEnabled={isAutoRefreshEnabled}
              onToggleAutoRefresh={handleToggleAutoRefresh}
              lastUpdated={lastUpdated}
            />
          </CardContent>
        </Card>

        {/* Alert Filters */}
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <AlertFilters
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
              delayedCount={delayedTrucks.length}
              criticalCount={criticalTrucks.length}
            />
          </CardContent>
        </Card>

        {/* Smart Alerts */}
        <SmartAlerts trucks={trucks} activeFilter={activeFilter} />

        {/* Pending Sync Events Panel */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Pending Sync Events ({allPendingEvents.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {allPendingEvents.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                ✅ All events synchronized successfully
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-600">
                      <th className="text-left py-3 px-4 text-slate-300 font-medium">Truck ID</th>
                      <th className="text-left py-3 px-4 text-slate-300 font-medium">Event Type</th>
                      <th className="text-left py-3 px-4 text-slate-300 font-medium">Event Time</th>
                      <th className="text-left py-3 px-4 text-slate-300 font-medium">
                        <TooltipWrapper 
                          content="Time since the event occurred and failed to sync to the server"
                          showIcon
                        >
                          Delay Time
                        </TooltipWrapper>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {allPendingEvents.map((event, index) => (
                      <tr 
                        key={index} 
                        className={`border-b border-slate-700 ${
                          event.delayMinutes > 15 ? 'bg-red-950 text-red-100' : 
                          event.delayMinutes > 10 ? 'bg-red-900 text-red-200' : 'text-slate-200'
                        }`}
                      >
                        <td className="py-3 px-4 font-mono">{event.truckID}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <EventTypeIcon eventType={event.eventType} />
                            {event.eventType}
                          </div>
                        </td>
                        <td className="py-3 px-4">{event.eventTime}</td>
                        <td className="py-3 px-4">
                          <span className={event.delayMinutes > 10 ? 'font-bold' : ''}>
                            {event.delayMinutes}m
                            {event.delayMinutes > 15 && ' 🔴'}
                            {event.delayMinutes > 10 && event.delayMinutes <= 15 && ' 🟡'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sync Status for Every Truck */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">
              Truck Sync Status 
              {activeFilter !== 'all' && (
                <Badge variant="outline" className="ml-3">
                  Showing {filteredTrucks.length} of {trucks.length} trucks
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTrucks.map(truck => (
                <div key={truck.truckID} className="bg-slate-700 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-mono text-white text-lg">{truck.truckID}</h3>
                    {getSyncStatusBadge(truck)}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-300">Network:</span>
                      <div className="flex items-center gap-2">
                        {getNetworkStatusIcon(truck.networkStatus)}
                        <span className={`${
                          truck.networkStatus === 'Online' ? 'text-green-400' :
                          truck.networkStatus === 'Flaky' ? 'text-yellow-400' : 'text-red-400'
                        }`}>
                          {truck.networkStatus}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-300">Last Sync:</span>
                      <span className={!truck.isSynced ? 'text-red-400 font-bold' : 'text-green-400'}>
                        {truck.lastSyncTime}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-300">
                        <TooltipWrapper 
                          content="Number of safety events stored locally but not yet synced to the server"
                          showIcon
                        >
                          Buffer Count:
                        </TooltipWrapper>
                      </span>
                      <div className="flex items-center gap-1">
                        <Database className="h-3 w-3" />
                        <span className={truck.bufferCount > 0 ? 'text-yellow-400 font-bold' : 'text-slate-400'}>
                          {truck.bufferCount} events
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Dead Zones / Problem Areas */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              <TooltipWrapper 
                content="Geographic areas where trucks frequently experience sync failures due to poor network coverage"
                showIcon
              >
                Sync Failure Hotspots
              </TooltipWrapper>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {deadZones.map((zone, index) => (
                <div key={index} className="bg-slate-700 rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-medium">{zone.zoneName}</h4>
                    <p className="text-slate-400 text-sm">Frequent sync failures</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-red-400">{zone.failedTrucks}</div>
                    <div className="text-xs text-slate-400">trucks affected</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-400">{trucks.filter(t => t.isSynced).length}</div>
              <div className="text-slate-400 text-sm">Trucks Synced</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-red-400">{delayedTrucks.length}</div>
              <div className="text-slate-400 text-sm">Delayed Trucks</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-yellow-400">{allPendingEvents.length}</div>
              <div className="text-slate-400 text-sm">Pending Events</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-400">{trucks.filter(t => t.networkStatus === 'Online').length}</div>
              <div className="text-slate-400 text-sm">Online Trucks</div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center text-slate-500 text-sm py-4 border-t border-slate-700">
          Dashboard Status: Active | Data Source: Mock Simulation | 
          Last Full Refresh: {lastUpdated.toLocaleString()}
        </div>
      </div>
    </div>
  );
};

export default Index;
