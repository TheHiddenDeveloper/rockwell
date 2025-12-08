
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Pause, Play } from 'lucide-react';

interface RefreshControlsProps {
  onManualRefresh: () => void;
  isAutoRefreshEnabled: boolean;
  onToggleAutoRefresh: () => void;
  lastUpdated: Date;
}

const RefreshControls = ({ 
  onManualRefresh, 
  isAutoRefreshEnabled, 
  onToggleAutoRefresh, 
  lastUpdated 
}: RefreshControlsProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Button
          onClick={onManualRefresh}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh Now
        </Button>
        <Button
          onClick={onToggleAutoRefresh}
          variant={isAutoRefreshEnabled ? "default" : "outline"}
          size="sm"
          className="flex items-center gap-2"
        >
          {isAutoRefreshEnabled ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          Auto-refresh {isAutoRefreshEnabled ? 'On' : 'Off'}
        </Button>
      </div>
      <div className="text-sm text-slate-400">
        Last updated: {lastUpdated.toLocaleTimeString()}
      </div>
    </div>
  );
};

export default RefreshControls;
