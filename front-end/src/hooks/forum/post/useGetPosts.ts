// src/hooks/forum/post/useGetPosts.tsx
import { useState, useEffect } from 'react';
import { getPosts } from '../../../service/forum/postService';
import { PostResponse } from '../../../common/dto/post/post-response.dto';

export const useGetPosts = (page = 1, limit = 10, refresh = false) => {
  const [data, setData] = useState<PostResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const result = await getPosts({ limit, page });
        console.log('Posts fetched:', result.data);
        setData(result.data || []);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [page, limit, refresh]); 

  return { data, loading, error };
};
