import { Injectable } from '@nestjs/common';
import { PointRepository } from '../repository/point.repository';
import { Transactional } from 'typeorm-transactional';
import { ChangePointReqDto } from '../dto/change-point.req.dto';
import { User } from 'src/auth/entity/user.entity';
import { PointResDto } from '../dto/point.res.dto';

@Injectable()
export class PointService {
  constructor(private readonly pointRepository: PointRepository) {}

  @Transactional()
  async changePoint(
    reqDto: ChangePointReqDto,
    certifiedUser: User,
  ): Promise<PointResDto> {
    const { amount, type } = reqDto;

    const userPoint = await this.pointRepository.findPointByUserId(
      certifiedUser.id,
    );

    if (type === 'earn') {
      userPoint.earnPoint(amount);
    } else {
      userPoint.usePoint(amount);
    }

    return {
      availablePoint: userPoint.availablePoint,
    };
  }
}
