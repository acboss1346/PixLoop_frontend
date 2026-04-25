import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import { PostItem } from "./PostItem";

// Fetch posts for the community
const fetchCommunityPost = async (communityId) => {
  const { data, error } = await supabase
    .from("posts")
    .select("*, communities(name)")
    .eq("community_id", communityId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
};

// Fetch community name separately
const fetchCommunityName = async (communityId) => {
  const { data, error } = await supabase
    .from("communities")
    .select("name")
    .eq("id", communityId)
    .single();

  if (error) throw new Error(error.message);
  return data.name;
};

export const CommunityDisplay = ({ communityId }) => {
  const {
    data: posts,
    error: postsError,
    isLoading: postsLoading,
  } = useQuery({
    queryKey: ["communityPost", communityId],
    queryFn: () => fetchCommunityPost(communityId),
  });

  const {
    data: communityName,
    error: nameError,
    isLoading: nameLoading,
  } = useQuery({
    queryKey: ["communityName", communityId],
    queryFn: () => fetchCommunityName(communityId),
  });

  if (postsLoading || nameLoading) {
    return <div className="text-center py-4">Loading community...</div>;
  }

  if (postsError || nameError) {
    return (
      <div className="text-center text-red-500 py-4">
        Error: {(postsError && postsError.message) || (nameError && nameError.message)}
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-6xl font-bold mb-6 text-center bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
        {communityName ? `${communityName} Community Posts` : "Community Posts"}
      </h2>

      {posts && posts.length > 0 ? (
        <div className="flex flex-wrap gap-6 justify-center">
          {posts.map((post) => (
            <PostItem key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-400">
          No posts in this community yet.
        </p>
      )}
    </div>
  );
};
