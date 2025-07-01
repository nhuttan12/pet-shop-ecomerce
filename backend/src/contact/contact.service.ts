import { ErrorMessage, UtilityService } from '@common';
import {
  Contact,
  ContactMessageLog,
  ContactRepository,
  CreateContactRequestDto,
  GetAllContactInfoRequestDto,
} from '@contact';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
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
