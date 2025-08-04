import { Injectable } from '@nestjs/common';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import {
  createMap,
  forMember,
  mapFrom,
  Mapper,
  MappingProfile,
} from '@automapper/core';
import { PostReport } from '@post/entities/post-report.entity';
import { PostReportResponseDto } from '@post/dto/post-report-response.dto';

@Injectable()
export class PostReportProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      this.postReportToPostReportResponse(mapper);
    };
  }

  private postReportToPostReportResponse(mapper: Mapper) {
    createMap(
      mapper,
      PostReport,
      PostReportResponseDto,
      forMember(
        (dest: PostReportResponseDto) => dest.id,
        mapFrom((src: PostReport) => src.id),
      ),
      forMember(
        (dest: PostReportResponseDto) => dest.postTitle,
        mapFrom((src: PostReport) => src.post.title),
      ),
      forMember(
        (dest: PostReportResponseDto) => dest.userName,
        mapFrom((src: PostReport) => src.user.name),
      ),
    );
  }
}
