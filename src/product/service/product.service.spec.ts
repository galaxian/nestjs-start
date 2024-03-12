import { Test, TestingModule } from '@nestjs/testing';
import { Product } from '../entities/product.entity';
import { ProductRepository } from '../repository/product.repository';
import { ProductService } from './product.service';
import { FindAllProductResDto } from '../dto/find.products.res.dto';

class MockProductRepository {
  createProduct(product: Product) {
    return Promise.resolve();
  }

  findAllProduct() {
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

  describe('findAllProduct', () => {
    it('상품 목록 조회 성공', async () => {
      //given
      const product1 = new Product();
      product1.id = 'uuid1';
      product1.name = '태블릿';
      product1.price = 100000;
      product1.imageUrl = 'https://~~~';
      product1.description = '가성비 좋은 태블릿';
      product1.category = '전자기기';

      const product2 = new Product();
      product1.id = 'uuid2';
      product1.name = '책';
      product1.price = 10000;
      product1.imageUrl = 'https://~~~book';
      product1.description = '베스트 셀러';
      product1.category = '도서';

      jest
        .spyOn(productRepository, 'findAllProduct')
        .mockResolvedValueOnce([product1, product2]);

      //when
      const result = await productService.findAllProduct();

      //then
      expect(result.length).toBe(2);
      expect(result[0]).toEqual(
        new FindAllProductResDto(
          product1.id,
          product1.name,
          product1.price,
          product1.imageUrl,
          product1.category,
          product1.status,
        ),
      );
      expect(result[1]).toEqual(
        new FindAllProductResDto(
          product2.id,
          product2.name,
          product2.price,
          product2.imageUrl,
          product2.category,
          product2.status,
        ),
      );
    });
    it('상품이 없는 경우 빈 리스트 반환', async () => {
      //given
      jest.spyOn(productRepository, 'findAllProduct').mockResolvedValueOnce([]);

      //when
      const result = await productService.findAllProduct();

      //then
      expect(result.length).toBe(0);
      expect(result).toEqual([]);
    });
  });
});
