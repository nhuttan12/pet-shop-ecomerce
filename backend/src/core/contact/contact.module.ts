import { UtilityModule } from '@services/utility.module';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';
import { Contact } from './entites/contacts.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactRepository } from '@contact/repositories/contact.repository';

@Module({
  imports: [UtilityModule, TypeOrmModule.forFeature([Contact])],
  controllers: [ContactController],
  providers: [ContactService, ContactRepository],
})
export class ContactModule {}
