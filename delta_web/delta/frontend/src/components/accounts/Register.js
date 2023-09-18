/*
###############################################################################

Delta project

Authors:
Lexington Whalen (@lxaw)
Carter Marlowe (@Cmarlowe132)
Vince Kolb-LugoVince (@vancevince) 
Blake Seekings (@j-blake-s)
Naveen Chithan (@nchithan)

File name:  Register.js

Brief description: 
    This file defines the layout of registration page and allows the user to
create an account.

###############################################################################
*/



import React, { Component } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from "prop-types";
import { register } from '../../actions/auth';
import { createMessage } from "../../actions/messages"
import ImageCarousel from "../carousel/ImageCarousel"

export class Register extends Component {
  state = {
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    password2: '',
    organization_key: '',
  };

  static propTypes = {
    register: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool
  }

  // UTILITY: Determines how an account is created when the user hits submit.
  onSubmit = e => {
    e.preventDefault();
    // pull the password and password2 from the state
    const { username, first_name, last_name, email, password, password2, organization_key } = this.state;
    if (password != password2) {
      this.props.createMessage({ passwordsDoNotMatch: 'Passwords do not match' })
    } else if (first_name === '' || last_name === '' || email === '') {
      this.props.createMessage({ passwordsDoNotMatch: 'Please fill all fields' })
    }
    else {
      // format a new user
      const newUser = {
        username,
        first_name,
        last_name,
        password,
        email,
        organization_key
      }
      // call register action
      this.props.register(newUser);
    }
  }

  onChange = e => this.setState({ [e.target.name]: e.target.value });

  render() {
    // redirect if you are already logged in
    if (this.props.isAuthenticated) {
      return <Navigate to="/" />;
    }
    const { username, first_name, last_name, email, password, password2, organization_key } = this.state;
    // form
    return (
      <div className="container">
        <div className="row">
          <div className="col">
            <ImageCarousel />
          </div>

          <div className="col">
            <div className="card card-body mt-5">
              <h2 className="text-center">Register</h2>
              <form onSubmit={this.onSubmit}>
                <div className="form-group">
                  <label >First Name</label>
                  <input
                    type="text"
                    className="form-control border-dark"
                    name="first_name"
                    onChange={this.onChange}
                    value={first_name}
                  />
                </div>

                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    className="form-control border-dark"
                    name="last_name"
                    onChange={this.onChange}
                    value={last_name}
                  />
                </div>

                <div className="form-group">
                  <label>Username</label>
                  <input
                    type="text"
                    className="form-control border-dark"
                    name="username"
                    onChange={this.onChange}
                    value={username}
                  />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    className="form-control border-dark"
                    name="email"
                    onChange={this.onChange}
                    value={email}
                  />
                </div>

                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    className="form-control border-dark"
                    name="password"
                    onChange={this.onChange}
                    value={password}
                  />
                </div>

                <div className="form-group">
                  <label>Confirm Password</label>
                  <input
                    type="password"
                    className="form-control border-dark"
                    name="password2"
                    onChange={this.onChange}
                    value={password2}
                  />
                </div>

                <div className="form-group">
                  <label>Organization Key</label>
                  <input
                    type="password"
                    className="form-control border-dark"
                    name="organization_key" // needs to change to organization
                    onChange={this.onChange}
                    value={organization_key} // needs to change to organization
                    placeholder="Or leave blank if not a part of an organization."
                  />
                </div>
                <br />

                <div className="form-group">
                  <button type="submit" className="btn btn-primary">
                    Register
                  </button>
                </div>
                <p className='text-muted'>
                  Already have an account? <Link to="/login">Login</Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(
  mapStateToProps,
  { register, createMessage }
)(Register);
