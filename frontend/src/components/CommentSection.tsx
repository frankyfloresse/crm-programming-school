import { useState, useEffect } from 'react';
import type { Comment } from '../api/services/comments.service';
import { commentsService } from '../api/services/comments.service';

interface CommentSectionProps {
  orderId: number;
  canComment: boolean;
  onCommentSubmitted?: () => void;
  msg?: string | null;
  utm?: string | null;
}

export default function CommentSection({
  orderId,
  canComment,
  onCommentSubmitted
}: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [orderId]);

  const fetchComments = async () => {
    try {
      const fetchedComments = await commentsService.getCommentsByOrderId(orderId);
      setComments(fetchedComments);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || isSubmitting || !canComment) return;

    setIsSubmitting(true);
    try {
      await commentsService.createComment({
        message: newComment.trim(),
        orderId,
      });
      setNewComment('');
      fetchComments();
      onCommentSubmitted?.();
    } catch (error) {
      console.error('Failed to submit comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="space-y-4">
      {comments.length > 0 && (
        <div>
          <h4 className="font-semibold mb-3 text-lg">Comments:</h4>
          <div className="space-y-3">
            {comments.map((comment) => (
              <div key={comment.id} className="bg-base-200 p-3 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium text-sm">
                    {comment.user.firstName} {comment.user.lastName}
                  </span>
                  <span className="text-xs text-base-content/50">
                    {formatDate(comment.createdAt)}
                  </span>
                </div>
                <p className="text-sm">{comment.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {canComment && (
          <form onSubmit={handleSubmitComment} className="space-y-3">
            <div className="form-control">
              <label className="label block mb-1">
                <span className="label-text font-medium">Comment</span>
              </label>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="textarea textarea-bordered h-24 w-full"
                placeholder="Enter your comment..."
                disabled={isSubmitting}
              />
            </div>
            <button
              type="submit"
              className={`btn ${isSubmitting ? 'btn-loading' : ''}`}
              disabled={!newComment.trim() || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="loading loading-spinner"></span>
                  Submitting...
                </>
              ) : (
                'SUBMIT'
              )}
            </button>
          </form>
      )}

      {!canComment && (
        <div className="alert alert-info shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <div>
            <h3 className="font-bold">Access Restricted</h3>
            <div className="text-xs">You can only comment on orders without a manager or orders assigned to you.</div>
          </div>
        </div>
      )}
    </div>
  );
}