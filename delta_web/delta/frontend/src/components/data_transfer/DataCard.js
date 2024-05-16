import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import styles from "./tags.module.css";

const DataCard = ({ data}) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardStyle = {
    backgroundColor: isHovered ?'#f5f5f5':'white',
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

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <Link to={`/csvs/${data.id}`} style = {{textDecoration:'none',color:'inherit'}}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
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
          </div>
        </div>
      </div>
    </Link>
  );
};

export default DataCard;