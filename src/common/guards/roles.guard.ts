import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorator/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true; 
    }

    const { user } = context.switchToHttp().getRequest();


    if (!user?.role) {
      throw new ForbiddenException('No role found');
    }

    const userRoles = Array.isArray(user.role) ? user.role.toLowerCase() : [user.role.toLowerCase()];

    const hasRole = requiredRoles.some(role => userRoles.includes(role.toLowerCase()));

    if (!hasRole) {
      throw new ForbiddenException('Insufficient role');
    }

    return true;
  }
}
