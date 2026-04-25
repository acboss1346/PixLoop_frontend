import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import { useAuth } from "../context/AuthContext";
import { fetchCommunities } from "./CommunityList";

const createPost = async (post, imageFile) => {
  const sanitize = (str) => str.replace(/[^a-zA-Z0-9.\-_]/g, "_");
  const safeFileName = `${sanitize(post.title)}-${Date.now()}-${sanitize(imageFile.name)}`;

  const { error: uploadError } = await supabase.storage
    .from("post-images")
    .upload(safeFileName, imageFile);

  if (uploadError) throw new Error(uploadError.message);

  const { data: publicURLData } = supabase.storage
    .from("post-images")
    .getPublicUrl(safeFileName);

  const { error } = await supabase
    .from("posts")
    .insert([{ ...post, image_url: publicURLData.publicUrl }]);

  if (error) throw new Error(error.message);
};

export const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [communityId, setCommunityId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const { user } = useAuth();
  const avatarUrl = user?.user_metadata?.avatar_url || null;

  const { data: communities, isLoading: isCommunitiesLoading } = useQuery({
    queryKey: ["communities"],
    queryFn: fetchCommunities,
  });

  const { mutate, isPending, isError, error, isSuccess } = useMutation({
    mutationFn: ({ post, imageFile }) => createPost(post, imageFile),
    onSuccess: () => {
      setTitle("");
      setContent("");
      setSelectedFile(null);
      setCommunityId(null);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedFile || !user) return;

    mutate({
      post: {
        title,
        content,
        avatar_url: avatarUrl,
        community_id: communityId,
      },
      imageFile: selectedFile,
    });
  };

  const handleCommunityChange = (e) => {
    const value = e.target.value;
    setCommunityId(value ? Number(value) : null);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
      <h2 className="text-3xl font-bold text-center mb-4">Create New Post</h2>

      <div>
        <label htmlFor="title" className="block mb-2 font-medium">Title</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-white/10 bg-transparent p-2 rounded"
          required
        />
      </div>

      <div>
        <label htmlFor="content" className="block mb-2 font-medium">Content</label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full border border-white/10 bg-transparent p-2 rounded"
          rows={5}
          required
        />
      </div>

      <div>
        <label htmlFor="community" className="block mb-2 font-medium">Select Community</label>
        <select
          id="community"
          value={communityId ?? ""}
          onChange={handleCommunityChange}
          className="w-full border border-white/10 bg-transparent p-2 rounded"
          required
        >
          <option value="">-- Choose a Community --</option>
          {communities?.map((community) => (
            <option key={community.id} value={community.id}>
              {community.name}
            </option>
          ))}
        </select>
        {isCommunitiesLoading && (
          <p className="text-sm text-gray-400 mt-1">Loading communities...</p>
        )}
      </div>

      <div>
        <label htmlFor="image" className="block mb-2 font-medium">Upload Image</label>
        <input
          id="image"
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files?.[0]) {
              setSelectedFile(e.target.files[0]);
            }
          }}
          className="w-full text-white"
          required
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className={`bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 ${
          isPending ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {isPending ? "Creating..." : "Create Post"}
      </button>

      {isError && (
        <p className="text-red-500 mt-2">
          {error?.message || "Error creating post."}
        </p>
      )}
      {isSuccess && (
        <p className="text-green-500 mt-2">✅ Post created successfully!</p>
      )}
    </form>
  );
};
