import { UserLoginResponseDTO } from '@auth/dto/user-login-response.dto';
import { UserRegisterResponseDTO } from '@auth/dto/user-register-response.dto';
import { AuthMessageLog } from '@auth/messages/auth.messages-log';
import { AppConfigService } from '@config/app-config.service';
import { MailService } from '@mail/mail.service';
import { ErrorMessage } from '@messages/error.messages';
import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@role/entities/roles.entity';
import { RoleName } from '@role/enums/role.enum';
import { RoleService } from '@role/role.service';
import { UserForgotPasswordDTO } from '@user/dto/user-forgot-password.dto';
import { UserRegisterDTO } from '@user/dto/user-register.dto';
import { UserResetPasswordDTO } from '@user/dto/user-reset-password.dto';
import { User } from '@user/entites/users.entity';
import { UserStatus } from '@user/enums/user-status.enum';
import { UserErrorMessage } from '@user/messages/user.error-messages';
import { UserMessageLog } from '@user/messages/user.messages-log';
import { UserService } from '@user/user.service';
import { AuthErrorMessages } from 'auth/messages/auth.error-messages';
import { AuthNotifyMessages } from 'auth/messages/auth.notify-messages';
import bcrypt from 'bcrypt';
import { JwtPayload } from '@auth/interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly saltOrRounds = 10;
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private roleService: RoleService,
    private mailService: MailService,
    private appConfigService: AppConfigService,
  ) {}

  async getUserFromPayload(id: number, username: string): Promise<JwtPayload> {
    const userWithId: User = await this.userService.getUserById(id);

    const userWithUsername: User =
      await this.userService.getUserByUsername(username);

    if (!userWithId || !userWithUsername) {
      this.logger.error(AuthMessageLog.USER_EXIST);
      throw new UnauthorizedException(AuthErrorMessages.USER_ALREADY_EXISTS);
    }

    if (userWithId.id !== userWithUsername.id) {
      this.logger.error(AuthMessageLog.INVALID_LOGIN_INFO);
      throw new UnauthorizedException(AuthErrorMessages.INFOR_UNVALID);
    }

    const role: Role = await this.roleService.getRoleById(userWithId.role.id);

    const safeUser: JwtPayload = {
      sub: userWithId.id,
      username: userWithId.username,
      email: userWithId.email,
      role: role.name,
    };
    this.logger.debug('Get safe user', safeUser);

    return safeUser;
  }

  /**
   * Use for validate when login
   * @param username: username of user
   * @param password: password of user
   * @returns User
   */
  async validateUser(username: string, password: string): Promise<User> {
    const user: User = await this.userService.getUserByUsername(username);
    this.logger.debug('Get user info:', user);

    if (!user) {
      this.logger.error(AuthMessageLog.INVALID_LOGIN_INFO);
      throw new UnauthorizedException(AuthErrorMessages.INFOR_UNVALID);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      this.logger.error(AuthMessageLog.INVALID_LOGIN_INFO);
      throw new UnauthorizedException(AuthErrorMessages.INFOR_UNVALID);
    }

    if (user.status === UserStatus.BANNED) {
      this.logger.log(UserMessageLog.USER_BANNED, user.id);
      throw new UnauthorizedException(AuthErrorMessages.USER_BANNED);
    }

    if (user.status !== UserStatus.ACTIVE) {
      this.logger.log(UserMessageLog.USER_NOT_ACTIVE, user.id);
      throw new UnauthorizedException(UserErrorMessage.USER_NOT_ACTIVE);
    }

    return user;
  }

  /**
   * @description register user
   * @param UserRegisterDTO: the params is validated of user for register
   * @returns UserRegisterResponseDTO
   */
  async register(request: UserRegisterDTO): Promise<UserRegisterResponseDTO> {
    // 1. Get request to check value
    this.logger.debug('Request: ', JSON.stringify(request, null, 2));

    try {
      // 2. Check password and retype password match
      if (request.password !== request.retypePassword) {
        this.logger.warn(AuthMessageLog.PASSWORD_MISMATCH);
        throw new UnauthorizedException(AuthErrorMessages.PASSWORD_MISMATCH);
      }

      // 3. Find user by user name
      const [existingUserWithUsername]: User[] =
        await this.userService.findUserByUsername(request.username);
      this.logger.debug(
        'Get existing user with username',
        existingUserWithUsername,
      );

      // 4. Find user with email
      const existingUserWithEmail: User | null =
        await this.userService.getUserByEmail(request.email);
      this.logger.debug(
        'Get existing user with email: ',
        existingUserWithEmail,
      );

      // 5. Check two type of user exist
      if (existingUserWithUsername || existingUserWithEmail) {
        this.logger.warn(UserMessageLog.USERNAME_OR_EMAIL_EXISTS);
        throw new UnauthorizedException(
          AuthErrorMessages.USERNAME_OR_EMAIL_EXISTS,
        );
      }

      // 6. Create hash password
      const hashedPassword = await bcrypt.hash(
        request.password,
        this.saltOrRounds,
      );
      this.logger.debug('Get hashed password', hashedPassword);

      // 7. Get role by role name
      const role = await this.roleService.getRoleByName(RoleName.CUSTOMER);

      // 8. Create user
      const userCreated: User = await this.userService.createUser({
        username: request.username,
        email: request.email,
        hashedPassword,
        roleId: role.id,
        status: UserStatus.ACTIVE,
      });

      // 9. Check if user is created
      if (userCreated) {
        // 10. Send mail
        await this.mailService.sendMail(
          request.email,
          AuthNotifyMessages.REGISTER_SUCCESSFUL,
          AuthNotifyMessages.YOUR_ACCOUNT_WITH_USERNAME +
            ' ' +
            request.username,
        );
      }

      return {
        id: userCreated.id,
        username: request.username,
        email: request.email,
        role: role.name,
        status: UserStatus.ACTIVE,
      };
    } catch (error) {
      this.logger.error('Error during registration', error);
      throw error;
    } finally {
      this.logger.log(
        UserMessageLog.USER_CREATED_WITH_INFO,
        JSON.stringify(request, null, 2),
      );
    }
  }

  async forgotPassword({ email }: UserForgotPasswordDTO): Promise<void> {
    const existingUser: User | null =
      await this.userService.getUserByEmail(email);
    this.logger.debug('Get user:', existingUser);

    if (!existingUser) {
      this.logger.warn(UserMessageLog.USER_NOT_FOUND);
      throw new UnauthorizedException(UserErrorMessage.USER_NOT_FOUND);
    }

    const role: Role = await this.roleService.getRoleById(existingUser.role.id);
    this.logger.debug('Get role: ', role);

    const payload: JwtPayload = {
      sub: existingUser.id,
      username: existingUser.username,
      role: role.name,
    };
    this.logger.debug('Payload: ', payload);

    const token: string = this.jwtService.sign(payload, { expiresIn: '15m' });
    this.logger.debug('Token: ', token);

    const domain: string =
      this.appConfigService.domainConfig.client_1.host +
      ':' +
      this.appConfigService.domainConfig.client_1.port +
      '/' +
      this.appConfigService.domainConfig.client_1.reset_password +
      '/' +
      token;
    this.logger.debug('Domain: ', domain);

    const content: string = `
      <p>${AuthNotifyMessages.RESET_PASSWORD} ${AuthNotifyMessages.AT_THE_LINK_BELOW}</p>
      <a href="${domain}" target="_blank">${AuthNotifyMessages.RESET_PASSWORD}</a>
    `;
    this.logger.debug('Html content', content);

    await this.mailService.sendMail(
      email,
      AuthNotifyMessages.RESET_PASSWORD,
      content,
    );
    this.logger.verbose('Email sent');
  }

  async loginWithUser(user: User): Promise<UserLoginResponseDTO> {
    const role: Role = await this.roleService.getRoleById(user.role.id);

    const payload: JwtPayload = {
      sub: user.id,
      username: user.username,
      email: user.email,
      role: role.name,
    };
    this.logger.debug('Get safe user', payload);

    const token: string = this.jwtService.sign(payload);
    this.logger.debug('Token: ', token);

    const userLogin: UserLoginResponseDTO = {
      access_token: token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: role.name,
        status: user.status,
      },
    };

    return userLogin;
  }

  async resetPassword({
    token,
    password,
    retypePassword,
  }: UserResetPasswordDTO): Promise<void> {
    if (password !== retypePassword) {
      this.logger.error(UserMessageLog.PASSWORD_MISMATCH);
      throw new BadRequestException(UserMessageLog.PASSWORD_MISMATCH);
    }

    const decodeInfo: JwtPayload = await this.jwtService.decode(token);
    if (!decodeInfo || !decodeInfo.sub) {
      this.logger.error('Invalid or expired reset token');
      throw new BadRequestException(ErrorMessage.INVALID_RESET_TOKEN);
    }
    const userId: number = decodeInfo.sub;
    this.logger.debug('Get user id:', userId);

    const hashedPassword = await bcrypt.hash(password, this.saltOrRounds);
    this.logger.debug('Hashed password: ', hashedPassword);

    await this.userService.updatePassword(userId, hashedPassword);
  }
}
