import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { getCsvFile, deleteCsvFile, addToCart } from "../../actions/file";
import { useParams } from "react-router-dom";
import axios from "axios";
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

  const addFileToCart = () => {
    const dictData = {
      'file_id':id
    }
    props.addToCart(dictData)
  }

  useEffect(() => {
    retrieveData();
  }, []);

  if (!csvFile) return <div data-testid="csv_file_detail-1"></div>;

  return (
    <div className="container my-4" data-testid="csv_file_detail-1">
      <div className="row">
        <div className="col-md-8">
          <CsvFile data={csvFile} />
        </div>
        <div className="col-md-4">
          <h2>{csvFile.name}</h2>
          <div className="rating mb-3">
            <h5>{csvFile.avg_rating} out of 5</h5>
            <h6 className="text-muted">{csvFile.num_reviews} reviews</h6>
          </div>
          <hr />
          <button className="btn btn-primary w-100" onClick={addFileToCart}>
            Add to Cart
          </button>
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-md-12">
          <h3>Reviews</h3>
          <ReviewForm csvFileId={id} handleSubmit={retrieveData} />
          <hr />
          <div className="reviews">
            {arrReviews.map((data) => (
              <Review key={data.id} reviewData={data} refreshReviews={retrieveData} />
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

export default connect(mapStateToProps, { getCsvFile, deleteCsvFile,addToCart})(CsvFileDetail);