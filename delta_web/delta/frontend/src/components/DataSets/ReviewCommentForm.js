import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { addReviewComment, getReviewComment, updateReviewComment, deleteReviewComment, addReview } from '../../actions/review.js';

const ReviewCommentForm = (props) => {
  // id of the parent review that the comment goes on
  const [comment, setComment] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [commentId, setCommentId] = useState(null);

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    props.addReviewComment
    ({ text: comment, 
        review: props.review_id,
        author:props.auth.user.id
    }
    );
    setComment('');
  };

  const handleDelete = () => {
    props.deleteReviewComment(commentId);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <textarea
            className="form-control"
            rows="3"
            value={comment}
            onChange={handleCommentChange}
            placeholder={editMode ? 'Edit your comment...' : 'Write your comment...'}
          ></textarea>
        </div>
        <button type="submit" className="btn btn-primary">
          {editMode ? 'Update Comment' : 'Add Comment'}
        </button>
        {editMode && (
          <button type="button" className="btn btn-danger ml-2" onClick={handleDelete}>
            Delete Comment
          </button>
        )}
      </form>
    </div>
  );
};

const mapStateToProps = (state) => ({
    auth:state.auth,
});

export default connect(mapStateToProps, {addReviewComment,getReviewComment,updateReviewComment, deleteReviewComment})(ReviewCommentForm);