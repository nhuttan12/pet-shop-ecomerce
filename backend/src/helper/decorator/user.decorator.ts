import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthenticatedRequest } from '../interface/authenticated.interface';

/**
 * @description: create param decorator to get user
 *  information instead of getting it manual in code
 * @var ctx: context of an data transmission time
 */
export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();
    return request.user;
  },
);
