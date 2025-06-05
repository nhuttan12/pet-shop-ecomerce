import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { Contact } from 'src/db/helper/schema-type';
import { contacts } from 'src/db/schema';
import { ContactStatus } from 'src/helper/enum/status/contact-status.enum copy';
import { ContactMessageLog } from 'src/helper/message/contact-message';
import { ErrorMessage } from 'src/helper/message/error-message';
import { DrizzleAsyncProvider } from 'src/modules/helper/database/drizzle.provider';
import { SearchService } from 'src/modules/helper/services/search.service';

@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);
  constructor(
    @Inject(DrizzleAsyncProvider) private db: MySql2Database<any>,
    private searchService: SearchService,
  ) {}
  async createContactInfo(
    name: string,
    email: string,
    title: string,
    message: string,
  ): Promise<Contact> {
    const [result]: { id: number }[] = await this.db.transaction(async (tx) => {
      return await tx
        .insert(contacts)
        .values({
          name,
          email,
          title,
          message,
          status: ContactStatus.RECEIVED,
          created_at: new Date(),
        })
        .$returningId();
    });

    if (!result) {
      this.logger.error(ContactMessageLog.CAN_NOT_CREATE_CONTACT);
      throw new InternalServerErrorException(
        ErrorMessage.INTERNAL_SERVER_ERROR,
      );
    }

    return await this.searchService.findOneOrThrow(
      this.db,
      contacts,
      eq(contacts.id, result.id),
    );
  }

  async getALlContact(limit: number, offset: number): Promise<Contact[]> {
    offset = offset <= 0 ? 0 : offset - 1;
    return await this.searchService.findManyOrReturnEmptyArray(
      this.db,
      contacts,
      undefined,
      limit,
      offset,
    );
  }
}
