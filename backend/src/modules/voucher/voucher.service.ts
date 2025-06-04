import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { asc, eq, like } from 'drizzle-orm';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { Voucher } from 'src/db/helper/schema-type';
import { vouchers } from 'src/db/schema';
import { voucherMapping } from 'src/db/schema/voucher-mapping';
import { VoucherStatus } from 'src/helper/enum/status/vouchers-status.enum';
import { ErrorMessage } from 'src/helper/message/error-message';
import { MessageLog } from 'src/helper/message/message-log';
import {
  VoucherErrorMessage,
  VoucherMessageLog,
} from 'src/helper/message/voucher-error-message';
import { SearchService } from 'src/helper/services/search.service';
import { DrizzleAsyncProvider } from '../database/drizzle.provider';

@Injectable()
export class VoucherService {
  private logger = new Logger(VoucherService.name);
  constructor(
    @Inject(DrizzleAsyncProvider) private db: MySql2Database<any>,
    private searchService: SearchService,
  ) {}
  async getAllVouchers(limit: number, offset: number): Promise<Voucher[]> {
    return await this.searchService.findManyOrReturnEmptyArray(
      this.db,
      vouchers,
      undefined,
      limit,
      offset,
      asc(vouchers.id),
    );
  }

  async getAllVouchersByUserId(
    userId: number,
    limit: number,
    offset: number,
  ): Promise<Voucher[]> {
    const voucherList = await this.db
      .select()
      .from(vouchers)
      .innerJoin(voucherMapping, eq(vouchers.id, voucherMapping.voucherId))
      .where(eq(voucherMapping.userId, userId))
      .limit(limit)
      .offset(offset);

    const result: Voucher[] = voucherList.map((v) => ({
      id: v.vouchers.id,
      voucherCode: v.vouchers.voucherCode,
      status: v.vouchers.status,
      discount: v.vouchers.discount,
      expireAt: v.vouchers.expireAt,
      created_at: v.vouchers.created_at,
      updated_at: v.vouchers.updated_at,
    }));

    return result;
  }

  async findVoucherByCode(
    voucherCode: string,
    limit: number,
    offset: number,
  ): Promise<Voucher[]> {
    return await this.searchService.findManyOrReturnEmptyArray(
      this.db,
      vouchers,
      like(vouchers.voucherCode, `%${voucherCode}%`),
      limit,
      offset,
      asc(vouchers.id),
    );
  }

  async createVouchers(
    voucherCode: string,
    discount: number,
    expireAt: Date,
    status: VoucherStatus = VoucherStatus.ACTIVE,
  ) {
    const [voucher] = await this.db.transaction(async (tx) => {
      return await tx
        .insert(vouchers)
        .values({
          voucherCode,
          status,
          discount,
          expireAt,
          created_at: new Date(),
          updated_at: new Date(),
        })
        .$returningId();
    });

    return await this.getVoucherById(voucher.id);
  }

  async updateVoucherInfo(
    voucherId: number,
    voucherCode: string,
    discount: number,
    expireAt: Date,
    status: VoucherStatus,
  ): Promise<Voucher> {
    const voucher = await this.getVoucherById(voucherId);

    const result = await this.db.transaction(async (tx) => {
      return await tx
        .update(vouchers)
        .set({
          voucherCode,
          status,
          discount,
          expireAt,
          updated_at: new Date(),
        })
        .where(eq(vouchers.id, voucherId));
    });

    if (!result) {
      this.logger.error(VoucherMessageLog.VOUCHER_CANNOT_BE_UPDATED);
      throw new InternalServerErrorException(
        ErrorMessage.INTERNAL_SERVER_ERROR,
      );
    }

    return voucher;
  }

  async deleteVouchers(voucherId: number): Promise<Voucher> {
    const voucher = await this.getVoucherById(voucherId);
    const result = await this.db.transaction(async (tx) => {
      return await tx.delete(vouchers).where(eq(vouchers.id, voucherId));
    });

    if (!result) {
      this.logger.error(MessageLog.VOUCHER_CANNOT_BE_DELETED);
      throw new InternalServerErrorException(
        ErrorMessage.INTERNAL_SERVER_ERROR,
      );
    }

    return voucher;
  }

  async getVoucherById(voucherId: number): Promise<Voucher> {
    return await this.searchService.findOneOrThrow(
      this.db,
      vouchers,
      eq(vouchers.id, voucherId),
      VoucherErrorMessage.VOUCHER_NOT_FOUND,
    );
  }
}
