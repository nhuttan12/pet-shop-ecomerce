import { SavedImageDTO } from '@images/dto/saved-image.dto';
import { Image } from '@images/entites/images.entity';
import { ImageType } from '@images/enums/image-type.enum';
import { SubjectType } from '@images/enums/subject-type.enum';
import { ImageErrorMessage } from '@images/messages/image.error-messages';
import { ImageMessageLog } from '@images/messages/image.messages-log';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ImageRepository } from 'common/image/repositories/image.repository';
import { DataSource, EntityManager } from 'typeorm';

@Injectable()
export class ImageService {
  private readonly logger = new Logger(ImageService.name);
  constructor(
    private readonly dataSource: DataSource,
    private imageRepo: ImageRepository,
  ) {}

  async saveImage(
    image: SavedImageDTO,
    subjectId: number,
    subjectType: SubjectType,
  ): Promise<Image> {
    return await this.imageRepo.saveImage(image, subjectId, subjectType);
  }

  async saveImages(
    imageList: SavedImageDTO[],
    subjectID: number,
    subjectType: SubjectType,
  ): Promise<Image[]> {
    return await this.imageRepo.saveImages(imageList, subjectID, subjectType);
  }

  async getImageBySubjectIdAndSubjectType(
    subjectID: number,
    subjectType: SubjectType,
    imageType?: ImageType,
  ): Promise<Image> {
    const image: Image | null =
      await this.imageRepo.getImageBySubjectIdAndSubjectType(
        subjectID,
        subjectType,
        imageType,
      );

    if (!image) {
      this.logger.error(ImageMessageLog.IMAGE_NOT_FOUND);
      throw new NotFoundException(ImageErrorMessage.IMAGE_NOT_FOUND);
    }

    return image;
  }

  async findManyById(ids: number[]): Promise<Image[]> {
    return await this.imageRepo.findManyById(ids);
  }

  async updateImageForSubsject(
    dataSource: EntityManager,
    subjectId: number,
    subjectType: string,
    newImageUrl: string,
    imageType: ImageType,
    folder?: string,
  ): Promise<Image> {
    return await this.imageRepo.updateImageForSubsject(
      dataSource,
      subjectId,
      subjectType,
      newImageUrl,
      imageType,
      folder,
    );
  }

  async getImageListBySubjectIdAndSubjectType(
    subjectID: number,
    subjectType: SubjectType,
    imageType?: ImageType,
  ): Promise<Image[]> {
    return await this.imageRepo.getImageListBySubjectIdAndSubjectType(
      subjectID,
      subjectType,
      imageType,
    );
  }

  async removeImage(imageID: number): Promise<boolean> {
    // 1. Remove image
    const result: boolean = await this.imageRepo.removeImage(imageID);

    // 2. Check image removing result
    if (!result) {
      this.logger.warn(ImageMessageLog.CANNOT_UPDATE_IMAGE);
      throw new NotFoundException(ImageErrorMessage.CANNOT_UPDATE_IMAGE);
    }

    // 3. Return result
    return result;
  }

  async updateImage(
    imageID: number,
    image: SavedImageDTO,
    subjectID: number,
    subjectType: SubjectType,
  ): Promise<Image> {
    // 1. Soft delete image
    const removeImage: boolean = await this.removeImage(imageID);

    // 2. Check image soft delte result
    if (!removeImage) {
      this.logger.warn(ImageMessageLog.CANNOT_UPDATE_IMAGE);
      throw new NotFoundException(ImageErrorMessage.CANNOT_UPDATE_IMAGE);
    }

    // 3. Save new image
    const newImage: Image = await this.saveImage(image, subjectID, subjectType);

    // 4. Check image saving result
    if (!newImage) {
      this.logger.warn(ImageMessageLog.CANNOT_SAVE_IMAGE);
      throw new NotFoundException(ImageErrorMessage.CANNOT_UPDATE_IMAGE);
    }

    // 5. Returning new image
    return newImage;
  }

  async removeImages(imageIDs: number[]): Promise<boolean> {
    // 1. Soft delete images
    const removeResult: boolean = await this.imageRepo.removeImages(imageIDs);
    this.logger.debug('Remove image result: ', removeResult);

    // 2. Check image soft delte result
    if (!removeResult) {
      this.logger.warn(ImageMessageLog.CANNOT_REMOVE_IMAGES);
      throw new NotFoundException(ImageErrorMessage.CANNOT_REMOVE_IMAGES);
    }

    // 3. Return soft delete result
    return removeResult;
  }
}
