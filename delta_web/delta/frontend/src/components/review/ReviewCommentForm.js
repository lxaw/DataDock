import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { addReviewComment, } from '../../actions/review.js';

const ReviewCommentForm = ({ review_id, auth, addReviewComment, onCommentAdded }) => {
  // id of the parent review that the comment goes on
  const [comment, setComment] = useState('');

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.preventDefault();
    addReviewComment({
      text: comment,
      review: review_id,
      author: auth.user.id
    })
      .then(newComment => {
        if (newComment) {
          onCommentAdded(newComment);
          setComment('');
        }
      })
      .catch(error => {
        console.error("Error adding comment:", error);
        // Handle error (e.g., show an error message to the user)
      });
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
            placeholder={'Write your comment...'}
          ></textarea>
        </div>
        <button className="btn btn-success">Submit</button>
      </form>
    </div>
  );
};

const mapStateToProps = (state) => ({
    auth:state.auth,
});

export default connect(mapStateToProps, {addReviewComment})(ReviewCommentForm);