import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sales } from './entities/sales.entity'; 
import { SaleDetail  } from './entities/sales-detail.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Sales,SaleDetail])],
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class TransactionModule {}
