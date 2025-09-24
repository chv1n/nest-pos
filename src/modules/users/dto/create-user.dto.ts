import { Optional } from '@nestjs/common';
import { IsBoolean, IsOptional, IsPhoneNumber, IsString } from 'class-validator'

export class CreateUserDto {
    @IsString()
    @IsOptional()
    uid?: string

    @IsString()
    @IsPhoneNumber('TH', { message: 'หมายเลขโทรศัพท์ไม่ถูกต้อง' })
    phone: string;

    @IsString()
    first_name: string;

    @IsString()
    last_name: string;

    @IsString()
    role_id?: string;

    @IsBoolean()
    @IsOptional()
    is_active?: boolean;
}
