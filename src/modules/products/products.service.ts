import { HttpCode, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ProductsService {
  constructor(@InjectRepository(Product) private readonly ProductRepo: Repository<Product>) { }
  async create(createProductDto: CreateProductDto) {
    try {
      const lastProduct = await this.ProductRepo
        .createQueryBuilder('p')
        .orderBy('p.product_id', "DESC")
        .getOne();
      const lastId = lastProduct ? parseInt(lastProduct.product_id.slice(4)) : 0;
      const newId = `PROD0${lastId + 1}`
      const updated = Object.assign({
        ...createProductDto,
        product_id: newId
      })
      return this.ProductRepo.save(updated);
    }
    catch(e) {
      console.error(e)
      throw new HttpException("Create product failed", HttpStatus.BAD_REQUEST)
    }
  }

  findAll() {
    return `This action returns all products`;
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
