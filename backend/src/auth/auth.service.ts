import { AuthMessageLog, JwtPayload } from '@auth';
import { AppConfigService, ErrorMessage, MailService } from '@common';
import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role, RoleName, RoleService } from '@role';
import {
  User,
  UserErrorMessage,
  UserForgotPasswordDTO,
  UserLoginResponseDTO,
  UserMessageLog,
  UserRegisterDTO,
  UserRegisterResponseDTO,
  UserResetPasswordDTO,
  UserService,
  UserStatus,
} from '@user';
import { AuthErrorMessages } from 'auth/messages/auth.error-messages';
import { AuthNotifyMessages } from 'auth/messages/auth.notify-messages';
import bcrypt from 'bcrypt';

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
    this.logger.debug(`Get user info ${JSON.stringify(user)}`);

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
        this.logger.warn(AuthMessageLog.PASSWORD_MISMATCH);
        throw new UnauthorizedException(AuthErrorMessages.PASSWORD_MISMATCH);
      }

      // Gind user by user name
      const [existingUserWithUsername]: User[] =
        await this.userService.findUserByUsername(username);
      this.logger.debug(
        `Get existing user with username ${JSON.stringify(existingUserWithUsername)}}`,
      );

      // Find user with email
      const existingUserWithEmail: User | null =
        await this.userService.getUserByEmail(email);
      this.logger.debug(
        `Get existing user with email: ${JSON.stringify(existingUserWithEmail)}`,
      );

      if (existingUserWithUsername || existingUserWithEmail) {
        this.logger.warn(UserMessageLog.USERNAME_OR_EMAIL_EXISTS);
        throw new UnauthorizedException(
          AuthErrorMessages.USERNAME_OR_EMAIL_EXISTS,
        );
      }

      const hashedPassword = await bcrypt.hash(password, this.saltOrRounds);
      this.logger.debug(`Get hashed password ${hashedPassword}`);

      const role = await this.roleService.getRoleByName(RoleName.CUSTOMER);

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
          AuthNotifyMessages.REGISTER_SUCCESSFUL,
          AuthNotifyMessages.YOUR_ACCOUNT_WITH_USERNAME + ' ' + username,
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
        this.logger.log(UserMessageLog.USER_CREATED_SUCCESS, userCreated.id);
      } else {
        this.logger.warn(UserMessageLog.NO_USER_CREATED);
      }
    }
  }

  async forgotPassword({ email }: UserForgotPasswordDTO): Promise<void> {
    const existingUser: User | null =
      await this.userService.getUserByEmail(email);
    this.logger.debug(`Get user ${JSON.stringify(existingUser)}`);

    if (!existingUser) {
      this.logger.warn(UserMessageLog.USER_NOT_FOUND);
      throw new UnauthorizedException(UserErrorMessage.USER_NOT_FOUND);
    }

    const role: Role = await this.roleService.getRoleById(existingUser.role.id);
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
      <p>${AuthNotifyMessages.RESET_PASSWORD} ${AuthNotifyMessages.AT_THE_LINK_BELOW}</p>
      <a href="${domain}" target="_blank">${AuthNotifyMessages.RESET_PASSWORD}</a>
    `;
    this.logger.debug(`Html content ${content}`);

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
    this.logger.debug(`Token: ${token}`);

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
    this.logger.debug(`Get user id ${userId}`);

    const hashedPassword = await bcrypt.hash(password, this.saltOrRounds);
    this.logger.debug(`Hashed password ${hashedPassword}`);

    await this.userService.updatePassword(userId, hashedPassword);
  }
}
