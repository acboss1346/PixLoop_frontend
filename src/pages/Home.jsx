import { useEffect, useState } from "react";
import api from "../services/api";
import { PostItem } from "../components/PostItem";
import { useAuth } from "../context/AuthContext";

export const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get("/posts");
        setPosts(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load posts");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleLikeToggle = async (postId, isLiked) => {
    try {
      if (isLiked) {
        await api.delete(`/posts/${postId}/like`);
        setPosts(posts.map(p => p.id === postId ? { ...p, is_liked: false, like_count: p.like_count - 1 } : p));
      } else {
        await api.post(`/posts/${postId}/like`);
        setPosts(posts.map(p => p.id === postId ? { ...p, is_liked: true, like_count: p.like_count + 1 } : p));
      }
    } catch (err) {
      console.error("Failed to toggle like:", err);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto py-10 space-y-8">
        {[1, 2].map(n => (
          <div key={n} className="bg-neutral-900 rounded-2xl h-[500px] animate-pulse border border-neutral-800"></div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center">
        <p className="text-red-500 bg-red-500/10 inline-block px-4 py-2 rounded-xl border border-red-500/20">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-6">
      {posts.length === 0 ? (
        <div className="text-center py-20 bg-neutral-900 rounded-2xl border border-neutral-800 text-neutral-400">
          <div className="text-5xl mb-4">✨</div>
          <p className="text-lg font-medium text-white mb-2">Welcome to PixLoop!</p>
          <p className="text-sm">There are no posts yet. Be the first to share something.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {posts.map((post) => (
            <PostItem 
              key={post.id} 
              post={post} 
              onLikeToggle={() => handleLikeToggle(post.id, post.is_liked)} 
            />
          ))}
        </div>
      )}
    </div>
  );
};
