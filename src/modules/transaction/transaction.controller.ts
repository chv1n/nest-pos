import { Controller, Post, Body } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateSaleDto } from './dto/create-sale.dto';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  create(@Body() createSaleDto: CreateSaleDto) {
    return this.transactionService.getTotal(createSaleDto);
  }
}
