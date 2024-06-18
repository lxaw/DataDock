import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaRocket } from 'react-icons/fa';

const CardContainer = styled.div`
  position: relative;
  width: 200px;
  height: 200px;
  border-radius: 10px;
  background-color: #fff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease-in-out;
  display: inline-block;
  margin-right: 10px;

  &:hover {
    transform: translateY(-5px);
  }
`;

const CardBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #ccc;
  font-size: 60px;
`;

const CardContent = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 20px;
  text-align: center;
`;

const OrganizationCard = (props) => {
  return (
    <CardContainer>
      <CardBackground>
        <FaRocket />
      </CardBackground>
      <Link to={`/community/organizations/${props.orgObj.id}`} style={{ textDecoration: 'none' }}>
        <CardContent>
          {props.imgSrc !== undefined && (
            <div>
              <img src={props.imgSrc} className="card-img-top" alt={`Image for ${props.orgObj.name}`} />
            </div>
          )}
          <h5 className="card-title">{props.orgObj.name}</h5>
        </CardContent>
      </Link>
    </CardContainer>
  );
};

export default OrganizationCard;