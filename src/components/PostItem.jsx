import { useState } from "react";
import { Heart, MessageCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export const PostItem = ({ post, onLikeToggle }) => {
  const [showComments, setShowComments] = useState(false);

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 p-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold shrink-0">
          {post.profile_pic ? (
            <img src={post.profile_pic} alt={post.username} className="w-full h-full rounded-full object-cover" />
          ) : (
            post.username?.charAt(0).toUpperCase()
          )}
        </div>
        <div>
          <div className="font-semibold text-white text-sm">{post.username}</div>
          <div className="text-xs text-neutral-500">
            {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
          </div>
        </div>
      </div>

      {/* Image */}
      <div className="relative aspect-square sm:aspect-[4/5] bg-neutral-950 flex items-center justify-center">
        <img 
          src={post.image_url} 
          alt={post.caption} 
          className="w-full h-full object-cover"
          onDoubleClick={onLikeToggle}
        />
      </div>

      {/* Actions */}
      <div className="p-4">
        <div className="flex items-center gap-4 mb-3">
          <button 
            onClick={onLikeToggle}
            className={`transition-colors hover:scale-110 active:scale-95 transform ${post.is_liked ? 'text-red-500' : 'text-white hover:text-neutral-300'}`}
          >
            <Heart size={26} fill={post.is_liked ? "currentColor" : "none"} strokeWidth={post.is_liked ? 0 : 2} />
          </button>
          <button 
            onClick={() => setShowComments(!showComments)}
            className="text-white hover:text-neutral-300 transition-colors hover:scale-110 active:scale-95 transform"
          >
            <MessageCircle size={26} />
          </button>
        </div>

        <div className="font-semibold text-sm text-white mb-2">
          {post.like_count} {post.like_count === 1 ? 'like' : 'likes'}
        </div>

        {/* Caption */}
        <div className="text-sm text-white">
          <span className="font-semibold mr-2">{post.username}</span>
          <span className="text-neutral-200">{post.caption}</span>
        </div>

        {/* Comments Toggle */}
        {post.comment_count > 0 && (
          <button 
            onClick={() => setShowComments(!showComments)}
            className="text-neutral-500 text-sm mt-2 hover:text-neutral-400"
          >
            View all {post.comment_count} comments
          </button>
        )}
        
        {/* Placeholder for comment section if expanded */}
        {showComments && (
          <div className="mt-3 text-sm text-neutral-400 italic">
            Comments feature UI is coming soon!
          </div>
        )}
      </div>
    </div>
  );
};
