import { ThrottlerGuard } from '@nestjs/throttler';
import { Injectable } from '@nestjs/common';

// 참조: https://docs.nestjs.com/security/rate-limiting

@Injectable()
export class ThrottlerBehindProxyGuard extends ThrottlerGuard {
  protected async getTracker(req: Record<string, any>): Promise<string> {
    return req.ips.length ? req.ips[0] : req.ip;
  }
}
