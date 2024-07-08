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
 * ReviewForm.js
 *
 * Details the form used to create a new review
 * Displays all of the information used for a review and gives
 * an area for the user to input the information.
 * Also contains a 5 star scale selection for the rating of the review.
 */
import React from "react";
import Star from "./Star";

import { useState } from "react";

import styles from "./ReviewForm.module.css";
import { connect } from "react-redux";
import { addReview } from "../../actions/review";

const ReviewForm = (props) => {
  const id = props.csvFileId;

  // length restrictions
  const TITLE_CHAR_LENGTH_MAX = 50;
  const DESC_CHAR_LENGTH_MAX = 250;

  // text input lengths
  const [titleLength,setTitleLength] = useState(0);
  const [descLength,setDescLength] = useState(0);

  const [reviewState, setReviewState] = useState({
    title: "",
    text: "",
    rating: 5,
    dataset: `${id}`,
    author: `${props.auth.user.id}`,
  });

  /* UTILITY: Updates the review when individual pieces of the review are changed. */
  const onChange = (e) => {
    const newState = { ...reviewState, [e.target.name]: e.target.value };
    
    if(e.target.name == "title"){
      setTitleLength(e.target.value.length);
    }
    else if(e.target.name=="text"){
      setDescLength(e.target.value.length);
    }
    
    setReviewState(newState);
  };

  /* UTILITY: Generates and adds the review upon submission. */
  const onSubmit = (e) => {
    e.preventDefault();
    
    if(reviewState['title'].length ==0 && reviewState['text'].length==0){
      alert("Please add text to the title and description.");
      return;
    }else if(reviewState['text'].length == 0){
      alert("Please add text to the description.");
      return;
    }else if(reviewState['title'].length == 0){
      alert("Please add text to the title.");
      return;
    }
    
    props.addReview(reviewState);
    setTimeout(() => {
      props.handleSubmit();
    }, 200);
  };

  const RATINGS = ["Poor", "Fair", "Good", "Very good", "Excellent"];
  const [ratingIndex, setRatingIndex] = useState(4);
  const activeStar = { fill: "gold" };

  /* UTILITY: Changes the index of the rating, increasing it by one. */
  const changeRatingIndex = (index) => {
    setRatingIndex(index);
    const newState = { ...reviewState, rating: parseInt(index) + 1 };
    setReviewState(newState);
  };

  return (
    <form onSubmit={onSubmit} className={styles.form} data-testid="review_form-1">
      <div className={styles.ratingContainer}>
        <div className={styles.stars}>
          {RATINGS.map((rating, index) => (
            <Star
              index={index}
              key={rating}
              changeRatingIndex={changeRatingIndex}
              style={ratingIndex >= index ? activeStar : {}}
            />
          ))}
        </div>
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="title" className={styles.label}>
          Review Title
        </label>
        <input
          className={styles.input}
          id="title"
          name="title"
          onChange={onChange}
          maxLength={TITLE_CHAR_LENGTH_MAX}
        />
        <small className={styles.helperText}>
          Add a descriptive title ({TITLE_CHAR_LENGTH_MAX - titleLength} characters left)
        </small>
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="description" className={styles.label}>
          Description
        </label>
        <textarea
          className={styles.textarea}
          id="description"
          onChange={onChange}
          name="text"
          maxLength={DESC_CHAR_LENGTH_MAX}
        />
        <small className={styles.helperText}>
          Add a description ({DESC_CHAR_LENGTH_MAX - descLength} characters left)
        </small>
      </div>

      <button type="submit" className={styles.submitButton}>
        Submit
      </button>
    </form>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { addReview })(ReviewForm);