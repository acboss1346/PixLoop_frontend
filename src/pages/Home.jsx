import { useEffect, useState } from "react";
import api from "../services/api";
import { PostItem } from "../components/PostItem";
import { useAuth } from "../context/AuthContext";
import "./Home.css";

export const Home = () => {
  const [posts, setPosts] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [postsRes, communitiesRes] = await Promise.all([
          api.get("/posts"),
          api.get("/communities")
        ]);
        setPosts(postsRes.data);
        setCommunities(communitiesRes.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load posts");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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

  if (error) {
    return (
      <div className="home-error">
        <div className="error-card">
          <div className="error-icon">⚠️</div>
          <h3>Something went wrong</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="home-container">
      {/* Left Sidebar */}
      <aside className="home-sidebar left-sidebar">
        <div className="sidebar-card">
          <h3>Your Profile</h3>
          <div className="profile-mini">
            <div className="profile-avatar-mini">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            <div className="profile-info-mini">
              <p className="profile-name">{user?.username}</p>
              <p className="profile-handle">@{user?.username}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Feed */}
      <main className="home-feed">
        {loading ? (
          <div className="loading-skeleton">
            {[1, 2, 3].map(n => (
              <div key={n} className="skeleton-card">
                <div className="skeleton-header"></div>
                <div className="skeleton-image"></div>
                <div className="skeleton-actions"></div>
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">✨</div>
            <h2>Welcome to PixLoop!</h2>
            <p>There are no posts yet. Be the first to share something amazing.</p>
          </div>
        ) : (
          <div className="posts-feed">
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
      </main>

      {/* Right Sidebar */}
      <aside className="home-sidebar right-sidebar">
        <div className="sidebar-card">
          <h4>Active Groups</h4>
          <div className="group-list">
            {communities.length === 0 ? (
              <p className="empty-text">Loading communities...</p>
            ) : (
              communities.map((community) => (
                <div key={community.id} className="group-item">
                  <div className="group-icon">{community.icon}</div>
                  <div className="group-info">
                    <p>{community.name}</p>
                    <span className="member-count">{community.memberCount} members</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </aside>
    </div>
  );
};
