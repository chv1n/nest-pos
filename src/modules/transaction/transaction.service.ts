import { Injectable } from '@nestjs/common';
import { CreateSaleDto } from './dto/create-sale.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sales } from './entities/sales.entity';
import { ProductsService } from '../products/products.service';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Sales)
    private saleRepo: Repository<Sales>,
    private productService: ProductsService,
  ) {}

  async saleAndCutStock(createSaleDto: CreateSaleDto) {
    const itemsIdArr = createSaleDto.items.map((item) => item.product_id);
    const found = await this.productService.productIdExists(itemsIdArr);
    console.log('found', found);

    // return 'This action adds a new transaction';
  }
}
