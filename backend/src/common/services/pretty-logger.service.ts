import { Injectable, Logger, LoggerService } from '@nestjs/common';

@Injectable()
export class PrettyLoggerService implements LoggerService {
  private readonly logger = new Logger();
  private getCallerContext(): string {
    const stack = new Error().stack;
    if (!stack) return 'UnknownContext';

    const lines = stack.split('\n');
    // Find the first external caller (not PrettyLogger or UtilityService)
    for (const line of lines.slice(2)) {
      if (
        !line.includes('PrettyLoggerService') &&
        !line.includes('UtilityService')
      ) {
        const match = line.trim().match(/^at (.+)$/);
        if (match) return match[1]; // e.g. UserService.getProfile (filename:line:col)
      }
    }

    return 'UnknownContext';
  }

  log(message: any) {
    const context = this.getCallerContext();
    this.logger.log(message, context);
  }

  error(message: any, trace?: string) {
    const context = this.getCallerContext();
    this.logger.error(message, trace, context);
  }

  warn(message: any) {
    const context = this.getCallerContext();
    this.logger.warn(message, context);
  }

  debug(message: any) {
    const context = this.getCallerContext();
    this.logger.debug(message, context);
  }

  verbose(message: any) {
    const context = this.getCallerContext();
    this.logger.verbose(message, context);
  }
}
