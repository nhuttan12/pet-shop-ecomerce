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
import { AuthErrorMessages } from '@auth/messages/auth.error-messages';
import { AuthNotifyMessages } from '@auth/messages/auth.notify-messages';
import bcrypt from 'bcrypt';
import { JwtPayload } from '@auth/interfaces/jwt-payload.interface';
import { UtilityService } from '@services/utility.service';
import { ImageService } from '@images/image.service';
import { Image } from '@images/entites/images.entity';
import { ImageType } from '@images/enums/image-type.enum';
import { SubjectType } from '@images/enums/subject-type.enum';
import { SentMessageInfo } from 'nodemailer';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly saltOrRounds = 10;
  constructor(
    private readonly imageService: ImageService,
    private readonly utilityService: UtilityService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly roleService: RoleService,
    private readonly mailService: MailService,
    private readonly appConfigService: AppConfigService,
  ) {}

  async getUserFromPayload(id: number): Promise<JwtPayload> {
    // 1. Find user by user ID
    const userWithId: User = await this.userService.getUserById(id);
    this.utilityService.logPretty('User found with user ID: ', userWithId);

    // 2. Check user is exist
    if (!userWithId) {
      this.logger.warn(AuthMessageLog.USER_EXIST);
      throw new UnauthorizedException(AuthErrorMessages.USER_ALREADY_EXISTS);
    }

    // 3. Get role by id
    const role: Role = await this.roleService.getRoleById(userWithId.role.id);
    this.utilityService.logPretty('Get role by id:', role);

    // 4. Get safe user
    const safeUser: JwtPayload = {
      sub: userWithId.id,
      email: userWithId.email,
      role: role.name,
    };
    this.utilityService.logPretty('Get safe user:', safeUser);

    // 5. Return safe user
    return safeUser;
  }

  /**
   * Use for validate when login
   * @param username: username of user
   * @param password: password of user
   * @returns User
   */
  async validateUser(username: string, password: string): Promise<User> {
    // 1. Get user by user name
    const user: User = await this.userService.getUserByUsername(username);
    this.utilityService.logPretty('Get user by user name:', user);

    // 2. Check user is exist
    if (!user) {
      this.logger.warn(AuthMessageLog.INVALID_LOGIN_INFO);
      throw new UnauthorizedException(AuthErrorMessages.INFOR_UNVALID);
    }

    // 3. Check password match in database by bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);
    this.utilityService.logPretty(
      'Check password match in database by bcrypt:',
      user,
    );

    if (!isPasswordValid) {
      this.logger.warn(AuthMessageLog.INVALID_LOGIN_INFO);
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
    this.utilityService.logPretty('Request:', request);

    try {
      // 2. Check password and retype password match
      if (request.password !== request.retypePassword) {
        this.logger.warn(AuthMessageLog.PASSWORD_MISMATCH);
        throw new UnauthorizedException(AuthErrorMessages.PASSWORD_MISMATCH);
      }

      // 3. Find user by user name
      const [existingUserWithUsername]: User[] =
        await this.userService.findUserByUsername(request.username);
      this.utilityService.logPretty(
        'Get existing user with username:',
        existingUserWithUsername,
      );

      // 4. Find user with email
      const existingUserWithEmail: User | null =
        await this.userService.getUserByEmail(request.email);
      this.utilityService.logPretty(
        'Get existing user with email:',
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
      this.utilityService.logPretty('Create hash password:', hashedPassword);

      // 7. Get role by role name
      const role: Role = await this.roleService.getRoleByName(
        RoleName.CUSTOMER,
      );
      this.utilityService.logPretty('Get role by role name:', role);

      // 8. Create user
      const userCreated: User = await this.userService.createUser({
        username: request.username,
        email: request.email,
        hashedPassword,
        roleId: role.id,
        status: UserStatus.ACTIVE,
      });
      this.utilityService.logPretty('Create user:', userCreated);

      // 9. Check if user is created
      if (userCreated) {
        // 10. Create deffault user image
        const userImage: Image = await this.imageService.saveImage(
          {
            type: ImageType.AVATAR,
            url: 'https://res.cloudinary.com/dt3yrf9sx/image/upload/v1747916657/pngegg_1_elsdfw.png',
            folder: 'tmdt-ck',
          },
          userCreated.id,
          SubjectType.USER,
        );
        this.utilityService.logPretty('Create deffault user image', userImage);

        // 11. Send mail
        const messageInfo: SentMessageInfo = await this.mailService.sendMail(
          request.email,
          AuthNotifyMessages.REGISTER_SUCCESSFUL,
          AuthNotifyMessages.YOUR_ACCOUNT_WITH_USERNAME +
            ' ' +
            request.username,
        );
        this.utilityService.logPretty('Mail sent', messageInfo);
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
    // 1. Get user by email
    const existingUser: User | null =
      await this.userService.getUserByEmail(email);
    this.utilityService.logPretty('Get user by email:', existingUser);

    // 2. Check user exist
    if (!existingUser) {
      this.logger.warn(UserMessageLog.USER_NOT_FOUND);
      throw new UnauthorizedException(UserErrorMessage.USER_NOT_FOUND);
    }

    // 3. Get role by role id
    const role: Role = await this.roleService.getRoleById(existingUser.role.id);
    this.utilityService.logPretty('Get role by role id:', role);

    // 4. Create payload
    const payload: JwtPayload = {
      sub: existingUser.id,
      role: role.name,
    };
    this.utilityService.logPretty('Create payload:', payload);

    // 5. Generate token
    const token: string = this.jwtService.sign(payload, { expiresIn: '15m' });
    this.utilityService.logPretty('Generate token:', token);

    // 6. Generate domain
    const domain: string =
      this.appConfigService.domainConfig.client_1.host +
      ':' +
      this.appConfigService.domainConfig.client_1.port +
      '/' +
      this.appConfigService.domainConfig.client_1.reset_password +
      '/' +
      token;
    this.utilityService.logPretty('Generate domain:', domain);

    const content: string = `
      <p>${AuthNotifyMessages.RESET_PASSWORD} ${AuthNotifyMessages.AT_THE_LINK_BELOW}</p>
      <a href="${domain}" target="_blank">${AuthNotifyMessages.RESET_PASSWORD}</a>
    `;
    this.logger.debug('Html content', content);
    this.utilityService.logPretty('Html content:', content);

    await this.mailService.sendMail(
      email,
      AuthNotifyMessages.RESET_PASSWORD,
      content,
    );
    this.logger.verbose('Email sent');
  }

  async loginWithUser(user: User): Promise<UserLoginResponseDTO> {
    // 1. Get role by id
    const role: Role = await this.roleService.getRoleById(user.role.id);
    this.utilityService.logPretty('Get role by id:', role);

    // 2. Generate payload
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: role.name,
    };
    this.utilityService.logPretty('Generate payload:', payload);

    // 3. Generate token
    const token: string = this.jwtService.sign(payload);
    this.utilityService.logPretty('Generate token:', token);

    // 4. Generate user for login response
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
    this.utilityService.logPretty(
      'Generate user for login response:',
      userLogin,
    );

    return userLogin;
  }

  async resetPassword({
    token,
    password,
    retypePassword,
  }: UserResetPasswordDTO): Promise<void> {
    // 1. Check password and retype password match
    if (password !== retypePassword) {
      this.logger.warn(UserMessageLog.PASSWORD_MISMATCH);
      throw new BadRequestException(UserMessageLog.PASSWORD_MISMATCH);
    }

    // 2. Decode token
    const decodeInfo: JwtPayload = await this.jwtService.decode(token);

    // 3. Check token is valid
    if (!decodeInfo || !decodeInfo.sub) {
      this.logger.warn('Invalid or expired reset token');
      throw new BadRequestException(ErrorMessage.INVALID_RESET_TOKEN);
    }

    // 4. Get user id from token
    const userId: number = decodeInfo.sub;
    this.utilityService.logPretty('Get user id from token:', userId);

    // 5. Create hash password
    const hashedPassword = await bcrypt.hash(password, this.saltOrRounds);
    this.utilityService.logPretty('Create hash password:', hashedPassword);

    // 6. Update password
    await this.userService.updatePassword(userId, hashedPassword);
  }
}
