/**
 * Delta Project
 *
 * Authors:
 * Lexington Whalen (@lxaw)
 * Carter Marlowe (@Cmarlowe123)
 * Vince Kolb-Lugo (@vancevince)
 * Blake Seekings (@j-blake-s)
 * Naveen Chithan (@nchithan)
 *
 * Review.js
 *
 * Review component that will be displayed under files
 * Each Review shows the data associated with that review
 * such as the author, title, and the text for it
 * Users who create a review can also edit or delete the review
 * and the author's name links to their profile.
 */
import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { deleteReview } from "../../actions/review";

import StarSvg from "./StarSvg";

const Review = (props) => {
  const activeStar = { fill: "yellow" };

  var arrStars = [];
  for (let i = 0; i < 5; i++) {
    arrStars.push(
      <StarSvg style={i < props.reviewData.rating ? activeStar : {}} />
    );
  }

  /* UTILITY: Deletes the Review that a user is selecting to delete.
   * INPUTS: Takes in the ID of the review that is going to be deleted.
   * OUTPUTS: Deletes the selected Review.
   */
  const handleDelete = (e) => {
    props.deleteReview(props.reviewData.id);
    setTimeout(() => {
      props.refreshReviews();
    }, 200);
  };

  return (
    <div className="container border p-3 m-3" data-testid="review-1">
      <div>
        <div className="d-flex flex-row">
          {arrStars.map((starSvg) => starSvg)}
        </div>
        <h4>{props.reviewData.title}</h4>
      </div>
      <div>
        <h5>
          Reviewed by{" "}
          <Link to={`/profile/${props.reviewData.author_username}`}>
            {props.reviewData.author_username}
          </Link>{" "}
          on {props.reviewData.formatted_date}
        </h5>
      </div>
      <hr />
      <div style={{inlineSize:"100%",overflowWrap:"break-word"}}>
        <p>{props.reviewData.text}</p>
      </div>
      {props.auth.user.id == props.reviewData.author && (
        <div className="d-flex justify-content-between">
          <Link to={`/reviews/${props.reviewData.id}`}>
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
