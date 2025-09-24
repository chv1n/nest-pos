import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly UserRepo: Repository<User>
  ) { }


  async createUser(createUserDto: CreateUserDto) {
    try {
      const lastUser = await this.UserRepo
        .createQueryBuilder('u')
        .orderBy('u.uid', "DESC")
        .getOne();
      const lastIdNumber = lastUser ? parseInt(lastUser.uid.slice(3)) : 0;
      const newUid = `UID0${String(lastIdNumber + 1)}`;
      const passwordHashed = await bcrypt.hash(createUserDto.phone.slice(-6), 10);
      const newUser = this.UserRepo.create({
        ...createUserDto,
        uid: newUid,
        passwordHashed: passwordHashed
      });
      const user = await this.UserRepo.save(newUser);
      return plainToInstance(User, user, { excludeExtraneousValues: true });
    } catch (e) {
      console.error(e)
      if (e.code === '23505') {
        throw new HttpException({
          message: 'Phone number already exists',
          errorCode: 'PHONE_DUPLICATE',
        }, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException("Create User failed.", HttpStatus.BAD_REQUEST);
    }

  }


  async getAllUser(): Promise<User[]> {
    const users = await this.UserRepo.find();
    return plainToInstance(User, users, { excludeExtraneousValues: true });
  }

  async getUserByUid(uid: string): Promise<User> {
    const user = await this.UserRepo.findOneBy({ uid })
    return plainToInstance(User, user, { excludeExtraneousValues: true });
  }

  async updateUser(uid: string, updateUserDto: UpdateUserDto) {
    try {
      const targetUser = await this.getUserByUid(uid);
      if (!targetUser) { throw new HttpException("Update User failed.", HttpStatus.NOT_FOUND) }

      const updated = Object.assign(targetUser, updateUserDto);
      const userSaved = await this.UserRepo.save(updated);
      return plainToInstance(User, userSaved, { excludeExtraneousValues: true });
    } catch (e) {
      console.error(e)
      if (e.code === '23505') {
        throw new HttpException({
          message: 'Phone number already exists',
          errorCode: 'PHONE_DUPLICATE',
        }, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException("Update User failed.", HttpStatus.BAD_REQUEST);
    }

  }

  async updateIsActive(uid: string, updateUserDto: UpdateUserDto) {
    try {
      const targetUser = await this.getUserByUid(uid);
      if (!targetUser) { throw new HttpException("Update active status failed.", HttpStatus.NOT_FOUND) }

      const updated = Object.assign(targetUser, updateUserDto)
      const userSaved = await this.UserRepo.save(updated);
      return plainToInstance(User, userSaved, { excludeExtraneousValues: true });
    }
    catch (e) {
      console.error(e)
      throw new HttpException("Update active status failed.", HttpStatus.BAD_REQUEST);
    }
  }

}
