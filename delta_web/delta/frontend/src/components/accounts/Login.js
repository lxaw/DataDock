/*
###############################################################################

Delta project

Authors:
Lexington Whalen (@lxaw)
Carter Marlowe (@Cmarlowe132)
Vince Kolb-LugoVince (@vancevince) 
Blake Seekings (@j-blake-s)
Naveen Chithan (@nchithan)

File name:  Login.js

Brief description: 
    This file defines the layout of the login page. It allows users to enter
a username and password to login. If they do not have an account,there is also
a link to the register page.

###############################################################################
*/



import React, { Component } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from "prop-types";
import { login } from '../../actions/auth';
import ImageCarousel from '../carousel/ImageCarousel';

export class Login extends Component {
  state = {
    username: '',
    password: '',
  };
  static propTypes = {
    login: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool
  }

  // UTILITY: Uses the entered username and password to log user in.
  onSubmit = e => {
    e.preventDefault();
    this.props.login(this.state.username, this.state.password);
  }

  // UTILITY: When the form element is updated, change the corresponding state
  onChange = e => this.setState({ [e.target.name]: e.target.value });

  render() {
    // if logged in, redirect
    if (this.props.isAuthenticated) {
      return <Navigate to="/" />
    }
    const { username, password } = this.state;
    // form
    return (
      <div className="container">
        <div className="row">
          <div className="col">
            <ImageCarousel />
          </div>

          <div className="col">
            <div className="card card-body mt-5">
              <h2 className='text-center' >Login</h2>
              <form onSubmit={this.onSubmit}>
                <div className="form-group">
                  <label >Username</label>
                  <input
                    type="text"
                    className='form-control border-dark'
                    name='username'
                    onChange={this.onChange}
                    value={username}
                    
                  />

                </div>

                <div className="form-group">
                  <label >Password</label>
                  <input
                    type="password"
                    className='form-control border-dark'
                    name='password'
                    onChange={this.onChange}
                    value={password}
                    
                  />
                </div>

                <br />
                <div className="form-group">
                  <button type='submit' className='btn btn-primary'>
                    Login
                  </button>
                </div>
                <br />
                <p className='text-muted'>
                  Don't have an account? <Link to='/register'>Register</Link>
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

export default connect(mapStateToProps, { login })(Login);
