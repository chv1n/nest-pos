import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';



@Injectable()
export class CategoriesService {
  constructor(@InjectRepository(Category)
  private readonly CategRepo: Repository<Category>) { }

  async create(createCategoryDto: CreateCategoryDto) {

    try {
      const lastCateg = await this.CategRepo
        .createQueryBuilder('c')
        .orderBy('c.categ_id', 'DESC')
        .getOne()
      const lastIdNumber = lastCateg ? parseInt(lastCateg.categ_id.slice(5)) : 0;
      const newId = `CATEG0${lastIdNumber + 1}`;
      const createCateg = this.CategRepo.create({
        categ_id: newId,
        ...createCategoryDto
      })
      return await this.CategRepo.save(createCateg)
    } catch (e) {
      console.error("Error in category service : " , e)
      throw new HttpException("Create category failed!", HttpStatus.BAD_REQUEST);
    }
  }

  findAll() {
    return `This action returns all categories`;
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
