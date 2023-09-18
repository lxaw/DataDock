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
 * ReviewDetail.js
 *
 * The detailed showing of the data in a review.
 * Grabs all the data of a review and displays it on a form
 * Information can also be changed and submitted
 */
import axios from "axios";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { updateReview } from "../../actions/review";

import styles from "./cssFile.module.css";
import Star from "./Star";

const ReviewDetail = (props) => {
  if (props.auth.user.id == undefined) return;

  const [reviewData, setReviewData] = useState(null);
  const [ratingIndex, setRatingIndex] = useState(null);

  // length restrictions
  const TITLE_CHAR_LENGTH_MAX = 50;
  const DESC_CHAR_LENGTH_MAX = 250;

  // text input lengths
  const [titleLength,setTitleLength] = useState(0);
  const [descLength,setDescLength] = useState(0);

  const { id } = useParams();

  /* UTILITY: Retrieves the data of the current review.
   * INPUTS: Makes use of the review id.
   * OUTPUTS: sets the data of the review and the index of the review.
   */
  const getData = () => {
    axios
      .get(`/api/review/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${props.auth.token}`,
        },
      })
      .then((res) => {
        console.log(res.data);
        setReviewData(res.data);
        setRatingIndex(res.data.rating - 1);
        setDescLength(res.data.text.length);
        setTitleLength(res.data.title.length);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getData();
  }, []);

  /* UTILITY: Runs when part of the review is changed.
   * INPUTS: Newly updated information from the review.
   * OUTPUTS: Updated review.
   */
  const onChange = (e) => {
    const newState = { ...reviewData, [e.target.name]: e.target.value };
    // character limits
    if(e.target.name == "title"){
      const curLength = e.target.value.length;
      setTitleLength(curLength);
    }
    else if(e.target.name=="text"){
      // description
      const curLength = e.target.value.length;
      setDescLength(curLength);
    }
    setReviewData(newState);
  };

  /* UTILITY: Runs when the form is submitted and updates the data of the review.
   * INPUTS: Takes in the information from the review.
   * OUTPUTS: Review with the updated information.
   */
  const onSubmit = (e) => {
    e.preventDefault();
    if(reviewData.title.length ==0 && reviewData.text.length==0){
      alert("Please add text to the title and description.");
      return;
    }else if(reviewData.text.length == 0){
      alert("Please add text to the description.");
      return;
    }else if(reviewData.title.length == 0){
      alert("Please add text to the title.");
      return;
    }
    props.updateReview({
      id: reviewData.id,
      title: reviewData.title,
      text: reviewData.text,
      rating: reviewData.rating,
    });
  };

  if (reviewData == null) return <div data-testid="review_detail-1"></div>;

  const RATINGS = ["Poor", "Fair", "Good", "Very good", "Excellent"];
  const activeStar = {
    fill: "yellow",
  };

  /* UTILITY: Increases the rating's index by 1.
   * INPUTS: Takes in the index of the rating.
   * OUTPUTS: Updated review state with increased rating index.
   */
  const changeRatingIndex = (index) => {
    setRatingIndex(index);
    const newState = { ...reviewData, rating: parseInt(index) + 1 };
    setReviewData(newState);
  };

  return (
    <div className="container" dadta-testid="review_detail-1">
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <div className="d-flex justify-content-between">
            <div className={styles.stars}>
              {RATINGS.map((rating, index) => (
                <Star
                  key={index}
                  index={index}
                  changeRatingIndex={changeRatingIndex}
                  style={ratingIndex >= index ? activeStar : {}}
                />
              ))}
            </div>
            <div>
              <p>
                Rating:{" "}
                {RATINGS[ratingIndex]
                  ? RATINGS[ratingIndex]
                  : "No rating present yet."}
              </p>
            </div>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            className="form-control"
            id="title"
            name="title"
            onChange={onChange}
            value={reviewData.title}
            maxLength={TITLE_CHAR_LENGTH_MAX}
          />
          <small id="titleHelp">Add a descriptive title ({TITLE_CHAR_LENGTH_MAX - titleLength} remaining characters).</small>
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            type="text"
            className="form-control"
            id="description"
            onChange={onChange}
            name="text"
            value={reviewData.text}
            maxLength={DESC_CHAR_LENGTH_MAX}
          />
          <small id="descriptionHelp">Add a description ({DESC_CHAR_LENGTH_MAX-descLength} remaining characters).</small>
        </div>
        <button type="submit" className="btn btn-outline-success">
          Submit
        </button>
      </form>
      <br />
      <div>
        <Link to={`/csvs/${reviewData.file}`} className="btn btn-danger">
          Back
        </Link>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { updateReview })(ReviewDetail);
