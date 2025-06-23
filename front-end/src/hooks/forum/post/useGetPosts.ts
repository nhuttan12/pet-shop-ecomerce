// src/hooks/forum/post/useGetPosts.tsx
import { useState, useEffect } from 'react';
import { getPosts } from '../../../service/forum/postService'; 
import { Post } from '../../../types/Forum';

export const useGetPosts = (page = 1, limit = 10, refresh = false) => {
  const [data, setData] = useState<Post[]>([]);  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const result = await getPosts(limit, page);
        setData(result.data || []);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [page, limit, refresh]);  // <-- thêm refresh vào dependency

  return { data, loading, error };
};
