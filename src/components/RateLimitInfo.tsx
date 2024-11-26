import React from 'react';
import { Clock } from 'lucide-react';
import { getRateLimitInfo } from '../services/rateLimit';

export function RateLimitInfo() {
  const [info, setInfo] = React.useState(getRateLimitInfo());

  React.useEffect(() => {
    const interval = setInterval(() => {
      setInfo(getRateLimitInfo());
    }, 1000); // Update every second for smoother countdown

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="rate-limit-info">
      <div className="flex items-center space-x-2">
        <Clock className="h-4 w-4" />
        <span>{info.remaining} requests remaining</span>
        <span>•</span>
        <span>Resets at {info.resetTime.toLocaleTimeString()}</span>
      </div>
    </div>
  );
}