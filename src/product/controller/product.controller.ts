import { Body, Controller, Post } from '@nestjs/common';
import { ProductService } from '../service/product.service';
import { CreateProductReqDto } from '../dto/create.product.req.dto';
import { ResponseDto } from 'src/utils/dto/response.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  async createProduct(
    @Body() createProductDto: CreateProductReqDto,
  ): Promise<ResponseDto<unknown>> {
    await this.productService.createProduct(createProductDto);
    const result = new ResponseDto(201);
    return result;
  }
}
