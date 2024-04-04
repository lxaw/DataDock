/**
 * Delta Project
 *
 * Authors:
 * Lexington Whalen (@lxaw)
 * Gives a more detailed view of the data held inside of a csv file, and the reviews of a file.
 * Displays reviews under a file and allows users to create a review
 */

import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { getCsvFile, deleteCsvFile } from "../../actions/file";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

// components
import ReviewForm from "./ReviewForm";
import Review from "./Review";
import CsvFile from "./CsvFile";

const CsvFileDetail = (props) => {
  const { id } = useParams();
  const [csvFile, setCsvFile] = useState(null);
  const [arrReviews, setArrReviews] = useState([]);

  const retrieveData = () => {
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

  if (csvFile == null) return <div data-testid="csv_file_detail-1"></div>;

  return (
    <div className="container" data-testid="csv_file_detail-1">
      <div className="row">
        <div className="col-8">
          <div className="product-image">
            <CsvFile data={csvFile} />
          </div>
        </div>
        <div className="col-4">
          <div className="product-details">
            <h1>{csvFile.name}</h1>
            <div className="rating">
              <h5>{csvFile.avg_rating} out of 5</h5>
              <h5>{csvFile.num_reviews} customer reviews</h5>
            </div>
            <hr />
            <div className="add-to-cart">
              <button className="btn btn-primary">Add to Cart</button>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <hr />
          <h3>Reviews</h3>
          <ReviewForm csvFileId={id} handleSubmit={retrieveData} />
          <div className="reviews">
            {arrReviews.map((data) => (
              <Review reviewData={data} refreshReviews={retrieveData} key={data.id} />
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