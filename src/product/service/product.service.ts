import { Injectable } from '@nestjs/common';
import { ProductRepository } from '../repository/product.repository';
import { Transactional } from 'typeorm-transactional';
import { Product } from '../entities/product.entity';
import { CreateProductReqDto } from '../dto/create.product.req.dto';
import { FindAllProductResDto } from '../dto/find.products.res.dto';

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

  @Transactional()
  async findAllProduct(): Promise<FindAllProductResDto[]> {
    const findProductList = await this.productRepository.findAllProduct();
    const result: FindAllProductResDto[] = findProductList.map(
      (product) =>
        new FindAllProductResDto(
          product.id,
          product.name,
          product.price,
          product.imageUrl,
          product.category,
          product.status,
        ),
    );
    return result;
  }
}
