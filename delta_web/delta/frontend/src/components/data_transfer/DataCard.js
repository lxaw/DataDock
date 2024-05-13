import React from 'react';
import { Link } from 'react-router-dom';
import styles from "./tags.module.css";

const DataCard = ({ data, isDownload, link, linkText }) => {
  const cardStyle = {
    backgroundColor: isDownload ? '#cce6ff' : 'white',
    transition: 'background-color 0.3s',
    height: '20rem',
    width: '30rem',
  };

  const descriptionStyle = {
    height: '6rem',
    overflowY: 'auto',
    paddingRight: '1rem',
  };

  const tagStyle = {
    display: 'inline-block',
    backgroundColor: '#f0f0f0',
    color: '#333',
    borderRadius: '4px',
    marginRight: '4px',
    marginBottom: '4px',
  };

  return (
    <div className="card" style={cardStyle} data-testid="data_card-1">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <h5 className="card-title">{data.name}</h5>
            <div>Rating: {data.avg_rating}</div>
            <div>Download count: {data.download_count}</div>
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
          <div className="col-4 d-flex justify-content-end align-items-end">
            <Link to={link} className="btn btn-sm btn-primary">
              {linkText}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataCard;