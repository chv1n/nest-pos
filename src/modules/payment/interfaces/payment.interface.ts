import { PaymentResult } from './payment.result.interface';

export interface PaymentStrategy {
  pay(paidAmount: number, totalAmount: number): Promise<PaymentResult>;
  getType(): string;
}
