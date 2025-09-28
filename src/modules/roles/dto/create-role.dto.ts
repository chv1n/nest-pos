import { IsBoolean, IsString, IsOptional } from 'class-validator'

export class CreateRoleDto {

    @IsString()
    role_name: string;

    @IsOptional()
    @IsBoolean()
    is_active?: boolean;

}
