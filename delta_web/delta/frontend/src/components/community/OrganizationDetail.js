import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { connect } from 'react-redux';
import DataSetTable from "../data_transfer/DataSetTable";
import styled from 'styled-components';
import { FaRocket, FaUsers, FaFileAlt, FaChevronLeft } from 'react-icons/fa';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 2rem;
  color: #333;
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  margin-right: 1rem;
`;

const Description = styled.p`
  font-size: 1.2rem;
  line-height: 1.5;
  color: #666;
`;

const StatsContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
`;

const Stat = styled.div`
  display: flex;
  align-items: center;
  margin-right: 2rem;
`;

const StatIcon = styled.div`
  margin-right: 0.5rem;
`;

const BackButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  color: #666;
  font-size: 1rem;
  margin-top: 2rem;

  &:hover {
    color: #333;
  }
`;

const IconBack = styled(FaChevronLeft)`
  margin-right: 0.5rem;
`;

const OrganizationDetail = (props) => {
  const [data, setData] = useState(null);
  const [dataPosts, setDataPosts] = useState(null);
  const { id } = useParams();

  const getData = () => {
    axios.get(`/api/organization/${id}/`)
      .then((res) => {
        setData(res.data);
      })
  }

  const getPosts = () => {
    axios.get(`/api/organization/${id}/data_posts/`, { headers: { 'Content-Type': 'application/json', 'Authorization': `Token ${props.auth.token}` } })
      .then((res) => {
        console.log(res)
        setDataPosts(res.data);
      })
  }

  useEffect(() => {
    getData();
    getPosts();
  }, []);

  if (data == null || dataPosts == null) return <div data-testid="organization_detail-1"></div>;

  return (
    <Container data-testid="organization_detail-1">
      <Header>
        <IconContainer>
          <FaRocket size={32} color="#333" />
        </IconContainer>
        <Title>{data.name}</Title>
      </Header>
      <StatsContainer>
        <Stat>
          <StatIcon>
            <FaUsers size={20} color="#666" />
          </StatIcon>
          {data.following_user_count} users
        </Stat>
        <Stat>
          <StatIcon>
            <FaFileAlt size={20} color="#666" />
          </StatIcon>
          {dataPosts.length} Data Sets
        </Stat>
      </StatsContainer>
      <Description>{data.description}</Description>
      <h4>All files under this organization</h4>
      <small>When you upload a file, you can set it to be under any of the organizations you are also a part of.</small>
      <DataSetTable dataSets={dataPosts} textMinLength={3} />
      <BackButton to="/community/organizations">
        <IconBack />
        Back to Organizations
      </BackButton>
    </Container>
  );
}

const mapStateToProps = state => ({
  auth: state.auth,
})

export default connect(mapStateToProps, {})(OrganizationDetail);