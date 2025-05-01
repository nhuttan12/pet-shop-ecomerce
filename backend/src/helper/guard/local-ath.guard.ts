import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * @description: create shorter version to call local auth guard instead of call AuthGuard('local')
 */
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}
