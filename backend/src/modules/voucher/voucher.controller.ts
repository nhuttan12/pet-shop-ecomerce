import {
  Body,
  Controller,
  Delete,
  Get,
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
import { Voucher } from 'src/db/helper/schema-type';
import { HasRole } from 'src/helper/decorator/roles.decorator';
import { GetUser } from 'src/helper/decorator/user.decorator';
import { ApiResponse } from 'src/helper/dto/response/ApiResponse/ApiResponse';
import { DeleteVoucherRequestDto } from 'src/helper/dto/voucher/delete-voucher-request.dto';
import { FindVoucherByCodeRequestDto } from 'src/helper/dto/voucher/find-voucher-by-name-request.dto';
import { GetAllVouchersByUserIdRequestDto } from 'src/helper/dto/voucher/get-all-voucher-by-user-id-request.dto';
import { GetAllVoucherRequestDto } from 'src/helper/dto/voucher/get-all-voucher-request.dto';
import { UpdateVoucherRequestDto } from 'src/helper/dto/voucher/update-voucher-request.dto';
import { VoucherResponseDto } from 'src/helper/dto/voucher/voucher-response.dto';
import { Role } from 'src/helper/enum/role.enum';
import { CatchEverythingFilter } from 'src/helper/filter/exception.filter';
import { JwtAuthGuard } from 'src/helper/guard/jwt-auth.guard';
import { RolesGuard } from 'src/helper/guard/roles.guard';
import { NotifyMessage } from 'src/helper/message/notify-message';
import { CreateVoucherRequestDto } from './../../helper/dto/voucher/create-voucher-request.dto';
import { VoucherService } from './voucher.service';

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
  @ApiOperation({ summary: 'Lấy voucher theo user đang đăng nhập' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiSwaggerResponse({
    status: HttpStatus.OK,
    description: 'Danh sách voucher của user',
    type: [VoucherResponseDto],
  })
  async getAllVouchersByUserId(
    @GetUser() userId: number,
    @Query() { limit, page }: GetAllVouchersByUserIdRequestDto,
  ): Promise<ApiResponse<Voucher[]>> {
    const vouchers = await this.voucherService.getAllVouchersByUserId(
      userId,
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
