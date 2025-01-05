import { useEffect, useCallback } from 'react';

export function useInfiniteScroll(onLoadMore, hasMore) {
  const handleScroll = useCallback(() => {
    const scrollTop = window.scrollY;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;
    
    // Charge plus de contenu quand on est proche du bas (100px avant)
    if (scrollHeight - scrollTop <= clientHeight + 50 && hasMore) {
      onLoadMore();
    }
  }, [onLoadMore, hasMore]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);
}