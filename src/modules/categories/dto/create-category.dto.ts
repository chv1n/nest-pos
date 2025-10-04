import { IsBoolean, IsOptional, IsString } from 'class-validator'

export class CreateCategoryDto {

    @IsString()
    categ_name: string;

    @IsBoolean()
    @IsOptional()
    is_active? : boolean;

}
