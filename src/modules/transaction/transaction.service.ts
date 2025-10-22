import { Inject, Injectable } from '@nestjs/common';
import { CreateSaleDto } from './dto/create-sale.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sales } from './entities/sales.entity';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Sales) private saleRepo : Repository<Sales>,
  ){}

  async saleAndCutStock(createSaleDto: CreateSaleDto) {
    return 'This action adds a new transaction';
  }

}
