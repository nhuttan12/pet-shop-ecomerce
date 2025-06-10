import { VoucherService } from '@core-modules/product/voucher/voucher.service';
import { HasRole } from '@decorator/roles.decorator';
import { GetUser } from '@decorator/user.decorator';
import { ApiResponse } from '@dtos/response/ApiResponse/ApiResponse';
import { CreateVoucherRequestDto } from '@dtos/voucher/create-voucher-request.dto';
import { DeleteVoucherRequestDto } from '@dtos/voucher/delete-voucher-request.dto';
import { FindVoucherByCodeRequestDto } from '@dtos/voucher/find-voucher-by-name-request.dto';
import { GetAllVouchersByUserIdRequestDto } from '@dtos/voucher/get-all-voucher-by-user-id-request.dto';
import { GetAllVoucherRequestDto } from '@dtos/voucher/get-all-voucher-request.dto';
import { UpdateVoucherRequestDto } from '@dtos/voucher/update-voucher-request.dto';
import { VoucherResponseDto } from '@dtos/voucher/voucher-response.dto';
import { Role } from '@enum/role.enum';
import { CatchEverythingFilter } from '@filter/exception.filter';
import { JwtAuthGuard } from '@guard/jwt-auth.guard';
import { RolesGuard } from '@guard/roles.guard';
import { JwtPayload } from '@interfaces';
import { NotifyMessage } from '@message/notify-message';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  Put,
  Query,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse as ApiSwaggerResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Voucher } from '@schema-type';

@Controller('voucher')
@ApiTags('Voucher')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseFilters(CatchEverythingFilter)
@ApiBearerAuth('jwt')
export class VoucherController {
  private readonly logger = new Logger(VoucherController.name);
  constructor(private voucherService: VoucherService) {}

  @Get()
  @HasRole(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Lấy danh sách tất cả voucher (admin)' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiSwaggerResponse({
    status: HttpStatus.OK,
    description: 'Danh sách voucher',
    type: [VoucherResponseDto],
  })
  async getAllVouchers(
    @Query() { limit, page }: GetAllVoucherRequestDto,
  ): Promise<ApiResponse<Voucher[]>> {
    const vouchers = await this.voucherService.getAllVouchers(limit, page);
    this.logger.debug(`Vouchers: ${JSON.stringify(vouchers)}`);

    return {
      message: NotifyMessage.GET_VOUCHER_SUCCESSFUL,
      statusCode: HttpStatus.OK,
      data: vouchers,
    };
  }

  @Get('/user')
  @HasRole(Role.USER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Lấy voucher theo user đang đăng nhập' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiSwaggerResponse({
    status: HttpStatus.OK,
    description: 'Danh sách voucher của user',
    type: [VoucherResponseDto],
  })
  async getAllVouchersByUserId(
    @GetUser() userId: JwtPayload,
    @Query() { limit, page }: GetAllVouchersByUserIdRequestDto,
  ): Promise<ApiResponse<Voucher[]>> {
    const vouchers = await this.voucherService.getAllVouchersByUserId(
      userId.sub,
      limit,
      page,
    );
    return {
      message: NotifyMessage.GET_VOUCHER_SUCCESSFUL,
      statusCode: HttpStatus.OK,
      data: vouchers,
    };
  }

  @Get('/search')
  @HasRole(Role.ADMIN)
  @HasRole(Role.USER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Tìm kiếm voucher theo mã code' })
  @ApiQuery({ name: 'voucherCode', required: true, type: String })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiSwaggerResponse({
    status: HttpStatus.OK,
    description: 'Danh sách voucher tìm kiếm được',
    type: [VoucherResponseDto],
  })
  async findVoucherByCode(
    @Query() { limit, page, voucherCode }: FindVoucherByCodeRequestDto,
  ): Promise<ApiResponse<Voucher[]>> {
    const vouchers = await this.voucherService.findVoucherByCode(
      voucherCode,
      limit,
      page,
    );
    this.logger.debug(`Vouchers: ${JSON.stringify(vouchers)}`);

    return {
      message: NotifyMessage.GET_VOUCHER_SUCCESSFUL,
      statusCode: HttpStatus.OK,
      data: vouchers,
    };
  }

  @Post()
  @HasRole(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Tạo mới voucher' })
  @ApiBody({ type: CreateVoucherRequestDto })
  @ApiSwaggerResponse({
    status: HttpStatus.CREATED,
    description: 'Voucher đã được tạo thành công',
    type: VoucherResponseDto,
  })
  async createVoucher(
    @Body()
    { discount, expireAt, status, voucherCode }: CreateVoucherRequestDto,
  ): Promise<ApiResponse<Voucher>> {
    const voucher = await this.voucherService.createVouchers(
      voucherCode,
      discount,
      expireAt,
      status,
    );
    this.logger.debug(`Voucher: ${JSON.stringify(voucher)}`);

    return {
      message: NotifyMessage.CREATE_VOUCHER_SUCCESSFUL,
      statusCode: HttpStatus.CREATED,
      data: voucher,
    };
  }

  @Put('/:id')
  @HasRole(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cập nhật voucher theo id' })
  @ApiBody({ type: UpdateVoucherRequestDto })
  @ApiSwaggerResponse({
    status: HttpStatus.OK,
    description: 'Voucher đã được cập nhật',
    type: VoucherResponseDto,
  })
  async updateVoucher(
    @Body()
    {
      discount,
      expireAt,
      status,
      voucherCode,
      voucherId,
    }: UpdateVoucherRequestDto,
  ): Promise<ApiResponse<Voucher>> {
    const voucher = await this.voucherService.updateVoucherInfo(
      voucherId,
      voucherCode,
      discount,
      new Date(expireAt),
      status,
    );
    this.logger.debug(`Voucher: ${JSON.stringify(voucher)}`);

    return {
      message: NotifyMessage.UPDATE_VOUCHER_SUCCESSFUL,
      statusCode: HttpStatus.OK,
      data: voucher,
    };
  }

  @Delete('/:id')
  @HasRole(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Xoá voucher theo id' })
  @ApiBody({ type: DeleteVoucherRequestDto })
  @ApiSwaggerResponse({
    status: HttpStatus.OK,
    description: 'Voucher đã được xoá',
    type: VoucherResponseDto,
  })
  async deleteVoucher(
    @Body() { voucherId }: DeleteVoucherRequestDto,
  ): Promise<ApiResponse<Voucher>> {
    const voucher = await this.voucherService.deleteVouchers(voucherId);
    this.logger.debug(`Voucher: ${JSON.stringify(voucher)}`);

    return {
      message: NotifyMessage.DELETE_VOUCHER_SUCCESSFUL,
      statusCode: HttpStatus.OK,
      data: voucher,
    };
  }
}
