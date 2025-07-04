import {
  ErrorMessage,
  Image,
  ImageErrorMessage,
  ImageMessageLog,
  ImageStatus,
  ImageType,
  MessageLog,
  SavedImageDTO,
  SubjectType,
} from '@common';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DataSource,
  EntityManager,
  In,
  InsertResult,
  Repository,
  UpdateResult,
} from 'typeorm';

@Injectable()
export class ImageRepository {
  private readonly logger = new Logger(ImageRepository.name);
  constructor(
    @InjectRepository(Image)
    private readonly imageRepo: Repository<Image>,
    private readonly dataSource: DataSource,
  ) {}

  private async getByID(id: number): Promise<Image | null> {
    return await this.imageRepo.findOneBy({ id });
  }

  async getImageBySubjectIdAndSubjectType(
    subjectID: number,
    subjectType: SubjectType,
    imageType?: ImageType,
  ): Promise<Image | null> {
    const image: Image | null = await this.imageRepo.findOneBy({
      subjectID,
      subjectType,
      status: ImageStatus.ACTIVE,
      type: imageType,
    });

    return image;
  }

  async findManyById(ids: number[]): Promise<Image[]> {
    return await this.imageRepo.find({ where: { id: In(ids) } });
  }

  async updateImageForSubsject(
    manager: EntityManager,
    subjectId: number,
    subjectType: string,
    newImageUrl: string,
    imageType: ImageType,
    folder?: string,
  ): Promise<Image> {
    // 1. Remove old image
    await manager.update(
      Image,
      { subjectId, subjectType, status: ImageStatus.ACTIVE },
      { status: ImageStatus.REMOVED },
    );

    // 2. Insert new image
    const imageInserted = manager.create(Image, {
      url: newImageUrl,
      folder,
      type: imageType,
      status: ImageStatus.ACTIVE,
      subjectId,
      subjectType,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await manager.save(imageInserted);

    if (!imageInserted) {
      this.logger.error(ImageMessageLog.IMAGE_NOT_FOUND);
      throw new InternalServerErrorException(
        ImageErrorMessage.IMAGE_NOT_FOUND_AFTER_CREATED,
      );
    }

    return imageInserted;
  }

  async saveImages(
    imageList: SavedImageDTO[],
    subjectID: number,
    subjectType: SubjectType,
  ): Promise<Image[]> {
    const imagesToInsert = imageList.map((img) => {
      return {
        url: img.url,
        folder: img.folder,
        type: img.type,
        subjectID,
        subjectType: subjectType,
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

      const images = await this.findManyById(imageIds);

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

  async saveImage(
    image: SavedImageDTO,
    subjectID: number,
    subjectType: SubjectType,
  ): Promise<Image> {
    this.logger.verbose('Save image');

    const value: Partial<Image> = {
      url: image.url,
      folder: image.folder,
      type: image.type,
      status: ImageStatus.ACTIVE,
      subjectID,
      subjectType: subjectType as string,
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

      const newImage: Image | null = await this.getByID(insertImagedId);

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

  async getImageListBySubjectIdAndSubjectType(
    subjectID: number,
    subjectType: SubjectType,
    imageType?: ImageType,
  ): Promise<Image[]> {
    return await this.imageRepo.find({
      where: {
        subjectID,
        subjectType,
        status: ImageStatus.ACTIVE,
        type: imageType,
      },
    });
  }

  async removeImage(imageID: number): Promise<boolean> {
    return await this.dataSource.transaction(async (manager) => {
      const update: UpdateResult = await manager.update(
        Image,
        {
          id: imageID,
          status: ImageStatus.ACTIVE,
        },
        {
          status: ImageStatus.REMOVED,
          updatedAt: new Date(),
        },
      );

      if (update.affected === 0) {
        this.logger.error(ImageMessageLog.CANNOT_UPDATE_IMAGE);
        throw new InternalServerErrorException(
          ImageErrorMessage.CANNOT_UPDATE_IMAGE,
        );
      }

      return true;
    });
  }
}
