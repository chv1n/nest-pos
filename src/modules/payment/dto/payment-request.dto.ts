import { IsNumber, IsString } from 'class-validator';

export class PaymentRequestDto {
  @IsString()
  payment_type: string; //cash, promptpay

  @IsNumber()
  paidAmount: number;
}
