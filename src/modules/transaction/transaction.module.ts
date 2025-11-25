import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sales } from './entities/sales.entity';
import { SaleDetail } from './entities/sales-detail.entity';
import { ProductsModule } from '../products/products.module';
import { PaymentModule } from '../payment/payment.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([Sales, SaleDetail]),
    ProductsModule,
    PaymentModule,
  ],
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class TransactionModule {}
