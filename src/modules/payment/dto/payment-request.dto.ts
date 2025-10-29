import { IsNumber, IsString } from 'class-validator';

export class PaymentRequestDto {
  @IsString()
  type: string; // 'cash', 'stripe', ...

  @IsNumber()
  amount: number;
}
