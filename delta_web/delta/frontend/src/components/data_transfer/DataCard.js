import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import styles from "./tags.module.css";
import { FaStar,FaArrowDown } from 'react-icons/fa';

const DataCard = ({ data}) => {
  const cardStyle = {
    transition: 'background-color 0.3s',
    height: '20rem',
    width: '26rem',
    margin:'0.5rem'
  };

  const descriptionStyle = {
    height: '6rem',
    overflowY: 'auto',
    paddingRight: '1rem',
  };

  const renderStars = (rating) =>{
    var stars = []
    if(rating == 0){
      stars = Array.from({ length: 5 }, (_, i) => (
      <FaStar
        key={i}
        color={i <= rating ? "gold" : "gray"}
        className="mr-1"
      />
      ));
    }
    else{
      if(rating == 0){
        // not rated yet
        stars = [<FaStar color={"gray"} className="mr-1"/>]
      }
      for (let i=0;i<5;i++){
        stars.push(
          <FaStar
            key={i}
            color={i <= rating ? "gold":"gray"}
            className="mr-1"
          />
        )
      }
    }
    return stars
  }

  return (
    <span style = {{textDecoration:'none',color:'inherit'}}
    >
      <div className="card" style={cardStyle} data-testid="data_card-1">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-start mb-3">
            <div>
              <h5 className="card-title">{data.name}</h5>
              <div className="d-flex">{renderStars(data.avg_rating-1)}</div>
            </div>
            <div className="d-flex align-items-center position-relative">
              <FaArrowDown className="text-muted" style={{ fontSize: '1.5rem' }} />
              <span className="position-absolute top-50 start-50 translate-middle badge bg-secondary">
                {data.download_count}
              </span>
            </div>
            <div className="text-end">
              <Link to={`/profile/${data.author_username}`}>
                {data.author_username}
              </Link>
              <div className="text-muted">{data.formatted_date}</div>
            </div>
          </div>
          <p className="card-text" style={descriptionStyle}>
            {data.description}
          </p>
          <div className="row mt-auto">
            <div className="col-8">
              <strong>Tags:</strong>
              <div className="mt-1">
                {data.tags.map((tag, index) => (
                <div className={styles.tag_item} key={index}>
                  <span className={styles.text}>{tag.text}</span>
                </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </span>
  );
};

export default DataCard;