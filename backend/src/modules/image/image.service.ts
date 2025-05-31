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
import { eq, inArray } from 'drizzle-orm';
import { ErrorMessage } from 'src/helper/message/error-message';
import { MessageLog } from 'src/helper/message/message-log';

@Injectable()
export class ImageService {
  private readonly logger = new Logger(ImageService.name);
  constructor(
    @Inject(DrizzleAsyncProvider)
    private db: MySql2Database<any>,
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

    const [imageInsertedId]: { id: number }[] = await this.db.transaction(
      async (tx) => {
        return await tx.insert(images).values(value).$returningId();
      },
    );

    const newImage: Image = await this.getImageById(imageInsertedId);

    if (!newImage) {
      this.logger.debug(MessageLog.IMAGE_CANNOT_BE_FOUND);
      throw new InternalServerErrorException(
        ErrorMessage.INTERNAL_SERVER_ERROR,
      );
    }

    return newImage;
  }

  async saveImages(imageList: SavedImageDTO[]): Promise<Image[]> {
    try {
      const imagesMappedList: ImageInsert[] = imageList.map((img) => {
        return {
          url: img.url,
          folder: img.folder,
          type: img.type,
          created_at: new Date(),
          updated_at: new Date(),
        };
      });

      const imageInserted = await this.db.transaction((tx) => {
        return tx.insert(images).values(imagesMappedList).$returningId();
      });

      if (!imageInserted) {
        this.logger.error(MessageLog.IMAGE_CANNOT_BE_FOUND);
        throw new InternalServerErrorException(
          ErrorMessage.INTERNAL_SERVER_ERROR,
        );
      }

      const imageIds: number[] = imageInserted.map((img) => img.id);

      const result: Image[] = await this.db
        .select()
        .from(images)
        .where(inArray(images.id, imageIds));

      return result;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async getImageById({ id }: GetImageDTO): Promise<Image> {
    try {
      const [image]: Image[] = await this.db
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
