import { IsBoolean, IsString, IsOptional } from 'class-validator'

export class CreateRoleDto {

    @IsString()
    role_name: string;

    @IsBoolean()
    @IsOptional()
    is_active?: boolean;

}
