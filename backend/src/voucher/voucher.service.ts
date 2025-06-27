import { UtilityService } from '@common';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import {
  CreateVoucherRequestDto,
  UpdateVoucherRequestDto,
  Voucher,
  VoucherErrorMessage,
  VoucherMessageLog,
  VoucherRepository,
} from '@voucher';

@Injectable()
export class VoucherService {
  private logger = new Logger(VoucherService.name);
  constructor(
    private utilityService: UtilityService,
    private voucherRepo: VoucherRepository,
  ) {}
  async getAllVouchers(limit: number, offset: number): Promise<Voucher[]> {
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
  ): Promise<Voucher[]> {
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
