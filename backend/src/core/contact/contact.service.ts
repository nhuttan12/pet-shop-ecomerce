import { ErrorMessage } from '@messages/error.messages';
import { UtilityService } from '@services/utility.service';
import { CreateContactRequestDto } from './dto/create-contact-request.dto';
import { GetAllContactInfoRequestDto } from './dto/get-all-contact-info-request.dto';
import { Contact } from './entites/contacts.entity';
import { ContactMessageLog } from './messages/contact.messages-log';
import { ContactRepository } from './repositories/contact.repository';
import {
  Injectable,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';

@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);
  constructor(
    private utilityService: UtilityService,
    private readonly contactRepo: ContactRepository,
  ) {}
  async createContactInfo(request: CreateContactRequestDto): Promise<Contact> {
    const result = await this.contactRepo.createContactInfo(request);

    if (!result) {
      this.logger.error(ContactMessageLog.CAN_NOT_CREATE_CONTACT);
      throw new InternalServerErrorException(
        ErrorMessage.INTERNAL_SERVER_ERROR,
      );
    }

    return result;
  }

  async getALlContact(
    request: GetAllContactInfoRequestDto,
  ): Promise<Contact[]> {
    const { skip, take } = this.utilityService.getPagination(
      request.page,
      request.limit,
    );
    return await this.contactRepo.getAllContact(take, skip);
  }
}
