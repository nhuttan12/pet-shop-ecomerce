import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { Image, ImageInsert } from 'src/db/helper/schema-type';
import { SavedImageDTO } from 'src/helper/dto/image/saved-image.dto';
import { DrizzleAsyncProvider } from '../database/drizzle.provider';
import { images } from 'src/db/schema';
import { GetImageDTO } from 'src/helper/dto/image/get-image.dto';
import { eq } from 'drizzle-orm';
import { ErrorMessage } from 'src/helper/message/error-message';
import { MessageLog } from 'src/helper/message/message-log';

@Injectable()
export class ImageService {
  private readonly logger = new Logger(ImageService.name);
  constructor(
    @Inject(DrizzleAsyncProvider)
    private imageInsert: MySql2Database<ImageInsert>,
    @Inject(DrizzleAsyncProvider)
    private imageSelect: MySql2Database<Image>,
  ) {}

  async saveImage(image: SavedImageDTO): Promise<Image> {
    this.logger.verbose('Save image');

    const value: ImageInsert = {
      url: image.url,
      folder: image.folder,
      type: image.type,
      created_at: new Date(),
      updated_at: new Date(),
    };
    this.logger.debug(`Image value: ${JSON.stringify(value)}`);

    const [imageInsertedId]: { id: number }[] =
      await this.imageInsert.transaction(async (tx) => {
        return await tx.insert(images).values(value).$returningId();
      });

    const newImage: Image = await this.getImageById(imageInsertedId);

    if (!newImage) {
      this.logger.debug(MessageLog.IMAGE_CANNOT_BE_FOUND);
      throw new InternalServerErrorException(
        ErrorMessage.INTERNAL_SERVER_ERROR,
      );
    }

    return newImage;
  }

  async getImageById({ id }: GetImageDTO): Promise<Image> {
    try {
      const [image]: Image[] = await this.imageSelect
        .select()
        .from(images)
        .where(eq(images.id, id));

      if (!image) {
        this.logger.verbose(`Image with ${id} not found`);
        throw new NotFoundException(ErrorMessage.IMAGE_NOT_FOUND);
      }

      return image;
    } catch (error) {
      this.logger.error(`Error: ${error}`);
      throw error;
    } finally {
      this.logger.verbose(`Image with ${id} found`);
    }
  }
}
