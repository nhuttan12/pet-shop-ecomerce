import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * @description: create shorter version to call jwt auth guard instead of call AuthGuard('jwt')
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
