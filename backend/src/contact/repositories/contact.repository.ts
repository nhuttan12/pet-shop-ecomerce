import { CreateContactRequestDto } from '@contact/dto/create-contact-request.dto';
import { Contact } from '@contact/entites/contacts.schema';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ContactRepository {
  private readonly Logger = new Logger(ContactRepository.name);
  constructor(
    @InjectRepository(Contact)
    private readonly contactRepo: Repository<Contact>,
  ) {}

  async createContactInfo(request: CreateContactRequestDto): Promise<Contact> {
    return await this.contactRepo.save(request);
  }

  async getAllContact(take: number, skip: number): Promise<Contact[]> {
    return await this.contactRepo.find({ take, skip });
  }
}
