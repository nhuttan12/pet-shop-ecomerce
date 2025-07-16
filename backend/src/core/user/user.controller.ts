import { ApiResponse } from '@api-response/ApiResponse';
import { HasRole } from '@decorators/roles.decorator';
import { CatchEverythingFilter } from '@filters/exception.filter';
import { JwtAuthGuard } from '@guards/jwt-auth.guard';
import { RolesGuard } from '@guards/roles.guard';
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
import { PaginationResponse } from '@pagination/pagination-response';
import { RoleName } from '@role/enums/role.enum';
import { UtilityService } from '@services/utility.service';
import { FindUserByNameRequest } from '@user/dto/find-user-list-by-name-request.dto';
import { UserProfileResponseDTO } from '@user/dto/user-profile-response.dto';
import { UserResponseDTO } from '@user/dto/user-reseponse.dto';
import { FindUserListById } from './dto/find-user-list-by-id-request.dto';
import { GetAllUsersResponseDTO } from './dto/get-all-user-response.dto';
import { GetAllUsersDto } from './dto/get-all-user.dto';
import { UserUpdateDTO } from './dto/update-user.dto';
import { User } from './entites/users.entity';
import { UserNotifyMessage } from './messages/user.notify-messages';
import { UserService } from './user.service';
import { GetUser } from '@decorators/user.decorator';
import { JwtPayload } from '../../../dist/src/core/auth/interfaces/jwt-payload.interface';

@ApiTags('User')
@Controller('user')
@ApiBearerAuth('jwt')
@UseFilters(CatchEverythingFilter)
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  private readonly logger = new Logger(UserController.name);
  constructor(
    private readonly utilityService: UtilityService,
    private readonly userService: UserService,
  ) {}

  @Get()
  @HasRole(RoleName.ADMIN)
  @HttpCode(HttpStatus.OK)
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
    this.logger.debug('Info to get all user', page, limit);

    const userList: PaginationResponse<GetAllUsersResponseDTO> =
      await this.userService.findUserForAdmin({}, limit, page);
    this.utilityService.logPretty('Get user list in controller: ', userList);

    return {
      statusCode: HttpStatus.OK,
      message: UserNotifyMessage.GET_USER_SUCCESSFUL,
      data: userList,
    };
  }

  @Get('id/:id')
  @HttpCode(HttpStatus.OK)
  @HasRole(RoleName.ADMIN)
  @ApiOperation({ summary: 'Tìm user theo ID (chỉ ADMIN)' })
  @ApiParam({ name: 'id', type: Number, description: 'User id' })
  @ApiOkResponse({
    type: ApiResponse<User>,
    description: 'User trả về thành công',
  })
  async findUserById(
    @Param() request: FindUserListById,
  ): Promise<ApiResponse<PaginationResponse<UserResponseDTO>>> {
    const user: PaginationResponse<UserResponseDTO> =
      await this.userService.findUserListByID(request);

    this.utilityService.logPretty('Get user list in controller', user);

    return {
      statusCode: HttpStatus.OK,
      message: UserNotifyMessage.GET_USER_SUCCESSFUL,
      data: user,
    };
  }

  @Get('name/:name')
  @HttpCode(HttpStatus.OK)
  @HasRole(RoleName.ADMIN)
  @ApiOperation({ summary: 'Tìm user theo tên (chỉ ADMIN)' })
  @ApiParam({ name: 'name', type: String, description: 'Tên user' })
  @ApiOkResponse({
    type: ApiResponse<User[]>,
    description: 'Danh sách user trả về thành công',
  })
  async findUserByName(
    @Param() request: FindUserByNameRequest,
  ): Promise<ApiResponse<PaginationResponse<UserResponseDTO>>> {
    const userList: PaginationResponse<UserResponseDTO> =
      await this.userService.findUserByName(request);

    this.utilityService.logPretty('Get user list in controller', userList);

    return {
      statusCode: HttpStatus.OK,
      message: UserNotifyMessage.GET_USER_SUCCESSFUL,
      data: userList,
    };
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  @HasRole(RoleName.ADMIN)
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
  ): Promise<ApiResponse<UserProfileResponseDTO>> {
    const newUser: UserProfileResponseDTO =
      await this.userService.updateUser(userQuery);

    this.logger.debug(`Get user list in controller ${JSON.stringify(newUser)}`);

    return {
      statusCode: HttpStatus.OK,
      message: UserNotifyMessage.UPDATE_USER_SUCCESSFUL,
      data: newUser,
    };
  }

  @Get('user-profile')
  @HttpCode(HttpStatus.OK)
  @HasRole(RoleName.ADMIN, RoleName.CUSTOMER)
  @ApiOperation({
    summary: 'Lấy thông tin hồ sơ người dùng',
    description:
      'Truy xuất thông tin hồ sơ của người dùng đã xác thực dựa trên JWT payload.',
  })
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'Lấy thông tin hồ sơ người dùng thành công',
    type: () => ApiResponse<UserProfileResponseDTO>,
    example: {
      statusCode: 200,
      message: UserNotifyMessage.GET_USER_SUCCESSFUL,
      data: {
        id: 1,
        name: 'Nguyễn Văn A',
        email: 'nguyenvana@example.com',
        avatar: 'https://example.com/avatar.jpg',
        phone: '0123456789',
        gender: 'Nam',
        birthDate: '1990-01-01T00:00:00.000Z',
      },
    },
  })
  @ApiOkResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Truy cập không được ủy quyền',
    type: () => ApiResponse<null>,
    example: {
      statusCode: 401,
      message: 'Truy cập không được ủy quyền',
      error: 'Unauthorized',
    },
  })
  @ApiOkResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Người dùng không có vai trò cần thiết (ADMIN hoặc CUSTOMER)',
    type: () => ApiResponse<null>,
    example: {
      statusCode: 403,
      message: 'Không có quyền truy cập',
      error: 'Forbidden',
    },
  })
  async getUserProfile(
    @GetUser() user: JwtPayload,
  ): Promise<ApiResponse<UserProfileResponseDTO>> {
    // 1. Get user profile in controller
    const userProfile: UserProfileResponseDTO =
      await this.userService.getUserProfileByUserID({ userID: user.sub });

    this.utilityService.logPretty(
      'Get user profile in controller',
      userProfile,
    );

    return {
      statusCode: HttpStatus.OK,
      message: UserNotifyMessage.GET_USER_PROFILE_SUCCESSFULLY,
      data: userProfile,
    };
  }
}
