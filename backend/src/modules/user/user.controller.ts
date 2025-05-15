import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { User } from 'src/db/helper/schema-type';
import { HasRole } from 'src/helper/decorator/roles.decorator';
import { Role } from 'src/helper/enum/role.enum';
import { CatchEverythingFilter } from 'src/helper/filter/exception.filter';
import { JwtAuthGuard } from 'src/helper/guard/jwt-auth.guard';
import { LocalAuthGuard } from 'src/helper/guard/local-ath.guard';
import { GetAllUsersDto } from '../../helper/dto/user/get-all-user.dto';
import { UserService } from './user.service';
import { FindUserById, FindUserByName } from 'src/helper/dto/user/find-user.dto';
import { UserUpdateDTO } from 'src/helper/dto/user/update-user.dto';

@Controller('v2/users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @UseGuards(JwtAuthGuard)
  @HasRole(Role.ADMIN)
  @UseFilters(CatchEverythingFilter)
  async getAllUsers(
    @Param() params: GetAllUsersDto,
    @Query() query: GetAllUsersDto,
  ) {
    const page: number = params.page ?? query.page ?? 1;
    const limit: number = params.limit ?? query.limit ?? 10;
    return this.userService.getAllUsers(limit, page);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @UseGuards(LocalAuthGuard)
  @HasRole(Role.ADMIN)
  @UseFilters(CatchEverythingFilter)
  async findUserById(
    @Param() idParam: FindUserById,
    @Query() idQuery: FindUserById,
  ): Promise<User[]> {
    const id: number = idParam.id ?? idQuery.id;
    return this.userService.findUserById(id);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @UseGuards(LocalAuthGuard)
  @HasRole(Role.ADMIN)
  @UseFilters(CatchEverythingFilter)
  async findUserByName(
    @Param() nameParam: FindUserByName,
    @Query() nameQuery: FindUserByName,
  ): Promise<User[]> {
    const name: string = nameParam.name ?? nameQuery.name;
    return this.userService.findUserByName(name);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @UseGuards(JwtAuthGuard)
  @HasRole(Role.ADMIN)
  @UseFilters(CatchEverythingFilter)
  async updateUser(
    @Param() userParam: UserUpdateDTO,
    @Query() userQuery: UserUpdateDTO,
  ): Promise<void> {
    const user: UserUpdateDTO = userParam ?? userQuery;
    return this.userService.updateUser(user);
  }
}
