
import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    canActivate(ctx: ExecutionContext) {
    const req = ctx.switchToHttp().getRequest();
    console.log('Cookies:', req.cookies);
    return super.canActivate(ctx);
  }
}
