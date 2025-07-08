import { UtilityModule } from '@services/utility.module';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';
import { Contact } from './entites/contacts.schema';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [UtilityModule, TypeOrmModule.forFeature([Contact])],
  controllers: [ContactController],
  providers: [ContactService],
})
export class ContactModule {}
