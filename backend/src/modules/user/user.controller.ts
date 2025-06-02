import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
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
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/helper/guard/roles.guard';
import { GetAllUsersResponseDTO } from 'src/helper/dto/response/user/get-all-user-response.dto';
import { ApiResponse } from 'src/helper/dto/response/ApiResponse/ApiResponse';
import { NotifyMessage } from 'src/helper/message/notify-message';

@ApiTags('User')
@Controller('v2/users')
export class UserController {
  private readonly logger = new Logger();
  constructor(private userService: UserService) {}

  @Get()
  @ApiBearerAuth('jwt')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRole(Role.ADMIN)
  @UseFilters(CatchEverythingFilter)
  async getAllUsers(
    @Query() query: GetAllUsersDto,
  ): Promise<ApiResponse<GetAllUsersResponseDTO[]>> {
    const { page, limit }: GetAllUsersDto = query;
    this.logger.debug(`Info to get all user ${page} ${limit}`);

    const userList: GetAllUsersResponseDTO[] =
      await this.userService.getAllUsers(limit, page);
    this.logger.debug(
      `Get user list in controller ${JSON.stringify(userList)}`,
    );

    return {
      statusCode: HttpStatus.OK,
      message: NotifyMessage.GET_USER_SUCCESSFUL,
      data: userList,
    };
  }

  @Get(':id')
  @ApiBearerAuth('jwt')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRole(Role.ADMIN)
  @UseFilters(CatchEverythingFilter)
  @ApiParam({ name: 'id', type: Number, description: 'User id' })
  async findUserById(
    @Param() findUser: FindUserById,
  ): Promise<ApiResponse<User>> {
    const id: number = findUser.id;
    const user: User = await this.userService.findUserById(id);
    this.logger.debug(`Get user list in controller ${JSON.stringify(user)}`);

    return {
      statusCode: HttpStatus.OK,
      message: NotifyMessage.GET_USER_SUCCESSFUL,
      data: user,
    };
  }

  @Get(':name')
  @ApiBearerAuth('jwt')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRole(Role.ADMIN)
  @UseFilters(CatchEverythingFilter)
  async findUserByName(
    @Param() nameParam: FindUserByName,
  ): Promise<ApiResponse<User[]>> {
    const name: string = nameParam.name;
    const userList: User[] = await this.userService.findUserByName(name);
    this.logger.debug(
      `Get user list in controller ${JSON.stringify(userList)}`,
    );

    return {
      statusCode: HttpStatus.OK,
      message: NotifyMessage.GET_USER_SUCCESSFUL,
      data: userList,
    };
  }

  @Put()
  @ApiBearerAuth('jwt')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRole(Role.ADMIN)
  @UseFilters(CatchEverythingFilter)
  async updateUser(
    @Query() userQuery: UserUpdateDTO,
  ): Promise<ApiResponse<User>> {
    const user: UserUpdateDTO = userQuery;
    const newUser: User = await this.userService.updateUser(user);

    this.logger.debug(`Get user list in controller ${JSON.stringify(newUser)}`);

    return {
      statusCode: HttpStatus.OK,
      message: NotifyMessage.UPDATE_USER_SUCCESSFUL,
      data: newUser,
    };
  }
}
