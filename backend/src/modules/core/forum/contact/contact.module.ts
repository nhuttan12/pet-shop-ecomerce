import { Module } from '@nestjs/common';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';
import { UtilityModule } from 'src/modules/helper/services/utility.module';

@Module({
  imports: [UtilityModule],
  controllers: [ContactController],
  providers: [ContactService],
})
export class ContactModule {}
