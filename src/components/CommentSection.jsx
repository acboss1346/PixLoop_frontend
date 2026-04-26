import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { CommentItem } from "./CommentItem";

export const CommentSection = ({ postId }) => {
  const [newCommentText, setNewCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPosting, setIsPosting] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const fetchComments = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/posts/${postId}/comments`);
      setComments(response.data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch comments", err);
      setError("Failed to load comments.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newCommentText.trim() || !user) return;
    
    try {
      setIsPosting(true);
      const response = await api.post(`/posts/${postId}/comments`, {
        comment: newCommentText
      });
      setComments([...comments, response.data]);
      setNewCommentText("");
    } catch (err) {
      console.error("Failed to post comment", err);
      setError("Error posting comment.");
    } finally {
      setIsPosting(false);
    }
  };

  if (isLoading) {
    return <div className="text-gray-400 p-2">Loading comments...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-2">{error}</div>;
  }

  return (
    <div className="mt-4 border-t border-white/10 pt-4">
      <h3 className="text-lg font-semibold mb-3">Comments</h3>

      {user ? (
        <form onSubmit={handleSubmit} className="mb-4 flex flex-col gap-2">
          <textarea
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            className="w-full border border-white/20 bg-black/20 p-2 rounded text-sm text-white focus:outline-none focus:border-white/40"
            placeholder="Write a comment..."
            rows={2}
          />
          <button
            type="submit"
            disabled={isPosting || !newCommentText.trim()}
            className="self-end bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-4 py-1.5 rounded text-sm font-medium transition-colors cursor-pointer"
          >
            {isPosting ? "Posting..." : "Post Comment"}
          </button>
        </form>
      ) : (
        <p className="mb-4 text-sm text-gray-400">
          You must be logged in to post a comment.
        </p>
      )}

      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-sm text-gray-500 italic">No comments yet. Be the first to share your thoughts!</p>
        ) : (
          comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))
        )}
      </div>
    </div>
  );
};
