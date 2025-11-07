import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorator/roles.decorator';
import { ResponseMessage } from 'src/common/decorator/response-message.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import path from 'path';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Roles('Admin', 'Manager')
  @ResponseMessage('Created Product Successfully!')
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Put(':productId')
  @Roles('Admin', 'Manager')
  @ResponseMessage('Updated Product Successfully!')
  update(
    @Param('productId') productId: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(productId, updateProductDto);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
    }

    const uploadPath = path.join(__dirname, '..', '..', 'uploads', 'products');
    const filename = `${Date.now()}-${file.originalname}`;
    const filePath = path.join(uploadPath, filename);

    // ตรวจสอบว่ามีโฟลเดอร์ uploads หรือไม่ ถ้าไม่มีให้สร้าง
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    try {
      fs.writeFileSync(filePath, file.buffer); // เขียน buffer ลงในไฟล์
      console.log(`File saved to ${filePath}`);

      return {
        success: true,
        message: 'File uploaded successfully',
        filePath: `../../common/uploads/products/${filename}`, // ส่ง path ของไฟล์กลับไปให้ client
      };
    } catch (error) {
      console.error('Error saving file:', error);
      throw new HttpException(
        'Failed to save file',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
