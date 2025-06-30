import {
  ApiResponse,
  CatchEverythingFilter,
  HasRole,
  JwtAuthGuard,
  PaginationResponse,
  RolesGuard,
} from '@common';
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
import { RoleName } from '@role';
import {
  FindUserById,
  FindUserByName,
  GetAllUsersDto,
  GetAllUsersResponseDTO,
  User,
  UserNotifyMessage,
  UserService,
  UserUpdateDTO,
} from '@user';

@ApiTags('User')
@Controller('user')
export class UserController {
  private readonly logger = new Logger(UserController.name);
  constructor(private userService: UserService) {}

  @Get()
  @ApiBearerAuth('jwt')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRole(RoleName.ADMIN)
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
  ): Promise<ApiResponse<PaginationResponse<GetAllUsersResponseDTO>>> {
    const { page, limit }: GetAllUsersDto = query;
    this.logger.debug(`Info to get all user ${page} ${limit}`);

    const userList: PaginationResponse<GetAllUsersResponseDTO> =
      await this.userService.findUserForAdmin({}, limit, page);
    this.logger.debug(
      `Get user list in controller ${JSON.stringify(userList)}`,
    );

    return {
      statusCode: HttpStatus.OK,
      message: UserNotifyMessage.GET_USER_SUCCESSFUL,
      data: userList,
    };
  }

  @Get('id/:id')
  @ApiBearerAuth('jwt')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRole(RoleName.ADMIN)
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
      message: UserNotifyMessage.GET_USER_SUCCESSFUL,
      data: user,
    };
  }

  @Get('name/:name')
  @ApiBearerAuth('jwt')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRole(RoleName.ADMIN)
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
      message: UserNotifyMessage.GET_USER_SUCCESSFUL,
      data: userList,
    };
  }

  @Put()
  @ApiBearerAuth('jwt')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRole(RoleName.ADMIN)
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
    const newUser: User = await this.userService.updateUser(userQuery);

    this.logger.debug(`Get user list in controller ${JSON.stringify(newUser)}`);

    return {
      statusCode: HttpStatus.OK,
      message: UserNotifyMessage.UPDATE_USER_SUCCESSFUL,
      data: newUser,
    };
  }
}
