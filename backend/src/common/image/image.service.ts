import { SavedImageDTO } from '@images/dto/saved-image.dto';
import { Image } from '@images/entites/images.entity';
import { ImageType } from '@images/enums/image-type.enum';
import { SubjectType } from '@images/enums/subject-type.enum';
import { ImageErrorMessage } from '@images/messages/image.error-messages';
import { ImageMessageLog } from '@images/messages/image.messages-log';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { UtilityService } from '@services/utility.service';
import { ImageRepository } from 'common/image/repositories/image.repository';

@Injectable()
export class ImageService {
  private readonly logger = new Logger(ImageService.name);
  constructor(
    private readonly utilityService: UtilityService,
    private readonly imageRepo: ImageRepository,
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
    subjectID: number,
    subjectType: SubjectType,
    newImageUrl: string,
    imageType: ImageType,
    folder?: string,
  ): Promise<Image> {
    // 1. Get image by subject ID and subject type
    const image: Image = await this.getImageBySubjectIdAndSubjectType(
      subjectID,
      subjectType,
    );
    this.utilityService.logPretty(
      'Get image by subject ID and subject type',
      image,
    );

    // 2. Remove old image
    const removeImageResult: boolean = await this.removeImage(image.id);
    this.utilityService.logPretty('Remove old image', removeImageResult);

    // 3. Insert new image
    const newImage: Image = await this.saveImage(
      { url: newImageUrl, type: imageType, folder: folder ?? '' },
      subjectID,
      subjectType,
    );
    this.utilityService.logPretty('Insert new image', newImage);

    // 4. Check image saving result
    if (!newImage) {
      this.logger.error(ImageMessageLog.IMAGE_NOT_FOUND);
      throw new InternalServerErrorException(
        ImageErrorMessage.IMAGE_NOT_FOUND_AFTER_CREATED,
      );
    }

    return newImage;
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
