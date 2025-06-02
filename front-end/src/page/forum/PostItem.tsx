// components/PostItem.tsx
import React from "react";
import { MdRemoveRedEye } from "react-icons/md";
import { BsChatRight } from "react-icons/bs";
import { Post } from "../../types/Forum";

interface PostItemProps {
  post: Post;
}

const PostItem: React.FC<PostItemProps> = ({ post }) => {
  return (
    <div className="w-full h-[63px] bg-white shadow-[0px_4px_4px_#00000040] relative">
      <div className="absolute top-[9px] left-10 w-[826px] h-[46px]">
        <div className="flex flex-col gap-1.5 bg-white">
          <p className="text-base text-black">{post.content}</p>
          <p className="text-xs text-black">
            Được đăng bởi <span className="font-bold">{post.author}</span> {post.timeAgo}
          </p>
        </div>

        <div className="absolute top-0 left-[783px] flex flex-col items-center gap-1 w-[43px] h-[42px] bg-white">
          <MdRemoveRedEye size={24} />
          <span className="text-xs">{post.views}</span>
        </div>

        <div className="absolute top-0 left-[716px] flex flex-col items-center gap-1 w-[46px] h-[45px] bg-white">
          <BsChatRight size={24} />
          <span className="text-xs">{post.replies}</span>
        </div>
      </div>
    </div>
  );
};

export default PostItem;