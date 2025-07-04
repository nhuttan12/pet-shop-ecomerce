import { AuthenticatedRequest } from '@auth';
import { MessageLog, ROLES_KEY } from '@common';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleName } from '@role';
import { AuthErrorMessages } from 'auth/messages/auth.error-messages';

/**
 * @description: create HasRole() decorator by get role from meta data
 *  and checking, if it's undefined (not found) return true, if not (has role),
 *  get user and role from request and check is it forbid to do something
 */
@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const { user } = context.switchToHttp().getRequest<AuthenticatedRequest>();
    this.logger.log(`Get user: ${JSON.stringify(user)}`);

    const requiredRoles: RoleName[] = this.reflector.getAllAndOverride<
      RoleName[]
    >(ROLES_KEY, [context.getHandler(), context.getClass()]);
    if (requiredRoles) {
      this.logger.log(`Required role: ${requiredRoles.toString()}`);
    }
    if (!requiredRoles) {
      return true;
    }

    // Thêm check user tồn tại
    if (!user) {
      this.logger.error('User is undefined in RolesGuard');
      throw new ForbiddenException(
        'Bạn chưa đăng nhập hoặc token không hợp lệ',
      );
    }

    const hasRole: boolean = requiredRoles.some((roleName) =>
      user.role?.includes(roleName.toString()),
    );

    if (!hasRole) {
      this.logger.error(MessageLog.USER_IS_FORBIDDEN_TO_APPROACH_THE_RESOURCE);
      throw new ForbiddenException(
        AuthErrorMessages.USER_IS_FORBIDDEN_TO_APPROACH_THE_RESOURCE,
      );
    }

    return true;
  }
}
