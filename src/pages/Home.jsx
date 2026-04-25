import { useEffect, useState } from "react";
import api from "../services/api";
import { PostItem } from "../components/PostItem";
import { useAuth } from "../context/AuthContext";
import "./Home.css";

export const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
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

        <div className="sidebar-card">
          <h4>Suggested Users</h4>
          <div className="suggested-list">
            <div className="suggested-item">
              <div className="suggested-avatar">AI</div>
              <div className="suggested-meta">
                <p>AI Creator</p>
                <button className="btn-small">Follow</button>
              </div>
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
            <div className="group-item">
              <div className="group-icon">📷</div>
              <p>Photography</p>
            </div>
            <div className="group-item">
              <div className="group-icon">✈️</div>
              <p>Travel</p>
            </div>
          </div>
        </div>

        <div className="sidebar-card">
          <h4>Trending Now</h4>
          <div className="trending-list">
            <div className="trending-item">
              <p className="trending-hash">#Photography</p>
              <span className="trending-count">1.2K posts</span>
            </div>
            <div className="trending-item">
              <p className="trending-hash">#Landscape</p>
              <span className="trending-count">856 posts</span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};
