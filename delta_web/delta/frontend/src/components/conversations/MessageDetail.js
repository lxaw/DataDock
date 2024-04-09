import React from 'react';
import { Link } from 'react-router-dom';

const MessageDetail = (props) => {
  return (
    <div className="card mb-3">
      <div className="card-body">
        <div className="d-flex align-items-center mb-2">
          <img
            src={`https://ui-avatars.com/api/?name=${props.author_username}&background=random&size=32`}
            alt={props.author_username}
            className="rounded-circle me-2"
          />
          <div>
            <Link to={`/profile/${props.author_username}`} className="text-primary fw-bold">
              {props.author_username}
            </Link>
            <small className="text-muted ms-2">{props.date}</small>
          </div>
        </div>
        <p className="card-text">{props.text}</p>
      </div>
    </div>
  );
};

export default MessageDetail;