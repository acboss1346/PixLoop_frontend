import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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

  const handleJoinGroup = async (communityId) => {
    try {
      const res = await api.post(`/communities/${communityId}/join`);
      if (res.data.success) {
        setCommunities(communities.map(c => 
          c.id === communityId ? { ...c, is_member: true, memberCount: parseInt(c.memberCount) + 1 } : c
        ));
      }
    } catch (err) {
      console.error("Failed to join group", err);
      alert(err.response?.data?.message || "Failed to join group");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [postsRes, communitiesRes] = await Promise.allSettled([
          api.get("/posts"),
          api.get("/communities")
        ]);
        
        if (postsRes.status === "fulfilled") {
          setPosts(postsRes.value.data);
        } else {
          setError(postsRes.reason?.response?.data?.message || "Failed to load posts");
        }

        if (communitiesRes.status === "fulfilled") {
          setCommunities(communitiesRes.value.data.data);
        } else {
          console.error("Failed to load communities:", communitiesRes.reason);
        }
      } catch (err) {
        setError("An unexpected error occurred while loading data");
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h4 style={{ margin: 0 }}>Active Groups</h4>
            <Link 
              to="/groups"
              style={{ background: '#333', color: 'white', textDecoration: 'none', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem' }}
            >
              See All
            </Link>
          </div>
          <div className="group-list">
            {communities.length === 0 ? (
              <p className="empty-text">{loading ? "Loading communities..." : "No active groups found."}</p>
            ) : (
              communities.map((community) => (
                <Link to={`/groups/${community.id}`} key={community.id} className="group-item" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem', textDecoration: 'none', color: 'inherit' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div className="group-icon">
                      {community.logo_url ? (
                        <img src={community.logo_url} alt={community.name} style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }} />
                      ) : (
                        community.icon
                      )}
                    </div>
                    <div className="group-info">
                      <p style={{ margin: 0, fontWeight: 'bold' }}>{community.name}</p>
                      <span className="member-count" style={{ fontSize: '0.8rem', color: '#888' }}>{community.memberCount} members</span>
                    </div>
                  </div>
                  {!community.is_member && (
                    <button 
                      onClick={(e) => { e.preventDefault(); handleJoinGroup(community.id); }}
                      style={{ background: 'transparent', color: '#a855f7', border: '1px solid #a855f7', padding: '2px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
                    >
                      Join
                    </button>
                  )}
                </Link>
              ))
            )}
          </div>
        </div>
      </aside>

    </div>
  );
};
