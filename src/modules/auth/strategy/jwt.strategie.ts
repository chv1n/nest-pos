
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor( configService: ConfigService) {
        const secret = configService.get("JWT_SECRET");
        if (!secret) {
            throw new HttpException(
                'JWT secret is not defined. Please set JWT_SECRET in environment variables.',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }

        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (req) => req?.cookies?.access_token,
            ]),
            ignoreExpiration: false,
            secretOrKey: secret,
        });
    }

    async validate(payload: any) {
        console.log('payload in JWT:', payload)
        return { userId: payload.sub, phone: payload.phone };
    }
}
