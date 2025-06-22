import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { and, eq, inArray } from 'drizzle-orm';
import { DrizzleAsyncProvider } from '@helper-modules/database/drizzle.provider';
import { SavedImageDTO } from '@dtos/image/saved-image.dto';
import { ImageStatus } from '@enum/status/image-status.enum';
import { images } from '@schema';
import { MessageLog } from '@message/message-log';
import { ErrorMessage } from '@message/error-message';
import { GetImageDTO } from '@dtos/image/get-image.dto';
import { Image, ImageInsert } from '@schema-type';

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
      status: ImageStatus.ACTIVE,
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
          status: ImageStatus.ACTIVE,
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
        .where(and(eq(images.id, id), eq(images.status, ImageStatus.ACTIVE)));

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
