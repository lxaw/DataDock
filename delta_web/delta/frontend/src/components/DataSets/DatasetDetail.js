import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { getDataset, deleteDataset } from "../../actions/datasets";
import { addToCart } from "../../actions/cart";
import { useParams } from "react-router-dom";
import axios from "axios";
import ReviewForm from "./ReviewForm";
import Review from "./Review";
import Dataset from "./Dataset";

const DatasetDetail = (props) => {
  const { id } = useParams();
  const [csvFile, setDataset] = useState(null);
  const [arrReviews, setArrReviews] = useState([]);

  const retrieveData = () => {
    axios
      .get(`/api/datasets/${id}/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${props.auth.token}`,
        },
      })
      .then((res) => {
        setDataset(res.data);
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
          <Dataset data={csvFile} />
        </div>
        <div className="col-md-4">
  <h2>{csvFile.name}</h2>
  <div className="rating mb-3">
    <h5>{csvFile.avg_rating} out of 5</h5>
    <h6 className="text-muted">{csvFile.num_reviews} reviews</h6>
  </div>
    <div className="file-info mb-3">
      <h6>Files:</h6>
      <p>{csvFile.files.length} file(s)</p>
      <div
        className="file-list"
        style={{
          maxHeight: '150px', // Set the maximum height for the scrollable area
          overflowY: 'auto', // Enable vertical scrolling
        }}
      >
        <ul className="list-unstyled">
          {csvFile.files.map((file, index) => (
            <li key={index} className="mb-2">
              <span>{file.file_name.split('.')[0]}</span>{' '}
              <small>({file.file_name.split('.').pop()})</small>
            </li>
          ))}
        </ul>
      </div>
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

export default connect(mapStateToProps, { getDataset, deleteDataset,addToCart})(DatasetDetail);