import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { CreateUserReqDto } from '../dto/create-user.req';
import { ResponseDto } from 'src/utils/dto/response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  async signupUser(
    @Body() createUserDto: CreateUserReqDto,
  ): Promise<ResponseDto<unknown>> {
    await this.userService.createUser(createUserDto);
    const result = new ResponseDto(201);
    return result;
  }
}
