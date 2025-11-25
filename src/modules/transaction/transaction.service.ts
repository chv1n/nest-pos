import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateSaleDto } from './dto/create-sale.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { Sales } from './entities/sales.entity';
import { SaleDetail } from './entities/sales-detail.entity';
import { ProductsService } from '../products/products.service';
import { PriceModifier } from './interfaces/price-modifier.interface';
import { CalculatedItem } from './interfaces/calculated-item.interface';
import { createNewId } from 'src/common/utilities/create-new-id';
import { PaymentRequestDto } from '../payment/dto/payment-request.dto';
import { SalePendingData } from './interfaces/sale-pending-data.interface';
import { PaymentService } from '../payment/payment.service';
import { UpdateSale } from './interfaces/update-sale.interface';
import { PaymentResult } from '../payment/interfaces/payment.result.interface';
import { SaleStatus } from './enum/sale-status.enum';
import { ItemProduct } from './interfaces/item-input.interface';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Sales)
    private readonly saleRepo: Repository<Sales>,
    @InjectRepository(SaleDetail)
    private readonly saleDetailRepo: Repository<SaleDetail>,
    private readonly productService: ProductsService,
    private readonly paymentService: PaymentService,
    private readonly dataSource: DataSource,
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

  private async calculateTotal(
    dto: CreateSaleDto,
    isProductExists: { product_id: string; price: number }[],
    modifiers: PriceModifier[] = [],
  ): Promise<{
    sale_id: string;
    items_result: CalculatedItem[];
    totalAmount: number;
  }> {
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
        quantity: item.quantity,
        price: matchedProduct.price,
        total_price: item.quantity * matchedProduct.price,
      };

      for (const modifier of modifiers) {
        calculated = modifier.apply(calculated);
      }

      return calculated;
    });

    const totalAmount = result.reduce((sum, item) => sum + item.total_price, 0);

    const saleId = await this.pendingSele(result, totalAmount);

    return { sale_id: saleId, items_result: result, totalAmount };
  }

  private async pendingSele(
    items_result: CalculatedItem[],
    totalAmount: number,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const saleDetailRepo = queryRunner.manager.getRepository(SaleDetail);
      const saleRepo = queryRunner.manager.getRepository(Sales);

      const saleId = await createNewId(saleRepo, 'SALE', 'sales_id');
      const newSale = saleRepo.create({
        sales_id: saleId,
        total_amount: totalAmount,
      });
      await saleRepo.insert(newSale);

      for (const item of items_result) {
        const saleDetailId = await createNewId(
          saleDetailRepo,
          'SALEDT',
          'sale_detail_id',
        );

        const detailRow: QueryDeepPartialEntity<SaleDetail> = {
          sale_detail_id: saleDetailId,
          sale_id: saleId,
          product_id: item.product_id,
          quantity: Number(item.quantity ?? 0),
          unit_price: Number(item.price),
          line_total:
            Number(item.price) * Number(item.quantity) -
            Number(item.discount ?? 0),
        };

        await saleDetailRepo.insert(detailRow);
      }

      await queryRunner.commitTransaction();
      return saleId;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      console.error('Transaction failed:', err);
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async makePayment(paymentRequestDto: PaymentRequestDto, saleId: string) {
    const salePending = await this.getSalePending(saleId);

    const strategyResult: PaymentResult =
      await this.paymentService.processPayment(
        paymentRequestDto.payment_type,
        paymentRequestDto.paidAmount,
        salePending.total_amount,
      );

    console.log('strategyResult', strategyResult.change);

    // // save and update sale status
    // const updateSaleData: UpdateSale = {
    //   paid_amount: salePending.total_amount,
    //   change: Number(strategyResult.change),
    //   status: SaleStatus.Completed,
    //   payment_method: paymentRequestDto.payment_type,
    // };
    // await this.updateSale(saleId, updateSaleData);
    // cut stock
    const saleDetail = await this.getSaleDetail(saleId);
    console.log('saleDetail', saleDetail);

    return;
  }

  private async getSalePending(saleId: string): Promise<SalePendingData> {
    const salePending: SalePendingData | null = await this.saleRepo
      .createQueryBuilder('s')
      .select(['s.total_amount'])
      .where('s.status = :status', { status: SaleStatus.Pending })
      .andWhere('s.sales_id = :sale_id', { sale_id: saleId })
      .getOne();

    if (!salePending)
      throw new HttpException(
        `Sale with ID ${saleId} and status "Pending" not found.`,
        HttpStatus.BAD_REQUEST,
      );

    return salePending;
  }

  private async getSaleDetail(saleId: string): Promise<ItemProduct[]> {
    const saleDetail = await this.saleDetailRepo.findBy({ sale_id: saleId });
    return saleDetail;
  }

  async updateSale(saleId: string, updateSale: UpdateSale) {
    const targetSale = await this.saleRepo.findOneBy({ sales_id: saleId });
    if (!targetSale)
      throw new HttpException(
        'Sale to update not found!',
        HttpStatus.BAD_REQUEST,
      );

    const saleUpdated = Object.assign(targetSale, updateSale);
    const saveSale = await this.saleRepo.save(saleUpdated);
    return saveSale;
  }
}
