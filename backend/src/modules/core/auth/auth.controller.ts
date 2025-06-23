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
import { UserForgotPasswordDTO } from '@dtos/user/user-forgot-password.dto';
import { UserResetPasswordDTO } from '@dtos/user/user-reset-password.dto';
import { CatchEverythingFilter } from '@filter/exception.filter';
import { LocalAuthGuard } from '@guard/local-auth.guard';
import { RequestWithUser } from '@interfaces';
import { AuthService } from '@core-modules/auth/auth.service';
import { UserLoginDTO, UserLoginResponseDTO } from '@dtos/user/user-login.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  UserRegisterDTO,
  UserRegisterResponseDTO,
} from '@dtos/user/user-register.dto';

@ApiTags('Auth')
@Controller('auth')
@UseFilters(CatchEverythingFilter)
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private readonly authService: AuthService) { }

  /**
   * Register a new user account.
   * Handles validation, hashing, DB creation, and email notification via service layer.
   *
   * @param userRegisterDTO - payload from client
   * @returns created user
   */
  @Post('v1/register')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Đăng ký tài khoản mới' })
  @ApiBody({ type: UserRegisterDTO })
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
  @ApiOperation({ summary: 'Đăng nhập tài khoản' })
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
  @ApiOperation({ summary: 'Gửi email quên mật khẩu' })
  @ApiBody({ type: UserForgotPasswordDTO })
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
  @ApiOperation({ summary: 'Đặt lại mật khẩu sau khi nhận link qua email' })
  @ApiBody({ type: UserResetPasswordDTO })
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
