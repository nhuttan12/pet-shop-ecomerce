import { Injectable } from '@nestjs/common';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import {
  createMap,
  forMember,
  mapFrom,
  Mapper,
  MappingProfile,
} from '@automapper/core';
import { Post } from '@post/entities/posts.entity';
import { PostResponse } from '@post/dto/post-response.dto';

@Injectable()
export class PostProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      this.postToPostResponse(mapper);
    };
  }

  private postToPostResponse(mapper: Mapper) {
    createMap(
      mapper,
      Post,
      PostResponse,
      forMember(
        (dest: PostResponse) => dest.id,
        mapFrom((src: Post) => src.id),
      ),
      forMember(
        (dest: PostResponse) => dest.authorID,
        mapFrom((src: Post) => src.author.id),
      ),
      forMember(
        (dest: PostResponse) => dest.authorName,
        mapFrom((src: Post) => src.author.name),
      ),
    );
  }
}
