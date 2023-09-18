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
 * CsvFileDetail.js
 *
 * Gives a more detailed view of the data held inside of a csv file, and the reviews of a file.
 * Displays reviews under a file and allows users to create a review
 */

import React, { useState } from "react";
import { connect } from "react-redux";
import { getCsvFile, deleteCsvFile } from "../../actions/file";
import { useEffect } from "react";

import { Link, useParams } from "react-router-dom";
import axios from "axios";

// components
import ReviewForm from "./ReviewForm";
import Review from "./Review";
import CsvFile from "./CsvFile";

const CsvFileDetail = (props) => {
  const { id } = useParams();
  // the csv file itself
  const [csvFile, setCsvFile] = useState(null);
  // the reviews themself
  const [arrReviews, setArrReviews] = useState([]);

  /*UTILITY: Retreieves the csv file data for the file selected.
   *INPUTS: Takes in the id of the file.
   *OUTPUTS: Sets the csv file data and the review data for the csv file.
   */
  const retrieveData = () => {
    // get the csv data
    axios
      .get(`/api/csv/${id}/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${props.auth.token}`,
        },
      })
      .then((res) => {
        setCsvFile(res.data);
        setArrReviews(res.data.reviews);
      });
  };

  useEffect(() => {
    retrieveData();
  }, []);

  // should return some spinner
  if (csvFile == null) return <div data-testid="csv_file_detail-1"></div>;

  return (
    <div className="container" data-testid="csv_file_detail-1">
      <CsvFile csvFileData={csvFile} />
      <div className="">
        <h3>Add a review?</h3>
        <ReviewForm csvFileId={id} handleSubmit={retrieveData} />
      </div>
      <div className="row">
        <div className="col-4">
          <h1>Review Stats</h1>
          <div>
            <h5>{csvFile.avg_rating} out of 5</h5>
            <h5>{csvFile.review_count} review(s)</h5>
          </div>
        </div>
        <div className="col-8">
          <div className="overflow-scroll" style={{ height: "20rem" }}>
            {arrReviews.map((data) => (
              <Review
                reviewData={data}
                refreshReviews={retrieveData}
                key={data.id}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { getCsvFile, deleteCsvFile })(
  CsvFileDetail
);
