import { Test, TestingModule } from '@nestjs/testing';
import { Product } from '../entities/product.entity';
import { ProductRepository } from '../repository/product.repository';
import { ProductService } from './product.service';

class MockProductRepository {
  createProduct(product: Product) {
    return Promise.resolve();
  }
}

describe('ProductService', () => {
  let productService: ProductService;
  let productRepository: ProductRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        { provide: ProductRepository, useClass: MockProductRepository },
      ],
    }).compile();

    productService = module.get<ProductService>(ProductService);
    productRepository = module.get<ProductRepository>(ProductRepository);
  });

  it('should be defined', () => {
    expect(productService).toBeDefined();
  });
});
