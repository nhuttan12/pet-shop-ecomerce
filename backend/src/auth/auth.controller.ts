import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserRegisterDto } from './dto/user-register.dto';
import { UserLoginDto } from './dto/user-login.dto';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private readonly authService: AuthService) {}
  @HttpCode(HttpStatus.OK)
  @Post('v1/register')
  async register(@Body() userRegisterDto: UserRegisterDto) {
    this.logger.debug('Registering user', userRegisterDto);
    return this.authService.register(userRegisterDto);
  }

  @HttpCode(HttpStatus.OK)
  async login(@Body() userLoginDto: UserLoginDto) {
    this.logger.debug('Logging in user', userLoginDto);
    return this.authService.login(userLoginDto);
  }
}
