import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../enum/role.enum';
import { ROLES_KEY } from '../decorator/roles.decorator';
import { AuthenticatedRequest } from '../interface/jwt-payload.interface';

/**
 * @description: create HasRole() decorator by get role from meta data
 *  and checking, if it's undefined (not found) return true, if not (has role),
 *  get user and role from request and check is it forbid to do something
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest<AuthenticatedRequest>();
    return requiredRoles.some((roleName) =>
      user.role?.includes(roleName.toString()),
    );
  }
}
