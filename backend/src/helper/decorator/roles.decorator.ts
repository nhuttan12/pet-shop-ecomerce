import { SetMetadata } from '@nestjs/common';
import { Role } from '../enum/role.enum';

/**
 * @description: create decorator @HasRole() for authorization
 * @var ROLES_KEY: key to checking when decorator is called
 * @var HasRole: name of decorator, with the data is role with Enum type,
 *  and set meta data is when authorization, set the role in roles Enum and connect with key
 */
export const ROLES_KEY = 'roles';
export const HasRole = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
