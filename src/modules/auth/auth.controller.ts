import { Controller, Post, Request, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { ResponseMessage } from 'src/common/decorator/response-message.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(AuthGuard('local'))
  @ResponseMessage('Login successfully')
  async login(@Request() req, @Res({ passthrough :true}) res) {
    const accessToken = await this.authService.login(req.user)
    res.cookie('access_token', accessToken, {
      httpOnly: true
    });
    return {
      message : 'Login Successful!!'
    }; 
  }


}
