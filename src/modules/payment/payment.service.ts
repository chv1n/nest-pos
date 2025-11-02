import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { PaymentStrategy } from './interfaces/payment.interface';
import { PaymentResult } from './interfaces/payment.result.interface';

@Injectable()
export class PaymentService {
  constructor(
    @Inject('PAYMENT_STRATEGIES')
    private readonly strategies: PaymentStrategy[],
  ) {}

  processPayment(
    type: string,
    paidAmount: number,
    totalAmount: number,
  ): Promise<PaymentResult> {
    const matchedStrategy = this.strategies.find((s) => s.getType() == type);
    if (!matchedStrategy)
      throw new HttpException(
        'Incorrect payment strategies',
        HttpStatus.BAD_REQUEST,
      );

    const strategyResult = matchedStrategy.pay(paidAmount, totalAmount);
    return strategyResult;
  }
}
