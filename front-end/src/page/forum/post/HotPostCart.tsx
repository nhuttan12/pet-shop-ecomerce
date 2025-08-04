import React from 'react';
import { PostResponse } from '../../../common/dto/post/post-response.dto';
import { getTimeDifference } from '../../../utils/get-difference-function';

interface HotPostCardProps {
  post: PostResponse;
}

const HotPostCard: React.FC<HotPostCardProps> = ({ post }) => {
  return (
    <div className="w-80 h-20 bg-[#ffffff80] rounded-[5px] border border-black shadow-md px-3 py-2 mb-3">
      <p className="text-sm font-semibold text-black leading-5">{post.title}</p>{' '}
      {/* Tiêu đề */}
      <p className="text-xs text-black leading-5">{post.content}</p>
      <p className="text-[10px] text-black leading-5">
        Được đăng bởi <span className="font-bold">{post.authorName}</span>{' '}
        {getTimeDifference(post.createdAt)}
      </p>
    </div>
  );
};

export default HotPostCard;
