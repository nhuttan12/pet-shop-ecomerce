import { ApiResponse, CatchEverythingFilter, NotifyMessage } from '@common';
import {
  Contact,
  ContactResponseDto,
  ContactService,
  CreateContactRequestDto,
  GetAllContactInfoRequestDto,
} from '@contact';
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
    @Body() request: CreateContactRequestDto,
  ): Promise<ApiResponse<Contact>> {
    const contact = await this.contactService.createContactInfo(request);
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
    @Query() request: GetAllContactInfoRequestDto,
  ): Promise<ApiResponse<Contact[]>> {
    const contact = await this.contactService.getALlContact(request);
    this.logger.debug(`Contact info: ${JSON.stringify(contact)}`);

    return {
      statusCode: HttpStatus.OK,
      message: NotifyMessage.GET_ALL_CONTACT_SUCCESSFUL,
      data: contact,
    };
  }
}
