import { Image, ImageStatus, ImageType, SavedImageDTO } from '@common';
import { Injectable, Logger } from '@nestjs/common';
import { ImageRepository } from 'common/image/repositories/image.repository';
import { DataSource, EntityManager } from 'typeorm';

@Injectable()
export class ImageService {
  private readonly logger = new Logger(ImageService.name);
  constructor(
    private readonly dataSource: DataSource,
    private imageRepo: ImageRepository,
  ) {}

  async saveImage(image: SavedImageDTO): Promise<Image> {
    return await this.imageRepo.saveImage(image);
  }

  async saveImages(imageList: SavedImageDTO[]): Promise<Image[]> {
    return await this.imageRepo.saveImages(imageList);
  }

  async getById(id: number): Promise<Image | null> {
    return await this.imageRepo.getById(id);
  }

  async findManyById(ids: number[]): Promise<Image[]> {
    return await this.imageRepo.findManyById(ids);
  }

  async getImageForUser(userId: number, status: ImageStatus): Promise<Image[]> {
    return await this.imageRepo.getImageForUser(userId, status);
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
}
