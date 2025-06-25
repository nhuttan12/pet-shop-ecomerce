import { Image, SavedImageDTO } from '@common';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ImageStatus } from 'common/image/enums';
import { ImageMessageLog } from 'common/image/messages/image.error-messages';
import { ImageRepository } from 'common/image/repositories/image.repository';
import { ErrorMessage, MessageLog } from 'common/messages';
import { DataSource, InsertResult } from 'typeorm';

@Injectable()
export class ImageService {
  private readonly logger = new Logger(ImageService.name);
  constructor(
    private readonly dataSource: DataSource,
    private imageRepo: ImageRepository,
  ) {}

  async saveImage(image: SavedImageDTO): Promise<Image> {
    this.logger.verbose('Save image');

    const value: Partial<Image> = {
      url: image.url,
      folder: image.folder,
      type: image.type,
      status: ImageStatus.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.logger.debug(`Image value: ${JSON.stringify(value)}`);

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Insert ảnh mới
      const insertResult: InsertResult = await queryRunner.manager
        .createQueryBuilder()
        .insert()
        .into(Image)
        .values(value)
        .execute();

      const insertImagedId: number = insertResult.identifiers[0].id as number;

      const newImage: Image | null =
        await this.imageRepo.getById(insertImagedId);

      if (!newImage || newImage === null) {
        this.logger.debug(MessageLog.IMAGE_CANNOT_BE_FOUND);
        throw new InternalServerErrorException(
          ErrorMessage.INTERNAL_SERVER_ERROR,
        );
      }

      await queryRunner.commitTransaction();

      return newImage;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error('Failed to save image', (error as Error).stack);
      throw new InternalServerErrorException('Internal server error');
    } finally {
      await queryRunner.release();
    }
  }

  async saveImages(imageList: SavedImageDTO[]): Promise<Image[]> {
    const imagesToInsert = imageList.map((img) => {
      return {
        url: img.url,
        folder: img.folder,
        type: img.type,
        status: ImageStatus.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Partial<Image>;
    });

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const result = await this.dataSource.manager
        .createQueryBuilder()
        .insert()
        .into(Image)
        .values(imagesToInsert)
        .execute();

      const raw = result.raw as { insertId: number; affectedRows: number };

      if (!raw || !raw.insertId) {
        this.logger.error(ImageMessageLog.IMAGE_NOT_FOUND);
        throw new InternalServerErrorException(
          ErrorMessage.INTERNAL_SERVER_ERROR,
        );
      }

      const firstId = raw.insertId;
      const count = imagesToInsert.length;
      const imageIds: number[] = Array.from(
        { length: count },
        (_, i) => firstId + i,
      );

      const images = await this.imageRepo.findManyById(imageIds);

      await queryRunner.commitTransaction();

      return images;
    } catch (error) {
      await queryRunner.rollbackTransaction();

      this.logger.error((error as Error).stack);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
