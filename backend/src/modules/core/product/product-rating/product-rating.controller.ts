import { ProductRatingService } from '@core-modules/product/product-rating/product-rating.service';
import { HasRole } from '@decorator/roles.decorator';
import { GetUser } from '@decorator/user.decorator';
import { ToggleRatingProductRequestDTO } from '@dtos/product-rating/toggle-rating-product-request.dto';
import { ApiResponse } from '@dtos/response/ApiResponse/ApiResponse';
import { Role } from '@enum/role.enum';
import { CatchEverythingFilter } from '@filter/exception.filter';
import { JwtAuthGuard } from '@guard/jwt-auth.guard';
import { RolesGuard } from '@guard/roles.guard';
import { JwtPayload } from '@interfaces';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiTags,
  ApiResponse as SwaggerApiResponse,
} from '@nestjs/swagger';

@Controller('product-rating')
@ApiTags('Product Rating')
@ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard, RolesGuard)
@HasRole(Role.ADMIN, Role.USER)
@UseFilters(CatchEverythingFilter)
export class ProductRatingController {
  private readonly logger = new Logger(ProductRatingController.name);

  constructor(private productRatingService: ProductRatingService) {}

  @Post()
  @ApiOperation({ summary: 'Đánh giá hoặc gỡ đánh giá sản phẩm' })
  @SwaggerApiResponse({
    status: 200,
    description: 'Thành công cập nhật trạng thái đánh giá',
  })
  @ApiBody({
    type: ToggleRatingProductRequestDTO,
    description: 'Số sao đánh giá (1-5)',
  })
  @HttpCode(HttpStatus.OK)
  async toggleRating(
    @Body() { productId, starRated }: ToggleRatingProductRequestDTO,
    @GetUser() user: JwtPayload,
  ): Promise<ApiResponse<string>> {
    const ratingNotify: string =
      await this.productRatingService.toggleRatingProduct(
        user.sub,
        productId,
        starRated,
      );
    this.logger.debug(`Toggle rating: ${ratingNotify}`);

    return {
      statusCode: HttpStatus.OK,
      message: ratingNotify,
    };
  }
}
