import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CashStrategy } from './stratergies/cash.strategies';

@Module({
  providers: [
    CashStrategy,
    {
      provide: 'PAYMENT_STRATEGIES',
      useFactory: (cash) => [cash],
      inject: [CashStrategy],
    },
    PaymentService,
  ],
  exports: [PaymentService],
})
export class PaymentModule {}
