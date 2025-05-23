import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Put,
  Query,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { User } from 'src/db/helper/schema-type';
import { HasRole } from 'src/helper/decorator/roles.decorator';
import {
  FindUserById,
  FindUserByName,
} from 'src/helper/dto/user/find-user.dto';
import { UserUpdateDTO } from 'src/helper/dto/user/update-user.dto';
import { Role } from 'src/helper/enum/role.enum';
import { CatchEverythingFilter } from 'src/helper/filter/exception.filter';
import { JwtAuthGuard } from 'src/helper/guard/jwt-auth.guard';
import { GetAllUsersDto } from '../../helper/dto/user/get-all-user.dto';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { RolesGuard } from 'src/helper/guard/roles.guard';
import { GetAllUsersResponseDTO } from 'src/helper/dto/user/get-all-user-response.dto';

@Controller('v2/users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @ApiBearerAuth('jwt')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRole(Role.ADMIN)
  @UseFilters(CatchEverythingFilter)
  async getAllUsers(
    @Query() query: GetAllUsersDto,
  ): Promise<GetAllUsersResponseDTO[]> {
    const { page, limit }: GetAllUsersDto = query;
    return this.userService.getAllUsers(limit, page);
  }

  @Get(':id')
  @ApiBearerAuth('jwt')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRole(Role.ADMIN)
  @UseFilters(CatchEverythingFilter)
  @ApiParam({ name: 'id', type: Number, description: 'User id' })
  async findUserById(@Param() findUser: FindUserById): Promise<User[]> {
    const id: number = findUser.id;
    return this.userService.findUserById(id);
  }

  @Get(':name')
  @ApiBearerAuth('jwt')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRole(Role.ADMIN)
  @UseFilters(CatchEverythingFilter)
  async findUserByName(@Param() nameParam: FindUserByName): Promise<User[]> {
    const name: string = nameParam.name;
    return this.userService.findUserByName(name);
  }

  @Put()
  @ApiBearerAuth('jwt')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRole(Role.ADMIN)
  @UseFilters(CatchEverythingFilter)
  async updateUser(@Query() userQuery: UserUpdateDTO): Promise<void> {
    const user: UserUpdateDTO = userQuery;
    return this.userService.updateUser(user);
  }
}
