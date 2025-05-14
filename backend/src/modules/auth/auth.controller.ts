import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  UseFilters,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserRegisterDto } from '../../helper/dto/user-register.dto';
import { UserLoginDto } from '../../helper/dto/user-login.dto';
import { CatchEverythingFilter } from 'src/helper/filter/exception.filter';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('v1/register')
  @UseFilters(CatchEverythingFilter)
  async register(@Body() userRegisterDto: UserRegisterDto) {
    this.logger.debug('Registering user', userRegisterDto);
    return this.authService.register(userRegisterDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('v1/login')
  @UseFilters(CatchEverythingFilter)
  async login(@Body() userLoginDto: UserLoginDto) {
    this.logger.debug('Logging in user', userLoginDto);
    return this.authService.login(userLoginDto);
  }
}
