// lib/rate-limiter.ts
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remainingRequests: number;
  resetIn: number;
}

export function checkRateLimit(
  key: string,
  config: RateLimitConfig = { windowMs: 60000, maxRequests: 10 }
): RateLimitResult {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  // No existing entry or entry has expired
  if (!entry || now > entry.resetTime) {
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + config.windowMs,
    });
    return {
      allowed: true,
      remainingRequests: config.maxRequests - 1,
      resetIn: config.windowMs,
    };
  }

  // Check if limit exceeded
  if (entry.count >= config.maxRequests) {
    return {
      allowed: false,
      remainingRequests: 0,
      resetIn: entry.resetTime - now,
    };
  }

  // Increment count
  entry.count++;

  return {
    allowed: true,
    remainingRequests: config.maxRequests - entry.count,
    resetIn: entry.resetTime - now,
  };
}

// Cleanup old entries periodically (only in Node.js environment)
if (typeof globalThis !== "undefined" && typeof setInterval !== "undefined") {
  const cleanupInterval = setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of rateLimitStore.entries()) {
      if (now > entry.resetTime) {
        rateLimitStore.delete(key);
      }
    }
  }, 60000);

  // Prevent interval from keeping the process alive
  if (cleanupInterval.unref) {
    cleanupInterval.unref();
  }
}
