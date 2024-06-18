import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { markReadNotificationReview } from '../../actions/notification';
import styled from 'styled-components';
import { FaStar,FaCheck } from 'react-icons/fa';

const CardContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const IconContainer = styled.div`
  width: 20%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ContentContainer = styled.div`
  width: 80%;
  padding-left: 16px;
`;

const NotificationReview = (props) => {
  const [style, setStyle] = useState({});

  const handleRead = () => {
    props.markReadNotificationReview(props.data.id);
    setStyle({ display: 'none' });
  };

  return (
    <CardContainer style={style} data-testid="notification_review-1">
      <IconContainer>
        <FaStar size={32} color="#888" />
      </IconContainer>
      <ContentContainer>
        <div className="d-flex justify-content-between">
          <div>
            <strong>
              Notification from{' '}
              <Link to={`/profile/${props.data.sender_username}`}>
                {props.data.sender_username}
              </Link>
            </strong>
          </div>
          <div>
            <p>{props.data.formatted_date}</p>
          </div>
        </div>
        <div>
          <p>{props.data.text}</p>
        </div>
        <div>
          <Link to={`/csvs/${props.data.file_id}`}>See file</Link>
        </div>
        <div>
          <button onClick={handleRead} className="btn btn-sm btn-success">
            <FaCheck size={16} color="#fff" /> Got it
          </button>
        </div>
      </ContentContainer>
    </CardContainer>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { markReadNotificationReview })(
  NotificationReview
);