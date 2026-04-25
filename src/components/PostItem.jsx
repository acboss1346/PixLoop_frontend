import { useState } from "react";
import { Heart, MessageCircle, Bookmark, MoreVertical } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { CommentSection } from "./CommentSection";
import "./PostItem.css";

export const PostItem = ({ post, onLikeToggle, onSaveToggle }) => {
  const [showComments, setShowComments] = useState(false);

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
        <button className="btn-icon post-menu-btn" title="More options">
          <MoreVertical size={20} />
        </button>
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
          <Heart size={22} />
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
          <Bookmark size={22} />
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
