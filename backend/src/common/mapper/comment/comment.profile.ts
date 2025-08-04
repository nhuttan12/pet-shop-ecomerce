import { Injectable } from '@nestjs/common';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import {
  createMap,
  forMember,
  mapFrom,
  Mapper,
  MappingProfile,
} from '@automapper/core';
import { CommentResponseDto } from '@comment/dto/comment-response.dto';
import { Comment } from '@comment/entities/comments.entity';

@Injectable()
export class CommentProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      this.commentToCommentResponse(mapper);
    };
  }

  private commentToCommentResponse(mapper: Mapper) {
    createMap(
      mapper,
      Comment,
      CommentResponseDto,
      forMember(
        (dest: CommentResponseDto) => dest.id,
        mapFrom((src: Comment) => src.id),
      ),
      forMember(
        (dest: CommentResponseDto) => dest.authorID,
        mapFrom((src: Comment) => src.user.id),
      ),
      forMember(
        (dest: CommentResponseDto) => dest.authorName,
        mapFrom((src: Comment) => src.user.name),
      ),
      forMember(
        (dest: CommentResponseDto) => dest.parentID,
        mapFrom((src: Comment) => src.parentComment?.id ?? null),
      ),
    );
  }
}
