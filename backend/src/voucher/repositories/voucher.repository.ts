import { ErrorMessage } from '@messages/error.messages';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { buildPaginationMeta } from '@pagination/build-pagination-meta';
import { PaginationResponse } from '@pagination/pagination-response';
import { CreateVoucherRequestDto } from '@voucher/dto/create-voucher-request.dto';
import { UpdateVoucherRequestDto } from '@voucher/dto/update-voucher-request.dto';
import { Voucher } from '@voucher/entities/vouchers.entity';
import { VoucherStatus } from '@voucher/enums/vouchers-status.enum';
import { VoucherErrorMessage } from '@voucher/messages/voucher.error-messages';
import { VoucherMessageLog } from '@voucher/messages/voucher.messages-log';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class VoucherRepository {
  private readonly logger = new Logger(VoucherRepository.name);
  constructor(
    @InjectRepository(Voucher)
    private readonly voucherRepo: Repository<Voucher>,
    private readonly dataSource: DataSource,
  ) {}

  async findVouchers(
    filters: Partial<{
      voucherCode?: string;
      discount?: number;
      fromDate?: Date;
      toDate?: Date;
      status?: VoucherStatus;
    }>,
    take: number = 10,
    skip: number = 0,
    sortField: keyof Voucher = 'id',
    sortOrder: 'ASC' | 'DESC' = 'ASC',
  ): Promise<PaginationResponse<Voucher>> {
    const qb = this.voucherRepo.createQueryBuilder('voucher');

    if (filters.voucherCode) {
      qb.andWhere('voucher.voucher_code LIKE :voucherCode', {
        voucherCode: `%${filters.voucherCode}%`,
      });
    }

    if (filters.discount !== undefined) {
      qb.andWhere('voucher.discount = :discount', {
        discount: filters.discount,
      });
    }

    if (filters.status) {
      qb.andWhere('voucher.status = :status', { status: filters.status });
    }

    if (filters.fromDate) {
      qb.andWhere('voucher.expire_at >= :fromDate', {
        fromDate: filters.fromDate,
      });
    }

    if (filters.toDate) {
      qb.andWhere('voucher.expire_at <= :toDate', { toDate: filters.toDate });
    }

    // Sắp xếp
    qb.orderBy(`user.${sortField}`, sortOrder);

    const totalItems = await qb.getCount();

    // Phân trang
    if (take !== undefined) {
      qb.take(take);
    }
    if (skip !== undefined) {
      qb.skip(skip);
    }

    const data = await qb.getMany();

    const meta = buildPaginationMeta(
      totalItems,
      Math.floor(take / skip) + 1,
      take,
    );

    return {
      data,
      meta,
    };
  }

  async getVoucherByUserId(
    userId: number,
    limit: number,
    offset: number,
  ): Promise<Voucher[]> {
    return this.dataSource
      .getRepository(Voucher)
      .createQueryBuilder('voucher')
      .leftJoinAndSelect('voucher.voucherMapping', 'voucherMapping')
      .leftJoinAndSelect('voucherMapping.user', 'user')
      .where('user.id = :userId', { userId })
      .take(limit)
      .skip(offset)
      .getMany();
  }

  async insertVoucher(voucherDto: CreateVoucherRequestDto): Promise<Voucher> {
    return await this.dataSource.transaction(async (manager) => {
      const voucher: Voucher = manager.create(Voucher, {
        voucherCode: voucherDto.voucherCode,
        discount: voucherDto.discount,
        expireAt: voucherDto.expireAt,
        status: voucherDto.status,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const savedVoucher: Voucher = await manager.save(voucher);

      if (!savedVoucher?.id) {
        this.logger.warn(VoucherMessageLog.VOUCHER_CREATED_FAILED);
        throw new InternalServerErrorException(
          ErrorMessage.INTERNAL_SERVER_ERROR,
        );
      }

      return savedVoucher;
    });
  }

  async getVoucherById(voucherId: number): Promise<Voucher | null> {
    return await this.voucherRepo.findOneBy({ id: voucherId });
  }

  async updateVoucherInfor(request: UpdateVoucherRequestDto): Promise<boolean> {
    return await this.dataSource.transaction(async (manager) => {
      const result = await manager.update(Voucher, request.voucherId, {
        voucherCode: request.voucherCode,
        discount: request.discount,
        expireAt: request.expireAt,
        status: request.status,
        updatedAt: new Date(),
      });

      if (result.affected === 0) {
        this.logger.warn(VoucherMessageLog.VOUCHER_CANNOT_BE_UPDATED);
        throw new InternalServerErrorException(
          VoucherErrorMessage.VOUCHER_UPDATED_FAILED,
        );
      }

      return true;
    });
  }

  async deleteVoucher(voucherId: number): Promise<boolean> {
    return await this.dataSource.transaction(async (manager) => {
      const result = await manager.update(Voucher, voucherId, {
        status: VoucherStatus.REMOVE,
        updatedAt: new Date(),
      });

      if (result.affected === 0) {
        this.logger.error(VoucherMessageLog.VOUCHER_CANNOT_BE_DELETED);
        throw new InternalServerErrorException(
          VoucherErrorMessage.VOUCHER_DELETED_FAILED,
        );
      }

      return true;
    });
  }

  // Use for pre-check before create new voucher
  async getVoucherByCode(voucherCode: string): Promise<Voucher | null> {
    return await this.voucherRepo.findOneBy({
      voucherCode,
    });
  }
}
