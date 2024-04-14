import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { deleteReview } from "../../actions/review";
import { FaStar } from "react-icons/fa";

const Review = (props) => {
  const { reviewData, auth, deleteReview, refreshReviews } = props;

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
    </div>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { deleteReview })(Review);