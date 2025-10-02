import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity'

@Injectable()
export class RolesService {

  constructor(
    @InjectRepository(Role)
    private RoleRepo: Repository<Role>
  ) { }

  async create(createRoleDto: CreateRoleDto) {
    try {
      const lastRole = await this.RoleRepo
        .createQueryBuilder('u')
        .orderBy('u.role_id', "DESC")
        .getOne();
      const lastIdNumber = lastRole ? parseInt(lastRole.role_id.slice(5)) : 0;
      const newId = `ROLE0${lastIdNumber + 1}`;
      const newRole = this.RoleRepo.create({
        role_id: newId,
        ...createRoleDto,
      });
      const role = await this.RoleRepo.save(newRole);
      return role;
    } catch (e) {
      console.error(e);
      throw new HttpException("Create Role failed.", HttpStatus.BAD_REQUEST);
    }
  }


  async findAll() {
    const roles = await this.RoleRepo.find();
    return roles;
  }

  async getRoleById(role_id : string) {
    const role = await this.RoleRepo.findOneBy({role_id});
    return role;
  }

  async update(role_id: string, updateRoleDto: UpdateRoleDto) {
    try {
      const targetRole = await this.RoleRepo.findOneBy({ role_id });
      if (!targetRole) throw new HttpException("Update role failed.", HttpStatus.NOT_FOUND);
      const updated = Object.assign(targetRole, updateRoleDto)
      return this.RoleRepo.save(updated);
    } catch {
      throw new HttpException("Update role failed.", HttpStatus.BAD_REQUEST);
    }
  }


}
