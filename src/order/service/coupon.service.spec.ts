import { Test, TestingModule } from '@nestjs/testing';
import { Coupon } from '../entities/coupon.entity';
import { CouponRepository } from '../repository/coupon.repository';
import { CouponService } from './coupon.service';

class MockCouponRepository {
  createCoupon(coupon: Coupon) {
    return Promise.resolve();
  }
}

jest.mock('typeorm-transactional', () => ({
  Transactional: () => () => ({}),
}));

describe('CouponService', () => {
  let couponService: CouponService;
  let couponRepository: CouponRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CouponService,
        { provide: CouponRepository, useClass: MockCouponRepository },
      ],
    }).compile();

    couponService = module.get<CouponService>(CouponService);
    couponRepository = module.get<CouponRepository>(CouponRepository);
  });

  it('should be defined', () => {
    expect(couponService).toBeDefined();
  });
});
