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

import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { Role as RoleName } from 'src/helper/enum/role.enum';
import { StatusType } from 'src/helper/enum/status.enum';
import { RoleService } from 'src/role/role.service';
import { JwtPayload } from '../helper/interface/jwt-payload.interface';

@Injectable()
export class AuthService {
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...safeUser } = user;
    return safeUser;
  }

  async register(
    userRegisterDto: UserRegisterDto,
  ): Promise<UserRegisterResponseDto> {
    const { username, email, password, retypePassword } = userRegisterDto;

    const existingUserWithUsername: User =
      await this.userService.getUserByName(username);

    const existingUserWithEmail: User =
      await this.userService.getUserByEmail(email);

    if (existingUserWithUsername || existingUserWithEmail) {
      throw new UnauthorizedException(ErrorMessage.USERNAME_OR_EMAIL_EXISTS);
    }

    if (password !== retypePassword) {
      throw new UnauthorizedException(ErrorMessage.PASSWORD_MISMATCH);
    }

    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltOrRounds);

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
    const user: User = await this.userService.getUserByUsername(username);
    const isPasswordValid = user
      ? await bcrypt.compare(password, user.password)
      : false;

    if (!isPasswordValid || !user) {
      throw new UnauthorizedException(ErrorMessage.INVALID_PASSWORD);
    }

    const role: Role = await this.roleService.getRoleById(user.roleId);

    const statusRecord: Status = await this.statusService.getStatusById(
      user.statusId,
    );

    if ((statusRecord.name as StatusType) === StatusType.BANNED) {
      throw new UnauthorizedException(ErrorMessage.USER_BANNED);
    }

    if ((statusRecord.name as StatusType) !== StatusType.ACTIVE) {
      throw new UnauthorizedException(ErrorMessage.USER_NOT_ACTIVE);
    }

    const payload: JwtPayload = {
      sub: user.id,
      username: user.username,
      role: role.name,
    };

    const token = this.jwtService.sign(payload);

    const userLogin: UserLoginResponseDto = {
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
  }
}
