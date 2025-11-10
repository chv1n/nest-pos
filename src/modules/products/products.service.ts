import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { Inventory } from './entities/inventory.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, DataSource } from 'typeorm';
import { ItemProduct } from '../transaction/interfaces/item-input.interface';
import { createNewId } from 'src/common/utilities/create-new-id';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(Inventory)
    private readonly inventoryRepo: Repository<Inventory>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      const newId = await createNewId(this.productRepo, 'PROD', 'product_id');
      const created: CreateProductDto & { product_id: string } = {
        ...createProductDto,
        product_id: newId,
      };
      const savedProdect = await this.productRepo.save(created);
      await this.createInventory(createProductDto, newId);
      return savedProdect;
    } catch (e) {
      console.error(e);
      throw new HttpException('Create product failed', HttpStatus.BAD_REQUEST);
    }
  }

  private async createInventory(
    createProductDto: CreateProductDto,
    productId: string,
  ) {
    try {
      const newId = await createNewId(
        this.inventoryRepo,
        'INV',
        'inventory_id',
      );
      const created = {
        inventory_id: newId,
        product_id: productId,
        current_stock: createProductDto.stock,
        minimum_stock: createProductDto.minimum_stock,
      };
      await this.inventoryRepo.insert(created);
    } catch (e) {
      console.error(e);
      throw new HttpException(
        'Create product failed (Inventory)',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAll() {
    return await this.productRepo.find();
  }

  async findOne(id: string) {
    return await this.productRepo.findOneBy({ product_id: id });
  }

  async update(productId: string, updateProductDto: UpdateProductDto) {
    try {
      const targetProduct = await this.productRepo.findOneBy({
        product_id: productId,
      });
      if (!targetProduct)
        throw new HttpException(
          'Update product failed!',
          HttpStatus.BAD_REQUEST,
        );
      const updated = Object.assign(targetProduct, updateProductDto);
      const savedProduct = await this.productRepo.save(updated);
      await this.updateStock(targetProduct.product_id, updateProductDto);
      return savedProduct;
    } catch (e) {
      console.error(e);
      throw new HttpException('Update product failed!', HttpStatus.BAD_REQUEST);
    }
  }

  private async updateStock(
    productId: string,
    updateProductDto: UpdateProductDto,
  ) {
    try {
      const targetProduct = await this.inventoryRepo.findOneBy({
        product_id: productId,
      });
      if (!targetProduct)
        throw new HttpException(
          'Update product failed! (Stock)',
          HttpStatus.BAD_REQUEST,
        );
      console.log('targetProduct in inv', targetProduct);
      const source = {
        current_stock: updateProductDto.stock,
        minimum_stock: updateProductDto.minimum_stock,
      };
      const updated = Object.assign(targetProduct, source);
      console.log('updated in inv', updated);
      const savedInventory = await this.inventoryRepo.save(updated);
      return savedInventory;
    } catch (e) {
      console.error(e);
      throw new HttpException(
        'Update product failed! (Stock)',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async productIdExists(
    idArr: string[],
  ): Promise<{ exists: boolean; existingProducts: Product[] }> {
    const existingProducts = await this.productRepo.find({
      select: ['product_id', 'price'],
      where: {
        product_id: In(idArr),
        is_active: true,
      },
    });
    const foundIds = existingProducts.map((p) => p.product_id);
    const notFoundIds = idArr.filter((id) => !foundIds.includes(id));
    return notFoundIds.length === 0
      ? { exists: true, existingProducts }
      : { exists: false, existingProducts };
  }

  // async cutStock(saleDetail: ItemProduct[]) {
  //   // start transaction
  //   const queryRunner = this.dataSource.createQueryRunner();
  //   await queryRunner.connect();
  //   await queryRunner.startTransaction();

  //   try {
  //     const inventoryRepo = queryRunner.manager.getRepository(Inventory);

  //   } catch (e) {}
  // }
}
