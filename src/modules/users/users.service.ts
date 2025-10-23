import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { acceptCreateUser } from '../roles/policies/role-policies';
import { RolesService } from '../roles/roles.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly UserRepo: Repository<User>,
    private readonly RoleService: RolesService,
  ) {}

  async createUser(createUserDto: CreateUserDto, currentUser: any) {
    try {
      const targetRole = await this.RoleService.getRoleById(
        createUserDto.role_id,
      );
      if (!targetRole)
        throw new HttpException(
          'This role_id is not define',
          HttpStatus.NOT_FOUND,
        );
      acceptCreateUser(currentUser.role, targetRole?.role_name);

      const lastUser = await this.UserRepo.createQueryBuilder('u')
        .orderBy('u.uid', 'DESC')
        .getOne();
      const lastIdNumber = lastUser ? parseInt(lastUser.uid.slice(3)) : 0;
      const newUid = `UID0${String(lastIdNumber + 1)}`;
      const passwordHashed = await bcrypt.hash(
        createUserDto.phone.slice(-6),
        10,
      );

      const newUser = this.UserRepo.create({
        ...createUserDto,
        uid: newUid,
        passwordHashed: passwordHashed,
      });
      const user = await this.UserRepo.save(newUser);
      return plainToInstance(User, user, { excludeExtraneousValues: true });
    } catch (e) {
      console.error(e);
      if (e.code === '23505') {
        throw new HttpException(
          {
            message: 'Phone number already exists',
            errorCode: 'PHONE_DUPLICATE',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException('Create User failed.', HttpStatus.BAD_REQUEST);
    }
  }

  async getAllUser(): Promise<User[]> {
    const users = await this.UserRepo.find();
    return plainToInstance(User, users, { excludeExtraneousValues: true });
  }

  async getUserByUid(uid: string): Promise<User> {
    const user = await this.UserRepo.findOneBy({ uid });

    return plainToInstance(User, user, { excludeExtraneousValues: true });
  }

  async getUserForAuth(uid: string): Promise<User | null> {
    const result = await this.UserRepo.createQueryBuilder('u')
      .leftJoinAndSelect('u.role', 'r')
      .where('u.uid = :uid', { uid })
      .select(['u.uid', 'u.phone', 'u.passwordHashed', 'r.role_name'])
      .getOne();
    return result;
  }

  async updateUser(uid: string, updateUserDto: UpdateUserDto) {
    try {
      const targetUser = await this.getUserByUid(uid);
      if (!targetUser) {
        throw new HttpException('Update User failed.', HttpStatus.NOT_FOUND);
      }

      const updated = Object.assign(targetUser, updateUserDto);
      const userSaved = await this.UserRepo.save(updated);
      return plainToInstance(User, userSaved, {
        excludeExtraneousValues: true,
      });
    } catch (e) {
      console.error(e);
      if (e.code === '23505') {
        throw new HttpException(
          {
            message: 'Phone number already exists',
            errorCode: 'PHONE_DUPLICATE',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException('Update User failed.', HttpStatus.BAD_REQUEST);
    }
  }
}
