import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { PostItem } from "../components/PostItem";
import { ArrowLeft, Users, Trash2, Edit2, Image as ImageIcon } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export const GroupDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [community, setCommunity] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showCreatePost, setShowCreatePost] = useState(false);
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchGroupData();
  }, [id]);

  const fetchGroupData = async () => {
    try {
      setLoading(true);
      const [groupRes, postsRes] = await Promise.all([
        api.get(`/communities/${id}`),
        api.get(`/posts?community_id=${id}`)
      ]);
      setCommunity(groupRes.data.data);
      setPosts(postsRes.data);
    } catch (err) {
      console.error("Failed to fetch group data", err);
      setError("Failed to load group. It may have been deleted.");
    } finally {
      setLoading(false);
    }
  };

  const handleJoinGroup = async () => {
    try {
      const res = await api.post(`/communities/${id}/join`);
      if (res.data.success) {
        setCommunity({ ...community, is_member: true, memberCount: parseInt(community.memberCount) + 1 });
      }
    } catch (err) {
      console.error("Failed to join group", err);
      alert(err.response?.data?.message || "Failed to join group");
    }
  };

  const handleDeleteGroup = async () => {
    if (!window.confirm("Are you sure you want to permanently delete this group? All posts inside it will also be deleted.")) return;
    try {
      const res = await api.delete(`/communities/${id}`);
      if (res.data.success) {
        navigate('/groups');
      }
    } catch (err) {
      console.error("Failed to delete group", err);
      alert(err.response?.data?.message || "Failed to delete group");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!image) return alert("Please select an image");
    
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("caption", caption);
      formData.append("community_id", id);
      
      const res = await api.post("/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      setPosts([res.data, ...posts]);
      setShowCreatePost(false);
      setCaption("");
      setImage(null);
      setPreview("");
    } catch (err) {
      console.error("Failed to create post", err);
      alert(err.response?.data?.message || "Failed to create post");
    } finally {
      setSubmitting(false);
    }
  };

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

  const handleSaveToggle = async (postId, isSaved) => {
    try {
      if (isSaved) {
        await api.delete(`/posts/${postId}/save`);
        setPosts(posts.map(p => p.id === postId ? { ...p, is_saved: false, save_count: (p.save_count || 0) - 1 } : p));
      } else {
        await api.post(`/posts/${postId}/save`);
        setPosts(posts.map(p => p.id === postId ? { ...p, is_saved: true, save_count: (p.save_count || 0) + 1 } : p));
      }
    } catch (err) {
      console.error("Failed to toggle save:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error || !community) {
    return (
      <div className="max-w-2xl mx-auto mt-8 text-center p-8 bg-[#1e1e1e] rounded-xl border border-[#333]">
        <div className="text-4xl mb-4">😢</div>
        <h2 className="text-xl font-bold mb-2">Group Not Found</h2>
        <p className="text-gray-400 mb-6">{error}</p>
        <button 
          onClick={() => navigate('/groups')}
          className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-full font-medium transition-colors"
        >
          Browse Groups
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Back Button */}
      <button 
        onClick={() => navigate('/groups')}
        className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors w-fit"
      >
        <ArrowLeft size={20} />
        Back to Groups
      </button>

      {/* Group Header */}
      <div className="bg-[#1e1e1e] border border-[#333] rounded-2xl p-6 md:p-8 mb-8 relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        
        <div className="flex flex-col md:flex-row gap-6 items-start relative z-10">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden bg-[#252525] flex items-center justify-center flex-shrink-0 border border-[#333] shadow-xl">
            {community.logo_url ? (
              <img src={community.logo_url} alt={community.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-5xl">{community.icon}</span>
            )}
          </div>
          
          <div className="flex-1 w-full">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 w-full">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">{community.name}</h1>
                <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                  <div className="flex items-center gap-1">
                    <Users size={16} />
                    <span>{community.memberCount} members</span>
                  </div>
                  <span>•</span>
                  <span>Created {new Date(community.created_at).toLocaleDateString()}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {community.creator_id === user.id && (
                  <button 
                    onClick={handleDeleteGroup}
                    className="p-2 text-red-400 hover:bg-red-400/10 hover:text-red-300 rounded-lg transition-colors border border-transparent hover:border-red-400/20"
                    title="Delete Group"
                  >
                    <Trash2 size={20} />
                  </button>
                )}
                
                {community.is_member ? (
                  <button className="px-6 py-2 bg-gray-800 text-gray-300 rounded-full font-medium cursor-default border border-[#444]">
                    Joined
                  </button>
                ) : (
                  <button 
                    onClick={handleJoinGroup}
                    className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-full font-medium transition-colors shadow-lg shadow-purple-900/30"
                  >
                    Join Group
                  </button>
                )}
              </div>
            </div>
            
            <p className="text-gray-300 max-w-2xl">{community.description || "No description provided."}</p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Posts Feed */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Group Posts</h2>
            {community.is_member && (
              <button 
                onClick={() => setShowCreatePost(!showCreatePost)}
                className="flex items-center gap-2 text-sm bg-[#252525] hover:bg-[#333] border border-[#444] text-white px-4 py-2 rounded-full transition-colors"
              >
                <Edit2 size={16} />
                Create Post
              </button>
            )}
          </div>

          {showCreatePost && community.is_member && (
            <div className="bg-[#1e1e1e] border border-[#333] rounded-xl p-5 mb-8 animate-fade-in">
              <form onSubmit={handleCreatePost}>
                <div className="mb-4">
                  <textarea
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="What's on your mind?"
                    className="w-full bg-[#000] border border-[#333] rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors resize-none h-24"
                  />
                </div>
                
                {preview && (
                  <div className="mb-4 relative rounded-lg overflow-hidden border border-[#333]">
                    <img src={preview} alt="Preview" className="w-full h-auto max-h-64 object-cover" />
                    <button 
                      type="button"
                      onClick={() => { setImage(null); setPreview(""); }}
                      className="absolute top-2 right-2 bg-black/60 p-1.5 rounded-full text-white hover:bg-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-gray-400 hover:text-purple-400 cursor-pointer transition-colors p-2 rounded-lg hover:bg-purple-500/10">
                    <ImageIcon size={20} />
                    <span className="text-sm font-medium">Add Photo</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleImageChange} 
                    />
                  </label>
                  
                  <div className="flex gap-2">
                    <button 
                      type="button"
                      onClick={() => { setShowCreatePost(false); setImage(null); setPreview(""); setCaption(""); }}
                      className="px-4 py-1.5 text-sm font-medium text-gray-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      disabled={submitting || !image}
                      className="px-6 py-1.5 text-sm font-medium bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:text-gray-400 text-white rounded-full transition-colors shadow-lg shadow-purple-900/20"
                    >
                      {submitting ? "Posting..." : "Post"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {posts.length === 0 ? (
            <div className="text-center py-16 bg-[#1e1e1e] rounded-xl border border-[#333]">
              <div className="text-4xl mb-3">📸</div>
              <h3 className="text-lg font-medium text-white mb-2">No posts yet</h3>
              <p className="text-gray-400 text-sm mb-4">Be the first to share something in this group!</p>
              {community.is_member && (
                <button 
                  onClick={() => setShowCreatePost(true)}
                  className="text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors"
                >
                  Create a post
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {posts.map((post) => (
                <PostItem 
                  key={post.id} 
                  post={post} 
                  onLikeToggle={() => handleLikeToggle(post.id, post.is_liked)}
                  onSaveToggle={() => handleSaveToggle(post.id, post.is_saved)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
