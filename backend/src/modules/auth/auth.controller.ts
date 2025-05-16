import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  Request,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { UserForgotPasswordDTO } from 'src/helper/dto/user/user-forgot-password.dto';
import { UserResetPasswordDTO } from 'src/helper/dto/user/user-reset-password.dto';
import { CatchEverythingFilter } from 'src/helper/filter/exception.filter';
import { LocalAuthGuard } from 'src/helper/guard/local-auth.guard';
import { RequestWithUser } from 'src/helper/interface/authenticated.interface';
import { UserRegisterDto } from '../../helper/dto/user/user-register.dto';
import { AuthService } from './auth.service';
import {
  UserLoginDTO,
  UserLoginResponseDTO,
} from 'src/helper/dto/user/user-login.dto';
import { ApiBody } from '@nestjs/swagger';

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
  @UseGuards(LocalAuthGuard)
  @UseFilters(CatchEverythingFilter)
  @ApiBody({ type: UserLoginDTO })
  async login(@Request() req: RequestWithUser): Promise<UserLoginResponseDTO> {
    return this.authService.loginWithUser(req.user);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @UseFilters(CatchEverythingFilter)
  async forgotPassword(
    @Body() userForgotPasswordDTO: UserForgotPasswordDTO,
  ): Promise<void> {
    this.logger.debug('User reset password', userForgotPasswordDTO);
    return this.authService.forgotPassword(userForgotPasswordDTO);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @UseFilters(CatchEverythingFilter)
  async resetPassword(@Body() userResetPasswordDTO: UserResetPasswordDTO) {
    this.logger.debug('User reset password', userResetPasswordDTO);
    return this.authService.resetPassword(userResetPasswordDTO);
  }
}
