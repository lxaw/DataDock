import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaCommentAlt } from 'react-icons/fa';

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

const ConversationCard = (props) => {
  return (
    <CardContainer>
      <IconContainer>
        <FaCommentAlt size={32} color="#888" />
      </IconContainer>
      <ContentContainer>
        <p>{props.convoObj.pub_date}</p>
        <p>{props.convoObj.title}</p>
        <Link to={`/messages/conversations/${props.convoObj.id}`}>View</Link>
      </ContentContainer>
    </CardContainer>
  );
};

export default ConversationCard;