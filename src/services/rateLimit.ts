import { RateLimitError } from './errors';

const RATE_LIMIT = 10; // requests per window
const WINDOW_MS = 86400000; // 1 day in milliseconds

interface RateLimitData {
  count: number;
  timestamp: number;
}

export function checkRateLimit(): void {
  const now = Date.now();
  const stored = localStorage.getItem('rateLimitData');
  let data: RateLimitData = stored ? JSON.parse(stored) : { count: 0, timestamp: now };

  // Reset if window has passed
  if (now - data.timestamp > WINDOW_MS) {
    data = { count: 0, timestamp: now };
  }

  // Check limit
  if (data.count >= RATE_LIMIT) {
    const resetTime = new Date(data.timestamp + WINDOW_MS);
    throw new RateLimitError(`Rate limit exceeded. Try again after ${resetTime.toLocaleTimeString()}`);
  }

  // Increment counter
  data.count++;
  localStorage.setItem('rateLimitData', JSON.stringify(data));
}

export function getRateLimitInfo(): { remaining: number; resetTime: Date } {
  const stored = localStorage.getItem('rateLimitData');
  const data: RateLimitData = stored ? JSON.parse(stored) : { count: 0, timestamp: Date.now() };
  
  return {
    remaining: Math.max(0, RATE_LIMIT - data.count),
    resetTime: new Date(data.timestamp + WINDOW_MS)
  };
}