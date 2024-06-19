import React, { useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { deleteReview } from "../../actions/review";
import { FaStar } from "react-icons/fa";
import ReviewCommentForm from "./ReviewCommentForm";

const Review = (props) => {
  const { reviewData, auth, deleteReview, refreshReviews } = props;
  const [showComments, setShowComments] = useState(false);

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
            <ReviewCommentForm review_id={reviewData.id} />
            <div className="mt-3">
              {reviewData.review_comments.map((comment) => (
                <div key={comment.id} className="border p-2 mb-2">
                  <p>{comment.text}</p>
                  <small>
                    <Link to={`/profile/${reviewData.author_username}`}>
                      {reviewData.author_username}
                    </Link>{" "}
                    - {reviewData.formatted_date}
                  </small>
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

export default connect(mapStateToProps, { deleteReview })(Review);