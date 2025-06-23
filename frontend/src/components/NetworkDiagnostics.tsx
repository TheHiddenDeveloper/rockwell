import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Signal, Wifi, WifiOff, TrendingUp, ChartLine } from 'lucide-react';
import { useNetwork } from '../hooks/use-network';

const ALERT_THRESHOLDS = {
  failureRate: 0.5, // 0.5 failures/hour
};


interface NetworkMetrics {
  signalStrength: number;
  lastFailure: string | null;
}

interface NetworkZone extends NetworkMetrics {
  name: string;
  failureCount: number;
  trucksAffected: string[];
  failureRate: number;
  prediction: {
    nextFailure: string;
    confidence: number;
  };
}

const NetworkDiagnostics = () => {
  const { status, signalStrength, lastFailure, isConnected } = useNetwork();
  const [zones, setZones] = useState<NetworkZone[]>([]);

  useEffect(() => {
    // Simulate network zone data fetching
    const fetchZoneData = async () => {
      // In a real implementation, this would fetch from your backend API
      const mockZones: NetworkZone[] = [
        {
          name: 'Highway 401 - KM 240',
          signalStrength: 20,
          lastFailure: '2025-06-23T10:30:00',
          failureCount: 3,
          trucksAffected: ['T-001', 'T-002', 'T-003'],
          failureRate: 0.5,
          prediction: {
            nextFailure: '2025-06-23T11:30:00',
            confidence: 0.75
          }
        },
        {
          name: 'Industrial Zone B',
          signalStrength: 15,
          lastFailure: '2025-06-23T10:25:00',
          failureCount: 2,
          trucksAffected: ['T-004', 'T-005'],
          failureRate: 0.3,
          prediction: {
            nextFailure: '2025-06-23T11:45:00',
            confidence: 0.6
          }
        },
        {
          name: 'Route 17 Tunnel',
          signalStrength: 5,
          lastFailure: '2025-06-23T10:15:00',
          failureCount: 4,
          trucksAffected: ['T-006', 'T-007', 'T-008', 'T-009'],
          failureRate: 0.8,
          prediction: {
            nextFailure: '2025-06-23T11:15:00',
            confidence: 0.9
          }
        }
      ];
      setZones(mockZones);
    };

    fetchZoneData();
    const interval = setInterval(fetchZoneData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Network Health</CardTitle>
            <Badge variant={isConnected ? 'default' : 'destructive'}>
              {status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Signal className="h-4 w-4" />
            <span>Signal Strength: {signalStrength}%</span>
          </div>
          {lastFailure && (
            <div className="text-sm text-muted-foreground mt-2">
              Last Failure: {new Date(lastFailure).toLocaleTimeString()}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Network Dead Zones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {zones.map((zone) => (
              <div key={zone.name} className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{zone.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Signal Strength: {zone.signalStrength}%
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{zone.failureCount} failures</Badge>
                  <Badge variant="outline">{zone.trucksAffected.length} trucks affected</Badge>
                  <Badge variant={zone.failureRate > ALERT_THRESHOLDS.failureRate ? 'destructive' : 'default'}>
                    {zone.failureRate.toFixed(2)} failures/hour
                  </Badge>
                </div>
                <div className="mt-2">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    <span>Predicted Next Failure: {zone.prediction.nextFailure}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ChartLine className="h-4 w-4" />
                    <span>Confidence: {zone.prediction.confidence * 100}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NetworkDiagnostics;
