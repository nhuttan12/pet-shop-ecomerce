import { ApiResponse } from '@api-response/ApiResponse';
import { CatchEverythingFilter } from '@filters/exception.filter';
import { LocalAuthGuard } from '@guards/local-auth.guard';
import { main } from '@services/seed';
import { UserForgotPasswordDTO } from '@user/dto/user-forgot-password.dto';
import { UserLoginDTO } from '@user/dto/user-login.dto';
import { UserRegisterDTO } from '@user/dto/user-register.dto';
import { UserResetPasswordDTO } from '@user/dto/user-reset-password.dto';
import { AuthService } from './auth.service';
import { UserLoginResponseDTO } from './dto/user-login-response.dto';
import { RequestWithUser } from './interfaces/authenticated.interface';
import { AuthNotifyMessages } from './messages/auth.notify-messages';
import {
  ApiBody,
  ApiOperation,
  ApiTags,
  ApiResponse as SwaggerResponse,
} from '@nestjs/swagger';
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
  @ApiOperation({ summary: 'Đăng ký tài khoản mới' })
  @ApiBody({ type: UserRegisterDTO })
  @SwaggerResponse({
    status: HttpStatus.OK,
    description: 'User registered successfully',
  })
  @SwaggerResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Validation failed or user already exists',
  })
  async register(
    @Body() userRegisterDTO: UserRegisterDTO,
  ): Promise<ApiResponse<void>> {
    this.logger.debug(`Registering user: ${JSON.stringify(userRegisterDTO)}`);
    await this.authService.register(userRegisterDTO);

    return {
      message: AuthNotifyMessages.REGISTER_SUCCESSFUL,
      statusCode: HttpStatus.OK,
    };
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
  @SwaggerResponse({
    status: HttpStatus.OK,
    description: 'User logged in successfully',
  })
  @SwaggerResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid credentials',
  })
  async login(@Request() req: RequestWithUser): Promise<ApiResponse<void>> {
    await this.authService.loginWithUser(req.user);
    return {
      message: AuthNotifyMessages.LOGIN_SUCCESSFUL,
      statusCode: HttpStatus.OK,
    };
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Gửi email quên mật khẩu' })
  @ApiBody({ type: UserForgotPasswordDTO })
  @SwaggerResponse({
    status: HttpStatus.OK,
    description: 'Password reset email sent',
  })
  @SwaggerResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Email not found',
  })
  async forgotPassword(
    @Body() userForgotPasswordDTO: UserForgotPasswordDTO,
  ): Promise<ApiResponse<void>> {
    this.logger.debug(
      `User reset password ${JSON.stringify(userForgotPasswordDTO)}`,
    );
    await this.authService.forgotPassword(userForgotPasswordDTO);
    return {
      message: AuthNotifyMessages.PLEASE_GO_TO_MAIL_TO_GET_LINK_RESET_PASSWORD,
      statusCode: HttpStatus.OK,
    };
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Đặt lại mật khẩu sau khi nhận link qua email' })
  @ApiBody({ type: UserResetPasswordDTO })
  @SwaggerResponse({
    status: HttpStatus.OK,
    description: 'Password reset successfully',
  })
  @SwaggerResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid token or password',
  })
  async resetPassword(
    @Body() userResetPasswordDTO: UserResetPasswordDTO,
  ): Promise<ApiResponse<void>> {
    this.logger.debug(
      `User reset password ${JSON.stringify(userResetPasswordDTO)}`,
    );
    await this.authService.resetPassword(userResetPasswordDTO);
    return {
      message: AuthNotifyMessages.RESET_PASSWORD_SUCCESSFUL,
      statusCode: HttpStatus.OK,
    };
  }

  @Post('v1/login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: 'Đăng nhập tài khoản' })
  @ApiBody({ type: UserLoginDTO })
  @SwaggerResponse({
    status: HttpStatus.OK,
    description: 'User logged in successfully',
    type: UserLoginResponseDTO,
  })
  @SwaggerResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid credentials',
  })
  async loginAdmin(
    @Request() req: RequestWithUser,
  ): Promise<ApiResponse<UserLoginResponseDTO>> {
    const payload = await this.authService.loginWithUser(req.user);
    this.logger.debug(`Payload user when login: ${JSON.stringify(payload)}`);

    return {
      message: AuthNotifyMessages.LOGIN_SUCCESSFUL,
      statusCode: HttpStatus.OK,
      data: payload,
    };
  }

  @Post('/seed')
  async seedData() {
    await main();
  }
}
