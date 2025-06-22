import { UserService } from '@core-modules/user/user.service';
import { HasRole } from '@decorator/roles.decorator';
import { ApiResponse } from '@dtos/response/ApiResponse/ApiResponse';
import { GetAllUsersResponseDTO } from '@dtos/response/user/get-all-user-response.dto';
import { FindUserById, FindUserByName } from '@dtos/user/find-user.dto';
import { GetAllUsersDto } from '@dtos/user/get-all-user.dto';
import { UserUpdateDTO } from '@dtos/user/update-user.dto';
import { Role } from '@enum/role.enum';
import { CatchEverythingFilter } from '@filter/exception.filter';
import { JwtAuthGuard } from '@guard/jwt-auth.guard';
import { RolesGuard } from '@guard/roles.guard';
import { NotifyMessage } from '@message/notify-message';
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
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { User } from '@schema-type';

@ApiTags('User')
@Controller('user')
export class UserController {
  private readonly logger = new Logger(UserController.name);
  constructor(private userService: UserService) {}

  @Get()
  @ApiBearerAuth('jwt')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRole(Role.ADMIN)
  @UseFilters(CatchEverythingFilter)
  @ApiOperation({
    summary: 'Lấy danh sách tất cả user (phân trang, chỉ ADMIN)',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Trang số',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Số lượng mỗi trang',
  })
  @ApiOkResponse({
    type: ApiResponse<GetAllUsersResponseDTO[]>,
    description: 'Danh sách user trả về thành công',
  })
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

  @Get('id/:id')
  @ApiBearerAuth('jwt')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRole(Role.ADMIN)
  @UseFilters(CatchEverythingFilter)
  @ApiOperation({ summary: 'Tìm user theo ID (chỉ ADMIN)' })
  @ApiParam({ name: 'id', type: Number, description: 'User id' })
  @ApiOkResponse({
    type: ApiResponse<User>,
    description: 'User trả về thành công',
  })
  async findUserById(
    @Param() findUser: FindUserById,
  ): Promise<ApiResponse<User>> {
    const id: number = findUser.id;
    const user: User = await this.userService.getUserById(id);
    this.logger.debug(`Get user list in controller ${JSON.stringify(user)}`);

    return {
      statusCode: HttpStatus.OK,
      message: NotifyMessage.GET_USER_SUCCESSFUL,
      data: user,
    };
  }

  @Get('name/:name')
  @ApiBearerAuth('jwt')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRole(Role.ADMIN)
  @UseFilters(CatchEverythingFilter)
  @ApiOperation({ summary: 'Tìm user theo tên (chỉ ADMIN)' })
  @ApiParam({ name: 'name', type: String, description: 'Tên user' })
  @ApiOkResponse({
    type: ApiResponse<User[]>,
    description: 'Danh sách user trả về thành công',
  })
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
  @ApiOperation({ summary: 'Cập nhật thông tin user (chỉ ADMIN)' })
  @ApiQuery({ name: 'id', type: Number, description: 'User id' })
  @ApiQuery({
    name: 'name',
    type: String,
    required: false,
    description: 'Tên user',
  })
  @ApiQuery({
    name: 'email',
    type: String,
    required: false,
    description: 'Email user',
  })
  @ApiOkResponse({
    type: ApiResponse<User>,
    description: 'Cập nhật user thành công',
  })
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
