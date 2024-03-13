import { Body, Controller, Put, Req, UseGuards } from '@nestjs/common';
import { PointService } from '../service/point.service';
import { JwtAuthGuard } from 'src/auth/security/auth.guard';
import { ChangePointReqDto } from '../dto/change-point.req.dto';
import { Request } from 'express';
import { ResponseDto } from 'src/utils/dto/response.dto';
import { PointResDto } from '../dto/point.res.dto';

@Controller('points')
export class PointController {
  constructor(private readonly pointService: PointService) {}

  @UseGuards(JwtAuthGuard)
  @Put()
  async changePoint(
    @Body() reqDto: ChangePointReqDto,
    @Req() req: Request,
  ): Promise<ResponseDto<PointResDto>> {
    const user: any = req.user;
    const data = await this.pointService.changePoint(reqDto, user);
    const result = new ResponseDto(200, null, data);
    return result;
  }
}
