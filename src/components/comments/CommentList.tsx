import React, { useState, useEffect } from 'react';
import { MessageSquare } from 'lucide-react';
import { Comment } from '../../types';
import commentService from '../../services/commentService';
import CommentForm from './CommentForm';

interface CommentListProps {
  entityType: string;
  entityId: number;
}

const CommentItem: React.FC<{ comment: Comment }> = ({ comment }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <div className="border-b border-border py-4">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-full bg-primary text-white text-xs flex items-center justify-center">
          {comment.username.substring(0, 2).toUpperCase()}
        </div>
        <div>
          <p className="text-sm font-medium">{comment.username}</p>
          <p className="text-xs text-text-muted">{formatDate(comment.createdAt)}</p>
        </div>
      </div>
      <div className="pl-10">
        <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
      </div>
    </div>
  );
};

const CommentList: React.FC<CommentListProps> = ({ entityType, entityId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = async () => {
    try {
      setIsLoading(true);
      const response = await commentService.getCommentsByEntity(entityType, entityId);
      
      if (response.success && response.data) {
        setComments(response.data);
      } else {
        setError(response.error || 'Failed to fetch comments');
      }
    } catch (error) {
      setError('An error occurred while fetching comments');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [entityType, entityId]);

  const handleCommentAdded = () => {
    fetchComments();
  };

  if (isLoading) {
    return (
      <div className="p-4 text-center">
        <p className="text-text-muted">Loading comments...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-error">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium flex items-center gap-2">
        <MessageSquare size={18} />
        <span>Comments</span>
        {comments.length > 0 && <span className="text-sm text-text-muted">({comments.length})</span>}
      </h3>
      
      <CommentForm 
        entityType={entityType} 
        entityId={entityId} 
        onCommentAdded={handleCommentAdded} 
      />

      <div className="space-y-2 mt-6">
        {comments.length === 0 ? (
          <div className="text-center py-6">
            <MessageSquare size={24} className="mx-auto mb-2 text-text-muted" />
            <p className="text-text-muted">No comments yet. Be the first to comment!</p>
          </div>
        ) : (
          comments.map(comment => (
            <CommentItem key={comment.id} comment={comment} />
          ))
        )}
      </div>
    </div>
  );
};

export default CommentList;