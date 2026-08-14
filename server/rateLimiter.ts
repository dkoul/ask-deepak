interface WindowEntry {
  count: number;
  resetAt: number;
}

export interface RateLimitResult {
  allowed: boolean;
  retryAfterSeconds?: number;
  reason?: string;
}

export interface RateLimitConfig {
  /** Max requests per IP per minute */
  ipPerMinute: number;
  /** Max requests per IP per day */
  ipPerDay: number;
  /** Max requests per session per hour */
  sessionPerHour: number;
  /** Global daily cap across all visitors */
  globalDaily: number;
  /** Minimum seconds between requests from the same IP */
  minIntervalSeconds: number;
}

export const DEFAULT_LIMITS: RateLimitConfig = {
  ipPerMinute: 6,
  ipPerDay: 25,
  sessionPerHour: 12,
  globalDaily: 150,
  minIntervalSeconds: 2,
};

export class RateLimiter {
  private windows = new Map<string, WindowEntry>();
  private lastRequestByIp = new Map<string, number>();

  private checkWindow(key: string, limit: number, windowMs: number): RateLimitResult {
    const now = Date.now();
    const entry = this.windows.get(key);

    if (!entry || now >= entry.resetAt) {
      this.windows.set(key, { count: 1, resetAt: now + windowMs });
      return { allowed: true };
    }

    if (entry.count >= limit) {
      return {
        allowed: false,
        retryAfterSeconds: Math.ceil((entry.resetAt - now) / 1000),
        reason: 'rate_limit',
      };
    }

    entry.count += 1;
    return { allowed: true };
  }

  check(ip: string, sessionId: string, config: RateLimitConfig = DEFAULT_LIMITS): RateLimitResult {
    const now = Date.now();
    const lastRequest = this.lastRequestByIp.get(ip);

    if (lastRequest && now - lastRequest < config.minIntervalSeconds * 1000) {
      return {
        allowed: false,
        retryAfterSeconds: config.minIntervalSeconds,
        reason: 'too_fast',
      };
    }

    const checks = [
      this.checkWindow(`ip:min:${ip}`, config.ipPerMinute, 60 * 1000),
      this.checkWindow(`ip:day:${ip}`, config.ipPerDay, 24 * 60 * 60 * 1000),
      this.checkWindow(`session:hour:${sessionId}`, config.sessionPerHour, 60 * 60 * 1000),
      this.checkWindow('global:day', config.globalDaily, 24 * 60 * 60 * 1000),
    ];

    const blocked = checks.find((c) => !c.allowed);
    if (blocked) {
      return blocked;
    }

    this.lastRequestByIp.set(ip, now);
    return { allowed: true };
  }

  /** Prune expired entries periodically to avoid memory growth */
  prune(): void {
    const now = Date.now();
    for (const [key, entry] of this.windows) {
      if (now >= entry.resetAt) {
        this.windows.delete(key);
      }
    }
  }
}
