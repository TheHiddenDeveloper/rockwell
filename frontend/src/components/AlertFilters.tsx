
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface AlertFiltersProps {
  activeFilter: 'all' | 'delayed' | 'critical';
  onFilterChange: (filter: 'all' | 'delayed' | 'critical') => void;
  delayedCount: number;
  criticalCount: number;
}

const AlertFilters = ({ activeFilter, onFilterChange, delayedCount, criticalCount }: AlertFiltersProps) => {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span className="text-slate-300 text-sm">Filter alerts:</span>
      <Button
        variant={activeFilter === 'all' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onFilterChange('all')}
        className="text-xs"
      >
        All Trucks
      </Button>
      <Button
        variant={activeFilter === 'delayed' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onFilterChange('delayed')}
        className="text-xs"
      >
        Delayed Only
        {delayedCount > 0 && (
          <Badge variant="destructive" className="ml-2 text-xs">
            {delayedCount}
          </Badge>
        )}
      </Button>
      <Button
        variant={activeFilter === 'critical' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onFilterChange('critical')}
        className="text-xs"
      >
        Critical (&gt;15m)
        {criticalCount > 0 && (
          <Badge variant="destructive" className="ml-2 text-xs bg-red-600">
            {criticalCount}
          </Badge>
        )}
      </Button>
    </div>
  );
};

export default AlertFilters;
