import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Logger,
  Post,
  Query,
  UseFilters,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiTags,
  ApiResponse as ApiSwaggerResponse,
} from '@nestjs/swagger';
import { Contact } from 'src/db/helper/schema-type';
import { CreateContactRequestDto } from 'src/helper/dto/contact/create-contact-request.dto';
import { ApiResponse } from 'src/helper/dto/response/ApiResponse/ApiResponse';
import { CatchEverythingFilter } from 'src/helper/filter/exception.filter';
import { NotifyMessage } from 'src/helper/message/notify-message';
import { ContactService } from './contact.service';
import { ContactResponseDto } from 'src/helper/dto/contact/contact-response.dto';
import { GetAllContactInfoRequestDto } from 'src/helper/dto/contact/get-all-contact-info-request.dto';

@Controller('contact')
@ApiTags('Contact')
@UseFilters(CatchEverythingFilter)
export class ContactController {
  private readonly logger = new Logger(ContactController.name);
  constructor(private contactService: ContactService) {}

  @Post('/create')
  @ApiOperation({ summary: 'Tạo mới thông tin liên hệ' })
  @ApiBody({ type: CreateContactRequestDto })
  @ApiSwaggerResponse({
    status: HttpStatus.OK,
    description: 'Tạo liên hệ thành công',
    type: ContactResponseDto,
  })
  @ApiSwaggerResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Dữ liệu gửi lên không hợp lệ',
  })
  @ApiSwaggerResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Lỗi hệ thống',
  })
  async createContactInfo(
    @Body() { name, email, title, message }: CreateContactRequestDto,
  ): Promise<ApiResponse<Contact>> {
    const contact = await this.contactService.createContactInfo(
      name,
      email,
      title,
      message,
    );
    this.logger.debug(`Contact info: ${JSON.stringify(contact)}`);

    return {
      statusCode: HttpStatus.OK,
      message: NotifyMessage.CREATE_CONTACT_SUCCESSFUL,
      data: contact,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Lấy toàn bộ thông tin liên hệ' })
  @ApiSwaggerResponse({
    status: HttpStatus.OK,
    description: 'Lấy thông tin liên hệ thành công',
    type: ContactResponseDto,
  })
  @ApiSwaggerResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Dữ liệu gửi lên không hợp lệ',
  })
  @ApiSwaggerResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Lỗi hệ thống',
  })
  async getAllContact(
    @Query() { limit, page }: GetAllContactInfoRequestDto,
  ): Promise<ApiResponse<Contact[]>> {
    const contact = await this.contactService.getALlContact(limit, page);
    this.logger.debug(`Contact info: ${JSON.stringify(contact)}`);

    return {
      statusCode: HttpStatus.OK,
      message: NotifyMessage.GET_ALL_CONTACT_SUCCESSFUL,
      data: contact,
    };
  }
}
