import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly UserRepo: Repository<User>
  ) { }


  async createUser(createUserDto: CreateUserDto) {
    const lastUser = await this.UserRepo
      .createQueryBuilder('u')
      .orderBy('u.uid', "DESC")
      .getOne();

    const lastIdNumber = lastUser ? parseInt(lastUser.uid.slice(1)) : 0;
    const newUid = `UID00${String(lastIdNumber + 1)}`

    const passwordHashed = await bcrypt.hash(createUserDto.phone.slice(-6), 10)
    console.log(passwordHashed)
    const newUser = this.UserRepo.create({
      ...createUserDto,
      uid: newUid,
      passwordHashed: passwordHashed
    })

    return await this.UserRepo.save(newUser)
  }

  // findAll() {
  //   return `This action returns all users`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} user`;
  // }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}
