import { PaginationResponse } from '@pagination/pagination-response';
import { UtilityService } from '@services/utility.service';
import { CreateVoucherRequestDto } from './dto/create-voucher-request.dto';
import { UpdateVoucherRequestDto } from './dto/update-voucher-request.dto';
import { Voucher } from './entities/vouchers.entity';
import { VoucherErrorMessage } from './messages/voucher.error-messages';
import { VoucherMessageLog } from './messages/voucher.messages-log';
import { VoucherRepository } from './repositories/voucher.repository';
import {
  Injectable,
  Logger,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';

@Injectable()
export class VoucherService {
  private logger = new Logger(VoucherService.name);
  constructor(
    private utilityService: UtilityService,
    private voucherRepo: VoucherRepository,
  ) {}
  async getAllVouchers(
    limit: number,
    offset: number,
  ): Promise<PaginationResponse<Voucher>> {
    const { skip, take } = this.utilityService.getPagination(offset, limit);
    return await this.voucherRepo.findVouchers({}, take, skip);
  }

  async getAllVouchersByUserId(
    userId: number,
    limit: number,
    offset: number,
  ): Promise<Voucher[]> {
    const { skip, take } = this.utilityService.getPagination(offset, limit);

    return this.voucherRepo.getVoucherByUserId(userId, take, skip);
  }

  async findVoucherByCode(
    voucherCode: string,
    limit: number,
    offset: number,
  ): Promise<PaginationResponse<Voucher>> {
    const { skip, take } = this.utilityService.getPagination(offset, limit);

    return await this.voucherRepo.findVouchers({ voucherCode }, take, skip);
  }

  async createVouchers(voucherDto: CreateVoucherRequestDto) {
    const existedVoucher: Voucher | null =
      await this.voucherRepo.getVoucherByCode(voucherDto.voucherCode);

    if (existedVoucher) {
      this.logger.log(VoucherMessageLog.VOUCHER_NOT_FOUND);
      throw new ConflictException(
        VoucherErrorMessage.VOUCHER_CODE_ALREADY_EXIST,
      );
    }

    return await this.voucherRepo.insertVoucher(voucherDto);
  }

  async updateVoucherInfo(request: UpdateVoucherRequestDto): Promise<Voucher> {
    const voucher: Voucher | null = await this.voucherRepo.getVoucherById(
      request.voucherId,
    );

    if (!voucher) {
      this.logger.warn(VoucherMessageLog.VOUCHER_NOT_FOUND);
      throw new InternalServerErrorException(
        VoucherErrorMessage.VOUCHER_NOT_FOUND,
      );
    }

    const result: boolean = await this.voucherRepo.updateVoucherInfor(request);

    if (result) {
      this.logger.error(VoucherMessageLog.VOUCHER_CANNOT_BE_UPDATED);
      throw new InternalServerErrorException(
        VoucherErrorMessage.VOUCHER_UPDATED_FAILED,
      );
    }

    const voucherAfterUpdated: Voucher | null =
      await this.voucherRepo.getVoucherById(request.voucherId);

    if (!voucherAfterUpdated) {
      this.logger.warn(VoucherMessageLog.CANNOT_FOUND_VOUCHER_AFTER_UPDATED);
      throw new InternalServerErrorException(
        VoucherErrorMessage.VOUCHER_NOT_FOUND,
      );
    }

    return voucherAfterUpdated;
  }

  async deleteVouchers(voucherId: number): Promise<Voucher> {
    const voucher = await this.voucherRepo.getVoucherById(voucherId);

    if (!voucher) {
      this.logger.warn(VoucherMessageLog.VOUCHER_NOT_FOUND);
      throw new InternalServerErrorException(
        VoucherErrorMessage.VOUCHER_NOT_FOUND,
      );
    }

    const result = await this.voucherRepo.deleteVoucher(voucherId);

    if (!result) {
      this.logger.warn(VoucherMessageLog.VOUCHER_CANNOT_BE_DELETED);
      throw new InternalServerErrorException(
        VoucherErrorMessage.VOUCHER_DELETED_FAILED,
      );
    }

    const voucherAfterUpdated: Voucher | null =
      await this.voucherRepo.getVoucherById(voucherId);

    if (!voucherAfterUpdated) {
      this.logger.warn(VoucherMessageLog.CANNOT_FOUND_VOUCHER_AFTER_UPDATED);
      throw new InternalServerErrorException(
        VoucherErrorMessage.VOUCHER_NOT_FOUND,
      );
    }

    return voucherAfterUpdated;
  }
}
