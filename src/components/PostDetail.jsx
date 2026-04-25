import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import { LikeButton } from "./LikeButton";
import { CommentSection } from "./CommentSection";

const fetchPostById = async (id) => {
  const { data, error } = await supabase.rpc("get_posts_with_counts");

  if (error) throw new Error(error.message);

  const post = data.find((p) => p.id === id);
  if (!post) throw new Error("Post not found");

  return post;
};

export const PostDetail = ({ postId }) => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["post", postId],
    queryFn: () => fetchPostById(postId),
  });

  if (isLoading) return <div>Loading post...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return null;

  return (
    <div className="space-y-6 text-white max-w-3xl mx-auto px-4">
      <h2 className="text-4xl sm:text-6xl font-bold text-center bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
        {data.title}
      </h2>

      {data.image_url && (
        <img
          src={data.image_url}
          alt={data.title}
          className="mt-4 rounded object-cover w-full h-64"
        />
      )}

      <p className="text-gray-300 text-lg">{data.content}</p>
      <p className="text-gray-500 text-sm">
        Posted on: {new Date(data.created_at).toLocaleDateString()}
      </p>

      <LikeButton postId={postId} />
      <CommentSection postId={postId} />
    </div>
  );
};
