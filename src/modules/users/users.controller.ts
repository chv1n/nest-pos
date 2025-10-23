import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResponseMessage } from 'src/common/decorator/response-message.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from 'src/common/decorator/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('Admin')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ResponseMessage('Get all users successfully')
  async getAllUser() {
    return this.usersService.getAllUser();
  }

  @UseGuards(JwtAuthGuard)
  @Roles('Admin', 'Manager', 'Cashier')
  @Get('profile')
  @ResponseMessage('Get my profile successfully')
  async getProfile(@Req() req) {
    const user = await this.usersService.getUserByUid(req.user.userId);
    return user;
  }

  @Get('by-uid/:uid')
  @Roles('Admin', 'Manager')
  @ResponseMessage('Get user by uid successfully')
  async getUserByUid(@Param('uid') uid: string) {
    return await this.usersService.getUserByUid(uid);
  }

  @Post()
  @Roles('Admin', 'Manager')
  @ResponseMessage('Create user successfully')
  async createUser(@Body() createUserDto: CreateUserDto, @Req() req) {
    const userData = await this.usersService.createUser(
      createUserDto,
      req.user,
    );
    return userData;
  }

  @Put(':uid')
  @ResponseMessage('Updated user successfully')
  updateUser(@Param('uid') uid: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(uid, updateUserDto);
  }
}
