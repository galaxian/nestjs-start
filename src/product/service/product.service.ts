import { Injectable } from '@nestjs/common';
import { ProductRepository } from '../repository/product.repository';
import { Transactional } from 'typeorm-transactional';
import { Product } from '../entities/product.entity';
import { CreateProductReqDto } from '../dto/create.product.req.dto';

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  @Transactional()
  async createProduct(reqDto: CreateProductReqDto): Promise<void> {
    const product = new Product();
    product.name = reqDto.name;
    product.price = reqDto.price;
    product.stock = reqDto.stock;
    product.imageUrl = reqDto.imageUrl;
    product.description = reqDto.description;
    product.category = reqDto.category;

    await this.productRepository.createProduct(product);
  }
}
