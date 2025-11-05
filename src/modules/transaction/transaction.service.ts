import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateSaleDto } from './dto/create-sale.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sales } from './entities/sales.entity';
import { ProductsService } from '../products/products.service';
import { PriceModifier } from './interfaces/price-modifier.interface';
import { CalculatedItem } from './interfaces/calculated-item.interface';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Sales)
    private saleRepo: Repository<Sales>,
    private productService: ProductsService,
  ) {}

  async getTotal(createSaleDto: CreateSaleDto) {
    const itemsIdArr = createSaleDto.items.map((item) => item.product_id);
    const isProductExists =
      await this.productService.productIdExists(itemsIdArr);

    if (!isProductExists.exists)
      throw new HttpException(
        "Some product doesn't exist",
        HttpStatus.BAD_REQUEST,
      );

    return this.calculateTotal(createSaleDto, isProductExists.existingProducts);
  }

  private calculateTotal(
    dto: CreateSaleDto,
    isProductExists: { product_id: string; price: number }[],
    modifiers: PriceModifier[] = [],
  ): { items: CalculatedItem[]; totalAmount: number } {
    const result: CalculatedItem[] = dto.items.map((item) => {
      const matchedProduct = isProductExists.find(
        (p) => p.product_id === item.product_id,
      );

      if (!matchedProduct)
        throw new Error(
          `Product not found or price missing: ${item.product_id}`,
        );

      let calculated = {
        product_id: item.product_id,
        quentity: item.quantity,
        price: matchedProduct.price,
        total: item.quantity * matchedProduct.price,
      };

      for (const modifier of modifiers) {
        calculated = modifier.apply(calculated);
      }

      return calculated;
    });

    const totalAmount = result.reduce((sum, item) => sum + item.total, 0);

    return { items: result, totalAmount };
  }
}
