import { Controller, Get, Post, Body, Put, Param, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from 'src/common/decorator/roles.decorator';
import { ResponseMessage } from 'src/common/decorator/response-message.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('Admin', 'Manager')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) { }

  @Post()
  @ResponseMessage('Create Role successfully')
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @Get()
  @ResponseMessage('Get all successfully')
  findAll() {
    return this.rolesService.findAll();
  }

  @Get('by-id/:id')
  @ResponseMessage('Get user by uid successfully')
  getUserByUid(@Param('id') id: string) {
    return this.rolesService.getRoleById(id);
  }


  @Put(':id')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(id, updateRoleDto);
  }

}
