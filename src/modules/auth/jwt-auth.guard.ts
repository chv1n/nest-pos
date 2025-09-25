
import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    canActivate(ctx: ExecutionContext) {
    const req = ctx.switchToHttp().getRequest();
    // ดูว่ามี token มั้ย
    // console.log('Auth header:', req.headers.authorization);
    console.log('Cookies:', req.cookies);
    return super.canActivate(ctx);
  }
}
