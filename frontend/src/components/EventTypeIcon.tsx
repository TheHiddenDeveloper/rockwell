
import React from 'react';
import { AlertTriangle, Zap, MapPin, Clock } from 'lucide-react';

interface EventTypeIconProps {
  eventType: string;
  className?: string;
}

const EventTypeIcon = ({ eventType, className = "h-4 w-4" }: EventTypeIconProps) => {
  const getIcon = () => {
    switch (eventType.toLowerCase()) {
      case 'fatigue alert':
        return <AlertTriangle className={`${className} text-red-400`} />;
      case 'speed warning':
        return <Zap className={`${className} text-yellow-400`} />;
      case 'route deviation':
        return <MapPin className={`${className} text-blue-400`} />;
      case 'break violation':
        return <Clock className={`${className} text-orange-400`} />;
      default:
        return <AlertTriangle className={`${className} text-gray-400`} />;
    }
  };

  return getIcon();
};

export default EventTypeIcon;
