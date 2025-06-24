import { Role, User } from '@schema-type';
import { ErrorMessage } from '@message/error-message';

import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { UserForgotPasswordDTO } from '@dtos/user/user-forgot-password.dto';
import { UserLoginResponseDTO } from '@dtos/user/user-login.dto';
import { UserResetPasswordDTO } from '@dtos/user/user-reset-password.dto';
import { Role as RoleName } from '@enum/role.enum';
import { UserStatus } from '@enum/status/user-status.enum';
import { MessageLog } from '@message/message-log';
import { NotifyMessage } from '@message/notify-message';
import { RoleService } from '@core-modules/role/role.service';
import { UserService } from '@core-modules/user/user.service';
import { MailService } from '@helper-modules//mail/mail.service';
import { AppConfigService } from '@helper-modules/config/app-config.service';
import { JwtPayload } from '@interfaces';
import {
  UserRegisterDTO,
  UserRegisterResponseDTO,
} from '@dtos/user/user-register.dto';

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

  /**
   * Used to get user from payload, validate every a request is sent to server
   * @param id: id of user
   * @param username: username of user
   * @returns JwtPayload: {sub: number; username: string; role: string; email?: string;}
   */
  async getUserFromPayload(id: number, username: string): Promise<JwtPayload> {
    const user: User = await this.userService.getUserByIdAndUsername(
      id,
      username,
    );
    this.logger.debug(`Get user info ${JSON.stringify(user)}`);

    if (!user) {
      this.logger.error(MessageLog.INVALID_LOGIN_INFO);
      throw new UnauthorizedException(ErrorMessage.INVALID_LOGIN_INFO);
    }

    const role: Role = await this.roleService.getRoleById(user.roleId);

    const safeUser: JwtPayload = {
      sub: user.id,
      username: user.username,
      email: user.email,
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
    this.logger.debug(`Get user info ${JSON.stringify(user)}`);

    if (!user) {
      this.logger.error(MessageLog.INVALID_LOGIN_INFO);
      throw new UnauthorizedException(ErrorMessage.INVALID_LOGIN_INFO);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      this.logger.error(MessageLog.INVALID_LOGIN_INFO);
      throw new UnauthorizedException(ErrorMessage.INVALID_LOGIN_INFO);
    }

    if (user.status === UserStatus.BANNED) {
      this.logger.log(MessageLog.USER_BANNED, user.id);
      throw new UnauthorizedException(ErrorMessage.USER_BANNED);
    }

    if (user.status !== UserStatus.ACTIVE) {
      this.logger.log(MessageLog.USER_NOT_ACTIVE, user.id);
      throw new UnauthorizedException(ErrorMessage.USER_NOT_ACTIVE);
    }

    return user;
  }

  /**
   * @description register user
   * @param UserRegisterDTO: the params is validated of user for register
   * @returns UserRegisterResponseDTO
   */
  async register({
    username,
    email,
    password,
    retypePassword,
  }: UserRegisterDTO): Promise<UserRegisterResponseDTO> {
    let userCreated: UserRegisterResponseDTO | undefined;
    try {
      // Check password and retype password match
      if (password !== retypePassword) {
        this.logger.warn(MessageLog.PASSWORD_MISMATCH);
        throw new UnauthorizedException(ErrorMessage.PASSWORD_MISMATCH);
      }

      // Gind user by user name
      const [existingUserWithUsername]: User[] =
        await this.userService.findUserByUsername(username);
      this.logger.debug(
        'Get existing user with username',
        existingUserWithUsername,
      );

      // Find user with email
      const existingUserWithEmail: User | undefined =
        await this.userService.findUserByEmail(email);
      this.logger.debug('Get existing user with email', existingUserWithEmail);

      if (existingUserWithUsername || existingUserWithEmail) {
        this.logger.warn(MessageLog.USERNAME_OR_EMAIL_EXISTS);
        throw new UnauthorizedException(ErrorMessage.USERNAME_OR_EMAIL_EXISTS);
      }

      const hashedPassword = await bcrypt.hash(password, this.saltOrRounds);
      this.logger.debug(`Get hashed password ${hashedPassword}`);

      const role = await this.roleService.getRoleByName(RoleName.USER);

      const userCreated: User = await this.userService.createUser({
        username,
        email,
        hashedPassword,
        roleId: role.id,
        status: UserStatus.ACTIVE,
      });

      // Send mail when create user success
      if (userCreated) {
        await this.mailService.sendMail(
          email,
          NotifyMessage.REGISTER_SUCCESSFUL,
          NotifyMessage.YOUR_ACCOUNT_WITH_USERNAME + ' ' + username,
        );
      }

      return {
        id: userCreated.id,
        username: username,
        email: email,
        role: role.name,
        status: UserStatus.ACTIVE,
      };
    } catch (error) {
      this.logger.error('Error during registration', error);
      throw error;
    } finally {
      if (userCreated) {
        this.logger.log(MessageLog.USER_CREATED_SUCCESS, userCreated.id);
      } else {
        this.logger.warn(MessageLog.NO_USER_CREATED);
      }
    }
  }

  async forgotPassword({ email }: UserForgotPasswordDTO): Promise<void> {
    const existingUser: User = await this.userService.getUserByEmail(email);
    this.logger.debug(`Get user ${JSON.stringify(existingUser)}`);

    const role: Role = await this.roleService.getRoleById(existingUser.roleId);
    this.logger.debug(`Get role ${JSON.stringify(role)}`);

    const payload: JwtPayload = {
      sub: existingUser.id,
      username: existingUser.username,
      role: role.name,
    };
    this.logger.debug(`Payload ${JSON.stringify(payload)}`);

    const token: string = this.jwtService.sign(payload, { expiresIn: '15m' });
    this.logger.debug(`Token ${token}`);

    const domain: string =
      this.appConfigService.domainConfig.client_1.host +
      ':' +
      this.appConfigService.domainConfig.client_1.port +
      '/' +
      this.appConfigService.domainConfig.client_1.reset_password +
      '/' +
      token;
    this.logger.debug(`Domain ${domain}`);

    const content: string = `
      <p>${NotifyMessage.RESET_PASSWORD} ${NotifyMessage.AT_THE_LINK_BELOW}</p>
      <a href="${domain}" target="_blank">${NotifyMessage.RESET_PASSWORD}</a>
    `;
    this.logger.debug(`Html content ${content}`);

    await this.mailService.sendMail(
      email,
      NotifyMessage.RESET_PASSWORD,
      content,
    );
    this.logger.verbose('Email sent');
  }

  async loginWithUser(user: User): Promise<UserLoginResponseDTO> {
    const role: Role = await this.roleService.getRoleById(user.roleId);

    const payload: JwtPayload = {
      sub: user.id,
      username: user.username,
      email: user.email,
      role: role.name,
    };
    this.logger.debug('Get safe user', payload);

    const token: string = this.jwtService.sign(payload);
    this.logger.debug(`Token: ${token}`);

    const userLogin: UserLoginResponseDTO = {
      access_token: token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: role.name,
        status: user.status!,
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
      this.logger.error(MessageLog.PASSWORD_MISMATCH);
      throw new BadRequestException(ErrorMessage.PASSWORD_MISMATCH);
    }

    const decodeInfo: JwtPayload = await this.jwtService.decode(token);
    if (!decodeInfo || !decodeInfo.sub) {
      this.logger.error('Invalid or expired reset token');
      throw new BadRequestException(ErrorMessage.INVALID_RESET_TOKEN);
    }
    const userId: number = decodeInfo.sub;
    this.logger.debug(`Get user id ${userId}`);

    const hashedPassword = await bcrypt.hash(password, this.saltOrRounds);
    this.logger.debug(`Hashed password ${hashedPassword}`);

    await this.userService.updatePassword(userId, hashedPassword);
  }
}
