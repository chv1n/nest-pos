import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator'

export class CreateProductDto {
    @IsString()
    product_name: string

    @IsNumber()
    price: number

    @IsNumber()
    cost_price: number

    @IsString()
    @IsOptional()
    description: string

    @IsNumber()
    @IsOptional()
    stock: number

    @IsBoolean()
    @IsOptional()
    is_active: boolean

    @IsString()
    category_id: string
}
