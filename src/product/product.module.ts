import { Module } from '@nestjs/common';
import { ProductService } from './service/product.service';

@Module({
  providers: [ProductService],
})
export class ProductModule {}
