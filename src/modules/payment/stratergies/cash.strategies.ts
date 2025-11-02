import { HttpException, HttpStatus } from '@nestjs/common';
import { PaymentStrategy } from '../interfaces/payment.interface';
import { PaymentResult } from '../interfaces/payment.result.interface';

export class CashStrategy implements PaymentStrategy {
  async pay(paidAmount: number, totalAmount: number): Promise<PaymentResult> {
    if (paidAmount < totalAmount)
      throw new HttpException(
        'The payment is incomplete.',
        HttpStatus.BAD_REQUEST,
      );

    const change = paidAmount - totalAmount;
    return { status: true, change: change };
  }

  getType(): string {
    return 'cash';
  }
}
