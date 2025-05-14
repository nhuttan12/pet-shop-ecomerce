import {
  Controller,
  Get,
  Param,
  Query,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { SignUrlDTO } from '../../helper/dto/cloudinary.dto';
import { HasRole } from 'src/helper/decorator/roles.decorator';
import { Role } from 'src/helper/enum/role.enum';
import { JwtAuthGuard } from 'src/helper/guard/jwt-auth.guard';
import { LocalAuthGuard } from 'src/helper/guard/local-ath.guard';
import { CatchEverythingFilter } from 'src/helper/filter/exception.filter';

@Controller('cloudinary')
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Get('signed-url')
  @UseGuards(JwtAuthGuard)
  @UseGuards(LocalAuthGuard)
  @HasRole(Role.ADMIN)
  @HasRole(Role.USER)
  @UseFilters(CatchEverythingFilter)
  getSignedUrl(
    @Query() signUrlQuery: SignUrlDTO,
    @Param() signUrlParam: SignUrlDTO,
  ) {
    const publicId: string = signUrlParam.publicId ?? signUrlQuery.publicId;
    const folder: string = signUrlParam.folder ?? signUrlQuery.folder;
    return this.cloudinaryService.getSignedUrl(publicId, folder);
  }
}
