import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Image } from '@common';
import { In, Repository } from 'typeorm';

@Injectable()
export class ImageRepository {
  constructor(
    @InjectRepository(Image) private readonly imageRepo: Repository<Image>,
  ) {}

  async getById(id: number): Promise<Image | null> {
    return await this.imageRepo.findOne({ where: { id } });
  }

  async findManyById(ids: number[]): Promise<Image[]> {
    return await this.imageRepo.find({ where: { id: In(ids) } });
  }
}
