import React, { useState } from 'react';
import styles from '../DataSets/ReviewDetail.module.css';
import Star from '../DataSets/Star';

const StarRating = ({ numStars = 5 }) => {
  const [ratingIndex, setRatingIndex] = useState(null);

  const RATINGS = Array.from({ length: numStars }, (_, i) => {
    switch (i) {
      case 0:
        return 'Poor';
      case 1:
        return 'Fair';
      case 2:
        return 'Good';
      case 3:
        return 'Very good';
      case 4:
        return 'Excellent';
      default:
        return '';
    }
  });

  const activeStar = { fill: 'gold' };

  const changeRatingIndex = (index) => {
    setRatingIndex(index);
  };

  return (
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
    </div>
  );
};

export default StarRating;