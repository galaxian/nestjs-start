import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ProductService } from '../service/product.service';
import { CreateProductReqDto } from '../dto/create.product.req.dto';
import { ResponseDto } from 'src/utils/dto/response.dto';
import { FindAllProductResDto } from '../dto/find.products.res.dto';
import { JwtAuthGuard } from 'src/auth/security/auth.guard';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createProduct(
    @Body() createProductDto: CreateProductReqDto,
  ): Promise<ResponseDto<unknown>> {
    await this.productService.createProduct(createProductDto);
    const result = new ResponseDto(201);
    return result;
  }

  @Get()
  async findAllProduct(): Promise<ResponseDto<FindAllProductResDto[]>> {
    const data = await this.productService.findAllProduct();
    const result = new ResponseDto(200, null, data);
    return result;
  }
}
