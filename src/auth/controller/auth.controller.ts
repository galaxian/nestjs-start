import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { CreateUserReqDto } from '../dto/create-user.req';
import { ResponseDto } from 'src/utils/dto/response.dto';
import { LoginReqDto } from '../dto/login.req';
import { LoginResDto } from '../dto/login.res';
import { AuthService } from '../service/auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('signup')
  async signupUser(
    @Body() createUserDto: CreateUserReqDto,
  ): Promise<ResponseDto<unknown>> {
    await this.userService.createUser(createUserDto);
    const result = new ResponseDto(201);
    return result;
  }

  @Get('login')
  async login(
    @Body() loginDto: LoginReqDto,
  ): Promise<ResponseDto<LoginResDto>> {
    const data = await this.authService.login(loginDto);
    const response = new ResponseDto(200, null, data);
    return response;
  }
}
