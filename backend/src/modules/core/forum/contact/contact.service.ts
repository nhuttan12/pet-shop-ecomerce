import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { Contact } from '@schema-type';
import { contacts } from '@schema';
import { ContactStatus } from '@enum/status/contact-status.enum copy';
import { ContactMessageLog } from '@message/contact-message';
import { ErrorMessage } from '@message/error-message';
import { DrizzleAsyncProvider } from '@helper-modules/database/drizzle.provider';
import { SearchService } from '@helper-modules/services/search.service';

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
