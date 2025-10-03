import { IsOptional, IsString } from 'class-validator'

export class CreateCategoryDto {

    @IsString()
    categ_name: string;

    @IsString()
    @IsOptional()
    is_active? : boolean;

}
