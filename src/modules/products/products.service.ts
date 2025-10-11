import { HttpCode, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import e from 'express';

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
      const created = Object.create({
        ...createProductDto,
        product_id: newId
      })
      return this.ProductRepo.save(created);
    }
    catch (e) {
      console.error(e)
      throw new HttpException("Create product failed", HttpStatus.BAD_REQUEST)
    }
  }

  async findAll() {
    return await this.ProductRepo.find();
  }

  async findOne(id: string) {
    return await this.ProductRepo.findOneBy({ product_id: id });
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    try {
      const targetProduct = await this.findOne(id);
      if (!targetProduct) throw new HttpException("Update product failed!", HttpStatus.BAD_REQUEST);
      const updated = Object.assign(targetProduct , updateProductDto);
      return await this.ProductRepo.save(updated);
    }
    catch (e) {
      console.error(e)
      throw new HttpException("Update product failed!", HttpStatus.BAD_REQUEST);
    }
  }


}
