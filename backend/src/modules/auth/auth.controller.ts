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
import { UserRegisterDto } from '../../helper/dto/user/user-register.dto';
import { UserLoginDto } from '../../helper/dto/user/user-login.dto';
import { CatchEverythingFilter } from 'src/helper/filter/exception.filter';
import { UserResetPasswordDTO } from 'src/helper/dto/user/user-reset-password.dto';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private readonly authService: AuthService) {}

  @Post('v1/register')
  @HttpCode(HttpStatus.OK)
  @UseFilters(CatchEverythingFilter)
  async register(@Body() userRegisterDto: UserRegisterDto) {
    this.logger.debug('Registering user', userRegisterDto);
    return this.authService.register(userRegisterDto);
  }

  @Post('v1/login')
  @HttpCode(HttpStatus.OK)
  @UseFilters(CatchEverythingFilter)
  async login(@Body() userLoginDto: UserLoginDto) {
    this.logger.debug('Logging in user', userLoginDto);
    return this.authService.login(userLoginDto);
  }

  async resetPassword(@Body() userResetPassword: UserResetPasswordDTO) {
    this.logger.debug('User reset password', userResetPassword);
    return this.authService
  }
}
