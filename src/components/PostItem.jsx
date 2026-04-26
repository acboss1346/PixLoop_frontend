import { useState } from "react";
import { Heart, MessageCircle, Bookmark, MoreVertical } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { CommentSection } from "./CommentSection";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./PostItem.css";

export const PostItem = ({ post, onLikeToggle, onSaveToggle }) => {
  const [showComments, setShowComments] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const { user } = useAuth();

  return (
    <div className="post-card">
      {/* Header */}
      <div className="post-header">
        <div className="post-user-info">
          <div className="post-avatar">
            {post.profile_pic ? (
              <img src={post.profile_pic} alt={post.username} />
            ) : (
              post.username?.charAt(0).toUpperCase()
            )}
          </div>
          <div className="post-user-meta">
            <div className="post-username">{post.username}</div>
            <div className="post-time">
              {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
            </div>
          </div>
        </div>
        <div className="relative">
          <button 
            className="btn-icon post-menu-btn" 
            title="More options"
            onClick={() => setShowMenu(!showMenu)}
          >
            <MoreVertical size={20} />
          </button>
          
          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-[#1e1e1e] border border-[#333] rounded-md shadow-lg z-10 py-1">
              <button 
                className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-[#333] hover:text-white transition-colors"
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/post/${post.id}`);
                  setShowMenu(false);
                  alert('Link copied to clipboard!');
                }}
              >
                Copy Link
              </button>
              {user && user.username === post.username && (
                <button 
                  className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-[#333] hover:text-red-300 transition-colors"
                  onClick={async () => {
                    if(window.confirm('Are you sure you want to delete this post?')) {
                      try {
                        await api.delete(`/posts/${post.id}`);
                        window.location.reload(); // Simple way to refresh feed
                      } catch(err) {
                        alert('Failed to delete post');
                      }
                    }
                    setShowMenu(false);
                  }}
                >
                  Delete Post
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Image */}
      <div className="post-image-container">
        <img 
          src={post.image_url} 
          alt={post.caption}
          className="post-image"
          onDoubleClick={onLikeToggle}
          loading="lazy"
        />
      </div>

      {/* Actions Bar */}
      <div className="post-actions-bar">
        <button 
          onClick={onLikeToggle}
          className={`post-action-btn like-btn ${post.is_liked ? 'active' : ''}`}
          title={post.is_liked ? 'Unlike' : 'Like'}
        >
          <Heart size={22} fill={post.is_liked ? "currentColor" : "none"} />
          <span className="action-label">{post.like_count}</span>
        </button>
        <button 
          onClick={() => setShowComments(!showComments)}
          className="post-action-btn"
          title="Comment"
        >
          <MessageCircle size={22} />
          <span className="action-label">{post.comment_count}</span>
        </button>
        <button 
          onClick={onSaveToggle}
          className={`post-action-btn save-btn ml-auto ${post.is_saved ? 'active' : ''}`}
          title={post.is_saved ? 'Unsave' : 'Save'}
        >
          <Bookmark size={22} fill={post.is_saved ? "currentColor" : "none"} />
        </button>
      </div>

      {/* Engagement Stats */}
      <div className="post-stats">
        <div className="stat-item">
          <span className="stat-value">{post.like_count}</span>
          <span className="stat-label">Likes</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{post.comment_count}</span>
          <span className="stat-label">Comments</span>
        </div>
      </div>

      {/* Caption */}
      <div className="post-caption">
        <span className="caption-username">{post.username}</span>
        <span className="caption-text">{post.caption}</span>
      </div>

      {/* View Comments Link */}
      {post.comment_count > 0 && (
        <button 
          onClick={() => setShowComments(!showComments)}
          className="view-comments-link"
        >
          View all {post.comment_count} comments
        </button>
      )}
      
      {/* Comments Section Placeholder */}
      {showComments && (
        <div className="post-comments-section">
          <CommentSection postId={post.id} />
        </div>
      )}
    </div>
  );
};
