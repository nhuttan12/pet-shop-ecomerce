import { DrizzleAsyncProvider } from 'src/database/drizzle.provider';
import { Role, Status, User, UserInsert } from 'src/db/helper/schema-type';
import { users } from 'src/db/schema';
import { ErrorMessage } from 'src/helper/message/error-message';
import { UserService } from 'src/user/user.service';
import { StatusService } from './../status/status.service';
import { UserLoginDto, UserLoginResponseDto } from './dto/user-login.dto';
import {
  UserRegisterDto,
  UserRegisterResponseDto,
} from './dto/user-register.dto';

import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { Role as RoleName } from 'src/helper/enum/role.enum';
import { StatusType } from 'src/helper/enum/status.enum';
import { RoleService } from 'src/role/role.service';
import { JwtPayload } from '../helper/interface/jwt-payload.interface';
import { MessageLog } from 'src/helper/message/message-log';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private userService: UserService,
    @Inject(DrizzleAsyncProvider)
    private userInsert: MySql2Database<UserInsert>,
    private jwtService: JwtService,
    private roleService: RoleService,
    private statusService: StatusService,
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

  async register(
    userRegisterDto: UserRegisterDto,
  ): Promise<UserRegisterResponseDto> {
    let userCreated: UserRegisterResponseDto | undefined;
    try {
      const { username, email, password, retypePassword } = userRegisterDto;

      const existingUserWithUsername: User | undefined =
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

      const statusRecord: Status = await this.statusService.getStatusByName(
        StatusType.ACTIVE,
      );

      const [userCreatedId]: { id: number }[] = await this.userInsert
        .insert(users)
        .values({
          username: username,
          email: email,
          password: hashedPassword,
          roleId: role.id,
          statusId: statusRecord.id,
          created_at: new Date(),
          updated_at: new Date(),
        })
        .$returningId();

      userCreated = {
        id: userCreatedId.id,
        username: username,
        email: email,
        role: role.name,
        status: statusRecord.name,
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

      const statusRecord: Status = await this.statusService.getStatusById(
        user.statusId,
      );

      if ((statusRecord.name as StatusType) === StatusType.BANNED) {
        this.logger.log(MessageLog.USER_BANNED, user.id);
        throw new UnauthorizedException(ErrorMessage.USER_BANNED);
      }

      if ((statusRecord.name as StatusType) !== StatusType.ACTIVE) {
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
          status: statusRecord.name,
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
}
