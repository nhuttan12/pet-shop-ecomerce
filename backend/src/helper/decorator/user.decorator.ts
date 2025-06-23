import { AuthenticatedRequest } from '@interfaces';
import { createParamDecorator, ExecutionContext, Logger } from '@nestjs/common';

/**
 * @description: create param decorator to get user
 *  information instead of getting it manual in code
 * @var ctx: context of an data transmission time
 */
export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();
    console.log(JSON.stringify(request.user));
    return request.user;
  },
);
