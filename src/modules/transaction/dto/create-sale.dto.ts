import { IsArray, IsNumber } from "class-validator";


type items = {
    product_id : string,
    quantity : number,
}

export class CreateSaleDto {
    @IsArray()
    items : items[];

    @IsNumber()
    paid_amount : number;
}
