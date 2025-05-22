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
import {
  UserRegisterDTO,
  UserRegisterResponseDTO,
} from '../../helper/dto/user/user-register.dto';
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

  /**
   * Register a new user account.
   * Handles validation, hashing, DB creation, and email notification via service layer.
   *
   * @param userRegisterDTO - payload from client
   * @returns created user
   */
  @Post('v1/register')
  @HttpCode(HttpStatus.OK)
  @UseFilters(CatchEverythingFilter)
  async register(
    @Body() userRegisterDTO: UserRegisterDTO,
  ): Promise<UserRegisterResponseDTO> {
    this.logger.debug(`Registering user: ${JSON.stringify(userRegisterDTO)}`);
    return this.authService.register(userRegisterDTO);
  }

  /**
   * Login an account using Passport LocalStrategy (via @UseGuards).
   * Assumes LocalAuthGuard already validated the user's credentials
   * @param req - Request object containing the authenticated user
   * @returns Access token and basic user info
   */
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
    this.logger.debug(
      `User reset password ${JSON.stringify(userForgotPasswordDTO)}`,
    );
    return this.authService.forgotPassword(userForgotPasswordDTO);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @UseFilters(CatchEverythingFilter)
  async resetPassword(@Body() userResetPasswordDTO: UserResetPasswordDTO) {
    this.logger.debug(
      `User reset password ${JSON.stringify(userResetPasswordDTO)}`,
    );
    return this.authService.resetPassword(userResetPasswordDTO);
  }
}
