import React, { useState } from 'react';
import { connect } from 'react-redux';
import { updateUser } from "../../actions/auth";
import OrganizationThumbnail from './OrganizationThumbnail';

const ProfileForm = (props) => {
  if (!props.auth.user.username) return null;

  const [userInfo, setUserInfo] = useState({
    username: props.auth.user.username,
    first_name: props.auth.user.first_name,
    last_name: props.auth.user.last_name,
    email: props.auth.user.email,
    bio: props.auth.user.bio,
    password: "",
    organizations: props.auth.user.followed_organizations,
    newOrgKey: ""
  });

  const onChange = (e) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };

  const parentOnRemoveOrg = (orgObj) => {
    setUserInfo({
      ...userInfo,
      organizations: userInfo.organizations.filter((item) => item !== orgObj)
    });
  };

  const parentOnPutBackOrg = (orgObj) => {
    setUserInfo({
      ...userInfo,
      organizations: [...userInfo.organizations, orgObj]
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    props.updateUser(userInfo);
  };

  return (
    <form onSubmit={onSubmit} data-testid="profile_form-1" className="my-4">
      <div className="row">
        <div className="col-md-6">
          <div className="mb-3">
            <label htmlFor="first_name" className="form-label">First Name</label>
            <input
              type="text"
              className="form-control"
              id="first_name"
              name="first_name"
              value={userInfo.first_name}
              onChange={onChange}
              placeholder="Enter your first name"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="last_name" className="form-label">Last Name</label>
            <input
              type="text"
              className="form-control"
              id="last_name"
              name="last_name"
              value={userInfo.last_name}
              onChange={onChange}
              placeholder="Enter your last name"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={userInfo.email}
              onChange={onChange}
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">Username</label>
            <input
              type="text"
              className="form-control"
              id="username"
              name="username"
              value={userInfo.username}
              onChange={onChange}
              placeholder="Enter your username"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              value={userInfo.password}
              onChange={onChange}
              placeholder="Enter a new password or leave blank for no change"
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="mb-3">
            <label htmlFor="textareaBio" className="form-label">Bio</label>
            <textarea
              id="textareaBio"
              className="form-control"
              name="bio"
              value={userInfo.bio}
              onChange={onChange}
              placeholder="Write a little bit about yourself, your work, or your interests"
              rows="4"
            ></textarea>
          </div>
          <div className="mb-3">
            <label className="form-label">Currently Followed Organizations</label>
            {props.auth.user.followed_organizations.length === 0 ? (
              <p>Not part of any Organizations</p>
            ) : (
              <div className="row">
                {props.auth.user.followed_organizations.map((orgObj, index) => (
                  <div className="col-md-6 mb-3" key={index}>
                    <OrganizationThumbnail
                      org={orgObj}
                      parentOnPutBackOrg={parentOnPutBackOrg}
                      parentOnRemoveOrg={parentOnRemoveOrg}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="newOrgKey" className="form-label">Join Organization via Secret Key</label>
            <input
              type="password"
              className="form-control"
              id="newOrgKey"
              name="newOrgKey"
              value={userInfo.newOrgKey}
              onChange={onChange}
              autoComplete="new-password"
              placeholder="Enter the key of an organization you wish to join, or leave blank for no change"
            />
            <small className="form-text text-muted">
              All organizations have a secret key; admins of the organizations will provide the key to you if you
              are supposed to be in the organization.
            </small>
          </div>
        </div>
      </div>
      <div>
        <button type="submit" className="btn btn-primary">Update Information</button>
      </div>
    </form>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth
});

export default connect(mapStateToProps, { updateUser })(ProfileForm);