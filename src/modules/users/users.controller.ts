import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResponseMessage } from 'src/common/decorator/response-message.decorator';



@Controller('/v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ResponseMessage('Create user successfully')
  async createUser(@Body() createUserDto: CreateUserDto) {
    const userData = await this.usersService.createUser(createUserDto);
    return userData;
  }

  @Get()
  @ResponseMessage('Get all users successfully')
  async getAllUser() {
    return this.usersService.getAllUser();
  }

  @Get(':uid')
  @ResponseMessage('Get user by uid successfully')
  getUserByUid(@Param('uid') uid: string) {
    return this.usersService.getUserByUid(uid);
  }

  @Put(':uid')
  @ResponseMessage('Updated user successfully')
  updateUser(@Param('uid') uid: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(uid, updateUserDto);
  }

  @Put(':uid/is-active')
  @ResponseMessage('Updated user successfully')
  updateIsActive(@Param('uid') uid: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateIsActive(uid, updateUserDto);
  }
}
