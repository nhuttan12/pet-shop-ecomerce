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
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
@UseFilters(CatchEverythingFilter)
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
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User registered successfully',
    type: UserRegisterResponseDTO,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Validation failed or user already exists',
  })
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
  @ApiBody({ type: UserLoginDTO })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User logged in successfully',
    type: UserLoginResponseDTO,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid credentials',
  })
  async login(@Request() req: RequestWithUser): Promise<UserLoginResponseDTO> {
    return this.authService.loginWithUser(req.user);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Password reset email sent',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Email not found' })
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
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Password reset successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid token or password',
  })
  async resetPassword(@Body() userResetPasswordDTO: UserResetPasswordDTO) {
    this.logger.debug(
      `User reset password ${JSON.stringify(userResetPasswordDTO)}`,
    );
    return this.authService.resetPassword(userResetPasswordDTO);
  }
}
