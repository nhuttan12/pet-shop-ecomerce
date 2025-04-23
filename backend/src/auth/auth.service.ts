import { UserLoginDto, UserLoginResponseDto } from './dto/user-login.dto';
import {
  Body,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Role, Status, User, UserInsert } from 'src/db/helper/schema-type';
import { UserService } from 'src/user/user.service';
import {
  UserRegisterDto,
  UserRegisterResponseDto,
} from './dto/user-register.dto';
import { DrizzleAsyncProvider } from 'src/database/drizzle.provider';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { roles, status, users } from 'src/db/schema';
import { eq, or } from 'drizzle-orm';
import { ErrorMessage } from 'src/helper/error-message';
import bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    @Inject(DrizzleAsyncProvider)
    private userSelect: MySql2Database<User>,
    @Inject(DrizzleAsyncProvider)
    private userInsert: MySql2Database<UserInsert>,
    @Inject(DrizzleAsyncProvider)
    private roleSelect: MySql2Database<Role>,
    @Inject(DrizzleAsyncProvider)
    private statusSelect: MySql2Database<Status>,
  ) {}

  async validateUser(id: number): Promise<User> {
    const user = await this.userService.getUserById(id);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const { ...safeUser } = user;
    return safeUser;
  }

  async register(
    userRegisterDto: UserRegisterDto,
  ): Promise<UserRegisterResponseDto> {
    const { username, email, password, retypePassword } = userRegisterDto;
    const [existingUser]: User[] = await this.userSelect
      .select()
      .from(users)
      .where(or(eq(users.username, username), eq(users.email, email)))
      .execute();

    if (existingUser) {
      throw new UnauthorizedException(ErrorMessage.USERNAME_OR_EMAIL_EXISTS);
    }

    if (password !== retypePassword) {
      throw new UnauthorizedException(ErrorMessage.PASSWORD_MISMATCH);
    }

    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltOrRounds);

    const [role]: Role[] = await this.roleSelect
      .select()
      .from(roles)
      .where(eq(roles.name, 'user'))
      .execute();

    const [statusRecord]: Status[] = await this.statusSelect
      .select()
      .from(status)
      .where(eq(status.name, 'active'))
      .execute();

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

    const userCreated: UserRegisterResponseDto = {
      id: userCreatedId.id,
      username: username,
      email: email,
      role: role.name,
      status: statusRecord.name,
    };

    return userCreated;
  }

  async login(userLoginDto: UserLoginDto): Promise<UserLoginResponseDto> {
    const { username, password } = userLoginDto;
    const [user]: User[] = await this.userSelect
      .select()
      .from(users)
      .where(eq(users.username, username))
      .execute();

    if (!user) {
      throw new UnauthorizedException(ErrorMessage.USER_NOT_FOUND);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException(ErrorMessage.INVALID_PASSWORD);
    }

    const [role]: Role[] = await this.roleSelect
      .select()
      .from(roles)
      .where(eq(roles.id, user.roleId))
      .execute();

    const [statusRecord]: Status[] = await this.statusSelect
      .select()
      .from(status)
      .where(eq(status.id, user.statusId))
      .execute();

    const userLogin: UserLoginResponseDto = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: role.name,
      status: statusRecord.name,
    };

    return userLogin;
  }
}
