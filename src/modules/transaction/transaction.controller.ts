import { Controller, Post, Body, Param } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { PaymentRequestDto } from '../payment/dto/payment-request.dto';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  create(@Body() createSaleDto: CreateSaleDto) {
    return this.transactionService.getTotal(createSaleDto);
  }

  @Post('pay/:saleId')
  pay(
    @Body() paymentRequestDto: PaymentRequestDto,
    @Param('saleId') saleId: string,
  ) {
    return this.transactionService.makePayment(paymentRequestDto, saleId);
  }
}
