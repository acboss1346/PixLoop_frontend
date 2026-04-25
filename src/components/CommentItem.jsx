import { formatDistanceToNow } from "date-fns";

export const CommentItem = ({ comment }) => {
  return (
    <div className="flex gap-3 items-start mb-4">
      <div className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-sm font-bold shrink-0 overflow-hidden">
        {comment.profile_pic ? (
          <img src={comment.profile_pic} alt={comment.username} className="w-full h-full object-cover" />
        ) : (
          comment.username?.charAt(0).toUpperCase()
        )}
      </div>
      <div className="flex-1 bg-white/5 rounded-2xl rounded-tl-none p-3 text-sm">
        <div className="flex items-center justify-between mb-1">
          <span className="font-semibold text-white/90">{comment.username}</span>
          <span className="text-xs text-white/40">
            {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
          </span>
        </div>
        <p className="text-white/80 leading-relaxed break-words">{comment.comment}</p>
      </div>
    </div>
  );
};
