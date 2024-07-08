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

import styles from "./ReviewDetail.module.css";
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

  /* UTILITY: Retrieves the data of the current review. */
  const getData = () => {
    axios
      .get(`/api/review/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${props.auth.token}`,
        },
      })
      .then((res) => {
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

  /* UTILITY: Runs when part of the review is changed. */
  const onChange = (e) => {
    const newState = { ...reviewData, [e.target.name]: e.target.value };
    
    if(e.target.name == "title"){
      setTitleLength(e.target.value.length);
    }
    else if(e.target.name=="text"){
      setDescLength(e.target.value.length);
    }
    
    setReviewData(newState);
  };

  /* UTILITY: Runs when the form is submitted and updates the data of the review. */
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
  const activeStar = { fill: "gold" };

  /* UTILITY: Increases the rating's index by 1. */  
  const changeRatingIndex = (index) => {
    setRatingIndex(index);
    const newState = { ...reviewData, rating: parseInt(index) + 1 };
    setReviewData(newState);
  };

  return (
    <div className={styles.container} data-testid="review_detail-1">
      <form onSubmit={onSubmit} className={styles.form}>
        <div className={styles.ratingContainer}>
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
          <p className={styles.ratingText}>
            Rating: {RATINGS[ratingIndex] || "No rating yet"}
          </p>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="title" className={styles.label}>
            Title
          </label>
          <input
            className={styles.input}
            id="title"
            name="title"
            onChange={onChange}
            value={reviewData.title}
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
            value={reviewData.text}
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

      <Link to={`/datasets/${reviewData.dataset}`} className={styles.backLink}>
        Back
      </Link>
    </div>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { updateReview })(ReviewDetail);