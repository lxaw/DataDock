import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { deleteReview, updateReviewComment, deleteReviewComment } from "../../actions/review";
import { FaStar } from "react-icons/fa";
import ReviewCommentForm from "./ReviewCommentForm";

const Review = (props) => {
  const { reviewData, auth, deleteReview, updateReviewComment, deleteReviewComment, refreshReviews } = props;
  const [showComments, setShowComments] = useState(false);
  const [reviewComments, setReviewComments] = useState([]);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState('');

  const handleDelete = () => {
    deleteReview(reviewData.id);
    setTimeout(refreshReviews, 200);
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <FaStar
          key={i}
          color={i < reviewData.rating ? "gold" : "gray"}
          className="mr-1"
        />
      );
    }
    return stars;
  };

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  const handleCommentAdded = (newComment) => {
    setReviewComments(prevComments => [...prevComments, newComment]);
  };

  const handleEditComment = (comment) => {
    setEditingCommentId(comment.id);
    setEditCommentText(comment.text);
  };

  const handleUpdateComment = (commentId) => {
    updateReviewComment(commentId, { text: editCommentText })
      .then((updatedComment) => {
        setReviewComments(prevComments =>
          prevComments.map(comment =>
            comment.id === commentId ? { ...comment, text: updatedComment.text } : comment
          )
        );
        setEditingCommentId(null);
      })
      .catch(error => console.error("Error updating comment:", error));
  };

  const handleDeleteComment = (commentId) => {
    deleteReviewComment(commentId)
      .then(() => {
        setReviewComments(prevComments =>
          prevComments.filter(comment => comment.id !== commentId)
        );
      })
      .catch(error => console.error("Error deleting comment:", error));
  };

  return (
    <div className="border p-3 m-3" data-testid="review-1">
      <div className="d-flex justify-content-between">
        <div>
          <p>
            <Link to={`/profile/${reviewData.author_username}`}>
              {reviewData.author_username}
            </Link>{" "}
            - {reviewData.formatted_date}
          </p>
          <h4>{reviewData.title}</h4>
        </div>
        <div className="d-flex">{renderStars()}</div>
      </div>
      <hr />
      <p className="text-wrap">{reviewData.text}</p>
      {auth.user.id === reviewData.author && (
        <div className="d-flex justify-content-between mt-3">
          <Link to={`/reviews/${reviewData.id}`}>
            <button className="btn btn-sm btn-outline-success">Edit</button>
          </Link>
          <button
            className="btn btn-sm btn-outline-danger"
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      )}
      <div className="mt-3">
        <button className="btn btn-link" onClick={toggleComments}>
          {showComments ? "Hide Comments" : "Show Comments"}
        </button>
        {showComments && (
          <div>
            <ReviewCommentForm 
              review_id={reviewData.id} 
              onCommentAdded={handleCommentAdded}
            />
            <div className="mt-3">
              {reviewComments.map((comment) => (
                <div key={comment.id} className="border p-2 mb-2">
                  {editingCommentId === comment.id ? (
                    <div>
                      <textarea
                        className="form-control mb-2"
                        value={editCommentText}
                        onChange={(e) => setEditCommentText(e.target.value)}
                      />
                      <button
                        className="btn btn-sm btn-primary mr-2"
                        onClick={() => handleUpdateComment(comment.id)}
                      >
                        Save
                      </button>
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => setEditingCommentId(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div>
                      <p>{comment.text}</p>
                      <small>
                        <Link to={`/profile/${comment.author_username}`}>
                          {comment.author_username}
                        </Link>{" "}
                        - {comment.formatted_date}
                      </small>
                      {auth.user.id === comment.author && (
                        <div className="mt-2">
                          <button
                            className="btn btn-sm btn-outline-primary mr-2"
                            onClick={() => handleEditComment(comment)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDeleteComment(comment.id)}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { deleteReview, updateReviewComment, deleteReviewComment })(Review);