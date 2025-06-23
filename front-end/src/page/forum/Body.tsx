import React, { useEffect, useState } from 'react';
import api from '../../service/api';

// Định nghĩa các kiểu dữ liệu
interface Comment {
  id: number;
  content: string;
  author: string;
  timeAgo: string;
}

interface Post {
  id: number;
  content: string;
  author: string;
  timeAgo: string;
  views: number;
  replies: number;
  comments?: Comment[];
}

interface HotPostCardProps {
  post: Post;
}

interface PostItemProps {
  post: Post;
  onAddComment: (postId: number, content: string) => Promise<void>;
}

// Component HotPostCard
const HotPostCard: React.FC<HotPostCardProps> = ({ post }) => (
  <div className="border-b py-2">
    <p className="text-sm">{post.content}</p>
    <p className="text-xs text-gray-500">{post.author} • {post.timeAgo}</p>
  </div>
);

// Component PostItem với phần bình luận
const PostItem: React.FC<PostItemProps> = ({ post, onAddComment }) => {
  const [commentContent, setCommentContent] = useState('');
  const [commentError, setCommentError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      setCommentError('Vui lòng đăng nhập để bình luận.');
      return;
    }
    if (!commentContent.trim()) {
      setCommentError('Vui lòng nhập nội dung bình luận.');
      return;
    }

    try {
      await onAddComment(post.id, commentContent);
      setCommentContent('');
      setCommentError('');
    } catch (error: any) {
      console.error('Lỗi khi gửi bình luận:', error);
      setCommentError(error.response?.data?.message || 'Không thể thêm bình luận.');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-4">
      <p className="text-lg font-semibold">{post.content}</p>
      <p className="text-sm text-gray-500">
        {post.author} • {post.timeAgo} • {post.views} lượt xem • {post.replies} trả lời
      </p>
      {/* Form bình luận */}
      <div className="mt-4">
        {isLoggedIn ? (
          <form onSubmit={handleCommentSubmit} className="flex flex-col gap-2">
            <textarea
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              placeholder="Viết bình luận..."
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
              rows={2}
            />
            {commentError && <p className="text-red-500 text-sm">{commentError}</p>}
            <button
              type="submit"
              className="self-end bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Gửi
            </button>
          </form>
        ) : (
          <p className="text-red-500 text-sm">Vui lòng đăng nhập để bình luận.</p>
        )}
      </div>
      {/* Danh sách bình luận */}
      {post.comments && post.comments.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-semibold">Bình luận:</h3>
          {post.comments.map((comment) => (
            <div key={comment.id} className="border-t pt-2 mt-2">
              <p className="text-sm">{comment.content}</p>
              <p className="text-xs text-gray-500">{comment.author} • {comment.timeAgo}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Component chính Body
const Body: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [hotPosts, setHotPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [formData, setFormData] = useState<{ title: string; content: string }>({
    title: '',
    content: '',
  });
  const [formError, setFormError] = useState<string>('');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // Định dạng thời gian
  const formatTimeAgo = (createdAt: string): string => {
    const now = new Date();
    const created = new Date(createdAt);
    const diffInMinutes = Math.floor((now.getTime() - created.getTime()) / 60000);
    return diffInMinutes > 0 ? `cách đây ${diffInMinutes} phút` : 'vừa xong';
  };

  // Kiểm tra trạng thái đăng nhập
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  // Lấy danh sách bài viết và bình luận
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await api.get('/post', {
          params: { limit: 10, page: 1 },
        });
        const apiPosts = response.data.data;
        const formattedPosts: Post[] = await Promise.all(
          apiPosts.map(async (post: any) => {
            let author = `User_${post.authorId}`;
            try {
              const userResponse = await api.get(`/user/${post.authorId}`);
              author = userResponse.data.username || author;
            } catch {
              console.warn(`Failed to fetch username for authorId: ${post.authorId}`);
            }

            // Lấy bình luận cho bài viết
            let comments: Comment[] = [];
            try {
              const commentResponse = await api.get(`/comment/post/${post.id}`);
              comments = await Promise.all(
                commentResponse.data.data.map(async (comment: any) => {
                  let commentAuthor = `User_${comment.userId}`;
                  try {
                    const userResponse = await api.get(`/user/${comment.userId}`);
                    commentAuthor = userResponse.data.username || commentAuthor;
                  } catch {
                    console.warn(`Failed to fetch username for userId: ${comment.userId}`);
                  }
                  return {
                    id: comment.id,
                    content: comment.content,
                    author: commentAuthor,
                    timeAgo: formatTimeAgo(comment.created_at),
                  };
                }),
              );
            } catch {
              console.warn(`Failed to fetch comments for postId: ${post.id}`);
            }

            return {
              id: post.id,
              content: post.content,
              author,
              timeAgo: formatTimeAgo(post.created_at),
              views: post.views || 0,
              replies: post.replies || 0,
              comments,
            };
          }),
        );
        setPosts(formattedPosts);
        setHotPosts(formattedPosts.slice(0, 4));
      } catch (error: any) {
        console.error('Lỗi khi lấy bài viết:', error);
        setFormError(error.response?.data?.message || 'Không thể lấy bài viết.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Xử lý thay đổi input khi tạo bài viết
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormError('');
  };

  // Xử lý tạo bài viết
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      setFormError('Vui lòng đăng nhập để tạo bài viết.');
      return;
    }
    if (!formData.title.trim() || !formData.content.trim()) {
      setFormError('Vui lòng nhập tiêu đề và nội dung.');
      return;
    }

    try {
      const response = await api.post(
        '/post/create',
        {
          title: formData.title,
          content: formData.content,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        },
      );
      const newPost = response.data.data;
      let author = `User_${newPost.authorId}`;
      try {
        const userResponse = await api.get(`/user/${newPost.authorId}`);
        author = userResponse.data.username || author;
      } catch {
        console.warn(`Failed to fetch username for authorId: ${newPost.authorId}`);
      }
      const formattedPost: Post = {
        id: newPost.id,
        content: newPost.content,
        author,
        timeAgo: formatTimeAgo(newPost.created_at),
        views: newPost.views || 0,
        replies: newPost.replies || 0,
        comments: [],
      };
      setPosts([formattedPost, ...posts]);
      setHotPosts([formattedPost, ...hotPosts].slice(0, 4));
      setFormData({ title: '', content: '' });
      alert('Tạo bài viết thành công!');
    } catch (error: any) {
      console.error('Lỗi khi tạo bài viết:', error);
      setFormError(
        error.response?.data?.message || 'Không thể tạo bài viết. Vui lòng thử lại.',
      );
    }
  };

  // Xử lý tạo bình luận (đã sửa lỗi)
  const handleAddComment = async (postId: number, content: string) => {
    try {
      const response = await api.post(
        '/comment/create',
        {
          content,
          postId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        },
      );
      console.log('Phản hồi từ API:', response.data); // Log để kiểm tra
      const newComment = response.data; // Sửa ở đây: dùng response.data thay vì response.data.data

      let commentAuthor = `User_${newComment.userId}`;
      try {
        const userResponse = await api.get(`/user/${newComment.userId}`);
        commentAuthor = userResponse.data.username || commentAuthor;
      } catch {
        console.warn(`Failed to fetch username for userId: ${newComment.userId}`);
      }
      const formattedComment: Comment = {
        id: newComment.id,
        content: newComment.content,
        author: commentAuthor,
        timeAgo: newComment.created_at ? formatTimeAgo(newComment.created_at) : 'vừa xong',
      };

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                comments: [...(post.comments || []), formattedComment],
                replies: post.replies + 1,
              }
            : post,
        ),
      );
    } catch (error: any) {
      console.error('Lỗi khi tạo bình luận:', error);
      throw error; // Ném lỗi để PostItem xử lý
    }
  };

  return (
    <div className="flex w-[1920px] items-start justify-center gap-[50px] px-[312px] py-5 top-40 left-0 bg-[#f8f9fa]">
      {/* LEFT */}
      <div className="flex flex-col w-[905px] gap-10 pt-[30px]">
        {/* Form tạo bài viết */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Tạo bài viết mới</h2>
          {isLoggedIn ? (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Tiêu đề
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nhập tiêu đề bài viết"
                />
              </div>
              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                  Nội dung
                </label>
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  rows={4}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nhập nội dung bài viết"
                />
              </div>
              {formError && <p className="text-red-500 text-sm">{formError}</p>}
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Đăng bài
              </button>
            </form>
          ) : (
            <p className="text-red-500 text-sm">Vui lòng đăng nhập để tạo bài viết.</p>
          )}
        </div>

        {/* Danh sách bài viết */}
        {loading ? (
          <p>Đang tải...</p>
        ) : posts.length === 0 ? (
          <p>Không có bài viết nào.</p>
        ) : (
          posts.map((post) => (
            <PostItem key={post.id} post={post} onAddComment={handleAddComment} />
          ))
        )}
      </div>

      {/* RIGHT */}
      <div className="flex flex-col w-[334px] items-center gap-2.5 pt-[30px] px-[30px] bg-white shadow-md">
        <p className="text-base font-normal text-black">Bài đăng hot trong tuần</p>
        {hotPosts.map((post) => (
          <HotPostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default Body;