// Mock dataset
const cartItems = [
  {
    id: 1,
    name: "Customer Satisfaction Survey",
    description: "A comprehensive dataset of customer satisfaction survey responses.",
    author_username: "datamaster",
    formatted_date: "April 9, 2024",
    download_count: 250,
    tags: [
      { text: "customer" },
      { text: "satisfaction" },
      { text: "survey" },
    ],
  },
  {
    id: 2,
    name: "Sales Trends 2023",
    description: "Monthly sales data for various product categories in 2023.",
    author_username: "salesguru",
    formatted_date: "March 15, 2024",
    download_count: 175,
    tags: [
      { text: "sales" },
      { text: "trends" },
      { text: "2023" },
    ],
  },
  {
    id: 3,
    name: "Social Media Engagement Metrics",
    description: "Dataset containing social media engagement metrics for popular brands.",
    author_username: "socialanalytics",
    formatted_date: "February 28, 2024",
    download_count: 320,
    tags: [
      { text: "social media" },
      { text: "engagement" },
      { text: "metrics" },
    ],
  },
];

// Modified Cart component
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { getCartItems } from '../../actions/file';
import tag_styles from "../data_transfer/tags.module.css";

const Cart = (props) => {
  const [arrCartItems, setArrCartItems] = useState([]);

  useEffect(() => {
    // Simulating the API call with the mock dataset
    setArrCartItems(cartItems);
  }, []);

  const handleDownload = () => {
    // Implement the download functionality here
    console.log("Download clicked");
  };

  const handleRemove = (itemId) => {
    // Remove the item from the cart
    const updatedCartItems = arrCartItems.filter((item) => item.id !== itemId);
    setArrCartItems(updatedCartItems);
  };

  return (
    <div className="container">
      <h1>Your Cart</h1>
      <div className="row">
        <div className="col-md-3">
          <div className="card p-3">
            <h4>Download Summary</h4>
            <p>Number of files: {arrCartItems.length}</p>
            <button className="btn btn-primary" onClick={handleDownload}>
              Download Selected Items
            </button>
          </div>
        </div>
        <div className="col-md-9">
          <div style={{ maxHeight: '80%', overflowY: 'auto' }}>
            {arrCartItems.map((item) => (
              <div key={item.id} className="card mb-3">
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <div>
                      <h5 className="card-title">{item.name}</h5>
                      <p className="card-text">{item.author_username} - {item.formatted_date}</p>
                    </div>
                    <button
                      className="btn btn-link text-danger p-0"
                      style={{ background: 'none', border: 'none' }}
                      onClick={() => handleRemove(item.id)}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                  <div>
                    <p className="card-text">{item.description}</p>
                    <small>Download count: {item.download_count}</small>
                  </div>
                  <div className="mt-2">
                    {item.tags.map((tag, index) => (
                      <span key={index} className={`${tag_styles.tag_item} me-1`}>
                        {tag.text}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
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

export default connect(mapStateToProps, { getCartItems })(Cart);