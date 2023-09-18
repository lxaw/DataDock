/************************************
*
* Delta project.
*
* Authors:
* Lexington Whalen (@lxaw)
* Carter Marlowe (@Cmarlowe132)
* Vince Kolb-LugoVince (@vancevince) 
* Blake Seekings (@j-blake-s)
* Naveen Chithan (@nchithan)
*
* ProfileDetailed.js
*
* This is the parent frame of the Edit Profile page. This has the side bar and the main frame that the editing form is in.
* The Remove account button can be found here. 
*                    
*************************************/

import React, { useState } from 'react';
import { deleteUser } from "../../actions/auth";
import { connect } from "react-redux";
import ProfileForm from './ProfileForm';
import "./profile.css"
const ProfileDetailed = (props) => {
    const { isAuthenticated, user } = props.auth;
    return (
        <div className='container' data-testid="profile_detailed-1">
            <div className="profile-info">
                <div className="h5 text-center">Change your information.</div>
                <div className="container">
                    <ProfileForm />
                    <br />
                    <button className="btn btn-danger" onClick={props.deleteUser}>
                        Remove account?
                    </button>
                </div>
            </div>
        </div>
    )
}


const mapStateToProps = state => ({
    auth: state.auth
})

export default connect(mapStateToProps, { deleteUser })(ProfileDetailed);