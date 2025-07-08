import { AuthErrorMessages } from '@auth/messages/auth.error-messages';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * @description: create shorter version to call jwt auth guard instead of call AuthGuard('jwt')
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);
  handleRequest<TUser = any>(err, user, info, context): TUser {
    if (err || !user) {
      this.logger.warn(
        `JWT info: ${info}\n JWT err: ${err}\n JWT context: ${context}`,
      );
      throw new UnauthorizedException(AuthErrorMessages.USER_NOT_LOG_IN);
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return user;
  }
}
