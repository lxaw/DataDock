import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import MessageForm from './MessageForm';
import MessageTable from './MessageTable';

const ConversationDetail = (props) => {
  const { id } = useParams();
  const [convo, setConvo] = useState(null);
  var otherUserUsername = null;

  const getData = () => {
    axios
      .get(`/api/conversation/${id}/`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${props.auth.token}`,
        },
      })
      .then((res) => {
        setConvo(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getData();
  }, []);

  if (convo == null) return;

  if (props.auth.user.username !== convo.author_username) {
    otherUserUsername = convo.author_username;
  } else {
    otherUserUsername = convo.other_user_username;
  }

  return (
    <div className="container py-5">
      <div className="row">
        <div>
          <div className="card shadow-lg">
            <div className="card-body">
              <h1 className="card-title mb-4">Conversation Detail</h1>
              <div className="mb-4">
                <h5>Title: {convo.title}</h5>
                <p className="text-muted">Started: {convo.pub_date}</p>
                <p>
                  Other user:{' '}
                  <Link
                    to={`/profile/${otherUserUsername}`}
                    className="text-primary"
                  >
                    {otherUserUsername}
                  </Link>
                </p>
              </div>
              <div>
                <h5 className="mb-3">Messages</h5>
                <MessageTable
                  messages={convo.messages}
                  user={props.auth.user}
                />
                <MessageForm
                  convoId={convo.id}
                  refresh={getData}
                  otherUserUsername={otherUserUsername}
                  author_id={props.auth.user.id}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, {})(ConversationDetail);