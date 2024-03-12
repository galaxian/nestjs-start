import { Test, TestingModule } from '@nestjs/testing';
import { Coupon } from '../entities/coupon.entity';
import { CouponRepository } from '../repository/coupon.repository';
import { CouponService } from './coupon.service';
import { CouponType } from '../entities/coupon-type';

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

  describe('createCoupon', () => {
    it('쿠폰 등록 성공', async () => {
      //given
      const type: CouponType = 'fixed';
      const reqDto = {
        couponType: type,
        value: 5,
        validFrom: '2024-03-13 20',
        validUntil: '2024-03-20 20',
      };

      jest.spyOn(couponRepository, 'createCoupon').mockResolvedValueOnce(null);

      //when
      await couponService.createCoupon(reqDto);

      //then
      expect(couponRepository.createCoupon).toHaveBeenCalledTimes(1);
    });
  });
});
