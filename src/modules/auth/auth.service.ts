import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) { }

  async validateUser(uid: string, pass: string): Promise<any> {
    const user = await this.usersService.getUserForAuth(uid);
    if (user && (await bcrypt.compare(pass, user.passwordHashed))) {
      const { passwordHashed, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = {
      phone: user.phone,
      role: user.role.role_name,
      sub: user.uid
    };
    console.log(payload)
    return this.jwtService.sign(payload);
  }

}
