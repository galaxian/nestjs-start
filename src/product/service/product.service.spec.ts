import { Test, TestingModule } from '@nestjs/testing';
import { Product } from '../entities/product.entity';
import { ProductRepository } from '../repository/product.repository';
import { ProductService } from './product.service';

class MockProductRepository {
  createProduct(product: Product) {
    return Promise.resolve();
  }
}

jest.mock('typeorm-transactional', () => ({
  Transactional: () => () => ({}),
}));

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

  describe('createProduct', () => {
    it('상품 등록 성공', async () => {
      //given
      const reqDto = {
        name: '태블릿',
        price: 100000,
        stock: 10,
        imageUrl: 'https://~~~',
        description: '매우 가성비 좋은 태블릿',
        category: '전자기기',
      };

      const createProductSpy = jest
        .spyOn(productRepository, 'createProduct')
        .mockResolvedValueOnce(null);

      //when
      await productService.createProduct(reqDto);

      //then
      expect(createProductSpy).toHaveBeenCalledTimes(1);
    });
  });
});
