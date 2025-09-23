import { Optional } from '@nestjs/common';
import { IsString } from 'class-validator'

export class CreateUserDto {

    @IsString()
    phone: string;

    @IsString()
    first_name: string;

    @IsString()
    last_name: string;

    @IsString()
    role_id: string;

}
