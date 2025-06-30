import { JwtPayload } from '@auth';
import {
  ApiResponse,
  CatchEverythingFilter,
  GetUser,
  HasRole,
  JwtAuthGuard,
  NotifyMessage,
  PaginationResponse,
  RolesGuard,
} from '@common';
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
import { RoleName } from '@role';
import {
  CreateVoucherRequestDto,
  DeleteVoucherRequestDto,
  FindVoucherByCodeRequestDto,
  GetAllVoucherRequestDto,
  GetAllVouchersByUserIdRequestDto,
  UpdateVoucherRequestDto,
  Voucher,
  VoucherResponseDto,
  VoucherService,
} from '@voucher';

@Controller('voucher')
@ApiTags('Voucher')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseFilters(CatchEverythingFilter)
@ApiBearerAuth('jwt')
export class VoucherController {
  private readonly logger = new Logger(VoucherController.name);
  constructor(private voucherService: VoucherService) {}

  @Get()
  @HasRole(RoleName.ADMIN)
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
  ): Promise<ApiResponse<PaginationResponse<Voucher>>> {
    const vouchers = await this.voucherService.getAllVouchers(limit, page);
    this.logger.debug(`Vouchers: ${JSON.stringify(vouchers)}`);

    return {
      message: NotifyMessage.GET_VOUCHER_SUCCESSFUL,
      statusCode: HttpStatus.OK,
      data: vouchers,
    };
  }

  @Get('/user')
  @HasRole(RoleName.USER)
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
  @HasRole(RoleName.ADMIN)
  @HasRole(RoleName.USER)
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
  ): Promise<ApiResponse<PaginationResponse<Voucher>>> {
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
  @HasRole(RoleName.ADMIN)
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
    request: CreateVoucherRequestDto,
  ): Promise<ApiResponse<Voucher>> {
    const voucher = await this.voucherService.createVouchers(request);
    this.logger.debug(`Voucher: ${JSON.stringify(voucher)}`);

    return {
      message: NotifyMessage.CREATE_VOUCHER_SUCCESSFUL,
      statusCode: HttpStatus.CREATED,
      data: voucher,
    };
  }

  @Put('/:id')
  @HasRole(RoleName.ADMIN)
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
    request: UpdateVoucherRequestDto,
  ): Promise<ApiResponse<Voucher>> {
    const voucher = await this.voucherService.updateVoucherInfo(request);
    this.logger.debug(`Voucher: ${JSON.stringify(voucher)}`);

    return {
      message: NotifyMessage.UPDATE_VOUCHER_SUCCESSFUL,
      statusCode: HttpStatus.OK,
      data: voucher,
    };
  }

  @Delete('/:id')
  @HasRole(RoleName.ADMIN)
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
