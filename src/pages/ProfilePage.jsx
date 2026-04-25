import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { LogOut, Heart, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const ProfilePage = () => {
  const { user, logout } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const response = await api.get("/posts");
        // Filter posts to only show the user's posts
        const userPosts = response.data.filter((post) => post.user_id === user._id);
        setPosts(userPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchUserPosts();
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="bg-neutral-900 rounded-2xl p-8 mb-8 border border-neutral-800 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-3xl font-bold text-white shadow-lg">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">{user?.username}</h1>
            <p className="text-neutral-400 mt-1">{user?.email}</p>
            <div className="flex gap-4 mt-4 text-sm font-medium">
              <span className="text-white"><strong className="text-xl">{posts.length}</strong> posts</span>
            </div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl transition-colors font-medium border border-neutral-700"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>

      <h2 className="text-xl font-bold text-white mb-6 tracking-tight border-b border-neutral-800 pb-4">Your Posts</h2>

      {loading ? (
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map(n => (
            <div key={n} className="aspect-square bg-neutral-900 animate-pulse rounded-xl"></div>
          ))}
        </div>
      ) : posts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {posts.map((post) => (
            <div key={post.id} className="relative aspect-square group rounded-xl overflow-hidden cursor-pointer bg-neutral-900">
              <img
                src={post.image_url}
                alt={post.caption}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-6 text-white backdrop-blur-sm">
                <div className="flex items-center gap-2 font-bold text-lg">
                  <Heart fill="currentColor" size={24} />
                  <span>{post.like_count || 0}</span>
                </div>
                <div className="flex items-center gap-2 font-bold text-lg">
                  <MessageCircle fill="currentColor" size={24} />
                  <span>{post.comment_count || 0}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-neutral-900 rounded-2xl border border-neutral-800 text-neutral-400">
          <div className="text-5xl mb-4">📷</div>
          <p className="text-lg font-medium text-white mb-2">No posts yet</p>
          <p className="text-sm">Share your first photo with the world!</p>
        </div>
      )}
    </div>
  );
};
