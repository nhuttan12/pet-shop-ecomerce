import { Role, User } from 'src/db/helper/schema-type';
import { ErrorMessage } from 'src/helper/message/error-message';
import { UserService } from 'src/modules/user/user.service';
import {
  UserLoginDto,
  UserLoginResponseDto,
} from '../../helper/dto/user/user-login.dto';
import {
  UserRegisterDto,
  UserRegisterResponseDto,
} from '../../helper/dto/user/user-register.dto';

import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { UserForgotPasswordDTO } from 'src/helper/dto/user/user-forgot-password.dto';
import { UserResetPasswordDTO } from 'src/helper/dto/user/user-reset-password.dto';
import { Role as RoleName } from 'src/helper/enum/role.enum';
import { UserStatus } from 'src/helper/enum/user-status.enum';
import { MessageLog } from 'src/helper/message/message-log';
import { NotifyMessage } from 'src/helper/message/notify-message';
import { JwtPayload } from '../../helper/interface/jwt-payload.interface';
import { AppConfigService } from '../config/app-config.service';
import { MailService } from '../mail/mail.service';
import { RoleService } from '../role/role.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private roleService: RoleService,
    private mailService: MailService,
    private appConfigService: AppConfigService,
  ) {}

  async validateUser(
    id: number,
    username: string,
  ): Promise<Omit<User, 'password'>> {
    const user: User = await this.userService.getUserByIdAndUsername(
      id,
      username,
    );
    this.logger.debug('Get user info', user);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...safeUser } = user;
    this.logger.debug('Get safe user', safeUser);
    return safeUser;
  }

  /**
   * @description register user
   * @param userRegisterDto: the params is validated of user for register
   * @returns UserRegisterResponseDto
   */
  async register(
    userRegisterDto: UserRegisterDto,
  ): Promise<UserRegisterResponseDto> {
    let userCreated: UserRegisterResponseDto | undefined;
    try {
      const { username, email, password, retypePassword } = userRegisterDto;

      const [existingUserWithUsername]: User[] =
        await this.userService.findUserByName(username);
      this.logger.debug(
        'Get existing user with username',
        existingUserWithUsername,
      );

      const existingUserWithEmail: User | undefined =
        await this.userService.findUserByEmail(email);
      this.logger.debug('Get existing user with email', existingUserWithEmail);

      if (existingUserWithUsername || existingUserWithEmail) {
        this.logger.warn(MessageLog.USERNAME_OR_EMAIL_EXISTS);
        throw new UnauthorizedException(ErrorMessage.USERNAME_OR_EMAIL_EXISTS);
      }

      if (password !== retypePassword) {
        this.logger.warn(MessageLog.PASSWORD_MISMATCH);
        throw new UnauthorizedException(ErrorMessage.PASSWORD_MISMATCH);
      }

      const saltOrRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltOrRounds);
      this.logger.debug('Get hashed password', hashedPassword);

      const role = await this.roleService.getRoleByName(RoleName.USER);

      const userCreatedId: number = await this.userService.createUser({
        username,
        email,
        hashedPassword,
        roleId: role.id,
        status: UserStatus.ACTIVE,
      });

      await this.mailService.sendMail(
        email,
        NotifyMessage.REGISTER_SUCCESSFUL,
        NotifyMessage.YOUR_ACCOUNT_WITH_USERNAME +
          ' ' +
          username +
          ' ' +
          NotifyMessage.REGISTER_SUCCESSFUL,
      );

      userCreated = {
        id: userCreatedId,
        username: username,
        email: email,
        role: role.name,
        status: UserStatus.ACTIVE,
      };

      return userCreated;
    } catch (error) {
      this.logger.error('Error during registration', error);
      throw new InternalServerErrorException(
        ErrorMessage.INTERNAL_SERVER_ERROR,
      );
    } finally {
      if (userCreated) {
        this.logger.log(MessageLog.USER_CREATED_SUCCESS, userCreated.id);
      } else {
        this.logger.warn(MessageLog.NO_USER_CREATED);
      }
    }
  }

  async login(userLoginDto: UserLoginDto): Promise<UserLoginResponseDto> {
    let userLogin: UserLoginResponseDto | undefined;
    try {
      const { username, password } = userLoginDto;
      const user: User = await this.userService.getUserByUsername(username);
      const isPasswordValid = user
        ? await bcrypt.compare(password, user.password)
        : false;

      if (!isPasswordValid || !user) {
        this.logger.warn(MessageLog.INVALID_PASSWORD);
        throw new UnauthorizedException(ErrorMessage.INVALID_PASSWORD);
      }

      const role: Role = await this.roleService.getRoleById(user.roleId);

      if (user.status === UserStatus.BANNED) {
        this.logger.log(MessageLog.USER_BANNED, user.id);
        throw new UnauthorizedException(ErrorMessage.USER_BANNED);
      }

      if (user.status !== UserStatus.ACTIVE) {
        this.logger.log(MessageLog.USER_NOT_ACTIVE, user.id);
        throw new UnauthorizedException(ErrorMessage.USER_NOT_ACTIVE);
      }

      const payload: JwtPayload = {
        sub: user.id,
        username: user.username,
        role: role.name,
      };

      const token = this.jwtService.sign(payload);

      userLogin = {
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
    } catch (error) {
      this.logger.error('Error during login', error);
      throw new UnauthorizedException(ErrorMessage.INTERNAL_SERVER_ERROR);
    } finally {
      if (userLogin) {
        this.logger.log(MessageLog.USER_LOGIN_SUCCESS, userLogin.user.id);
      } else {
        this.logger.warn(MessageLog.USER_LOGIN_FAILED);
      }
    }
  }

  async forgotPassword({ email }: UserForgotPasswordDTO): Promise<void> {
    const existingUser: User = await this.userService.getUserByEmail(email);

    const role: Role = await this.roleService.getRoleById(existingUser.roleId);

    const payload: JwtPayload = {
      sub: existingUser.id,
      username: existingUser.username,
      role: role.name,
    };

    const token = this.jwtService.sign(payload, { expiresIn: '15m' });

    const domain: string =
      this.appConfigService.domainConfig.client_1.host +
      ':' +
      this.appConfigService.domainConfig.client_1.port +
      '/' +
      this.appConfigService.domainConfig.client_1.reset_password +
      '/' +
      token;

    const content: string =
      NotifyMessage.RESET_PASSWORD +
      ' ' +
      NotifyMessage.AT_THE_LINK_BELOW +
      domain;

    await this.mailService.sendMail(
      email,
      NotifyMessage.RESET_PASSWORD,
      content,
    );
  }

  async resetPassword({
    token,
    password,
    retypePassword,
  }: UserResetPasswordDTO): Promise<void> {
    const decodeInfo: JwtPayload = await this.jwtService.decode(token);

    if (password != retypePassword) {
      throw new BadRequestException(ErrorMessage.PASSWORD_MISMATCH);
    }

    const userId: number = decodeInfo.sub;

    await this.userService.updatePassword(userId, password);
  }
}
