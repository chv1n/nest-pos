import { Controller, Get, Post, Body, Put, Param, Request, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResponseMessage } from 'src/common/decorator/response-message.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';



@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get()
  @ResponseMessage('Get all users successfully')
  async getAllUser() {
    return this.usersService.getAllUser();
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ResponseMessage('Get my profile successfully')
  async getProfile(@Request() req) {
    const user = await this.usersService.getUserByUid(req.user.userId)
    return user
  }

  @Get('by-uid/:uid')
  @ResponseMessage('Get user by uid successfully')
  getUserByUid(@Param('uid') uid: string) {
    return this.usersService.getUserByUid(uid);
  }

  @Post()
  @ResponseMessage('Create user successfully')
  async createUser(@Body() createUserDto: CreateUserDto) {
    const userData = await this.usersService.createUser(createUserDto);
    return userData;
  }

  @Put(':uid')
  @ResponseMessage('Updated user successfully')
  updateUser(@Param('uid') uid: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(uid, updateUserDto);
  }


}
