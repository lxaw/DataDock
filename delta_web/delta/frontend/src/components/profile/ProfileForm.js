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
* ProfileForm.js
*
* This file allows the user to edit their information that is stored on the site. 
* They can join and leave organizations on this page as well. Password change is also presented here.
* This is the helper file that is in ProfileDetailed and has the actual form.  
*************************************/

import React,{useState} from 'react'
import { connect } from 'react-redux';
import {updateUser} from "../../actions/auth"
import OrganizationThumbnail from './OrganizationThumbnail';

const ProfileForm = (props) => {

    if(props.auth.user.username == null) return;

    const [userInfo,setUserInfo] = useState(
        {
            username:props.auth.user.username,
            first_name:props.auth.user.first_name,
            last_name:props.auth.user.last_name,
            email:props.auth.user.email,
            bio:props.auth.user.bio,
            password:"",
            organizations:props.auth.user.followed_organizations,
            newOrgKey:""
        }
    );


    const onChange = (e) => {
        const newState = {...userInfo,[e.target.name]: e.target.value};
        setUserInfo(newState);
    }

    const parentOnRemoveOrg = (orgObj) =>{
        const newOrgs = userInfo['organizations'].filter(item => item !== orgObj )
        setUserInfo({...userInfo,['organizations']:newOrgs})
    }

    const parentOnPutBackOrg = (orgObj) =>{
        const newOrgs = userInfo['organizations'].concat(orgObj)
        setUserInfo({...userInfo,['organizations']:newOrgs})
    }

    /* 
    * This defines the actions on what happens when a user click on the submit button.
    * The function gets called and updates the users information.
    */
    const onSubmit = (e) =>{
        e.preventDefault()
        props.updateUser(userInfo);
    }
    //This form allows for edited information to be submitted to the backend
    return (
        <form onSubmit = {onSubmit} data-testid="profile_form-1">
            <div>
                First Name: 
                <input
                name = "first_name"
                value = {userInfo.first_name}
                onChange={onChange}
                className = "form-control"
                placeholder={userInfo.first_name}
                >
                </input>
            </div>
            <div>
                Last Name:
                <input
                className="form-control"
                name = "last_name"
                value = {userInfo.last_name}
                onChange = {onChange}
                placeholder={userInfo.last_name}
                >
                </input>
            </div>
            <div>
                Email:
                <input
                className="form-control"
                name = "email"
                value = {userInfo.email}
                onChange={onChange}
                placeholder={userInfo.email}
                >
                </input>
            </div>
            <div>
                Username:
                <input 
                className="form-control"
                name = "username"
                value = {userInfo.username}
                onChange={onChange}
                placeholder={userInfo.username}
                >
                </input>
            </div>
            <div>
                Password:
                <input
                className="form-control"
                name = "password"
                placeholder="Or enter nothing if no change wanted."
                value = {userInfo.password}
                onChange = {onChange}
                >
                </input>
            </div>
            <div>
                <label htmlFor="textareaBio" className="form-label">
                Bio
                </label>
                <textarea
                id="textareaBio"
                className="form-control"
                name="bio"
                value={userInfo.bio}
                onChange={onChange}
                />
                <div id="textareaBioHelp" class="form-text">
                    Here you can write a little bit about yourself, your work, or your interests.
                </div>
            </div>
            <br/>
            <h5>Currently followed organizations:</h5>
            <div>
                { props.auth.user.followed_organizations.length === 0 ? <p> Not part of any Organizations</p> :
                    props.auth.user.followed_organizations.map((orgObj,index) => (
                        <OrganizationThumbnail org={orgObj} 
                        key={index}
                        parentOnPutBackOrg={parentOnPutBackOrg} 
                        parentOnRemoveOrg={parentOnRemoveOrg} 
                        />
                ))}
            </div>
            <h5>Join Organization via Secret Key</h5>
            <div>
                <input
                    type="password"
                    className="form-control"
                    name="newOrgKey"
                    onChange={onChange}
                    value={userInfo.newOrgKey}
                    autoComplete="new-password"
                />
                <small>
                    Enter the key of an organization you wish to join, or nothing if no change.
                    All organizations have a secret key; admins of the organizations will provide the key to you if you
                    are supposed to be in the organization.
                </small>
            </div>
            <br/>
            <button className="btn btn-success">
                Update Information
            </button>
        </form>
    )
}

const mapStateToProps = state =>({
    auth:state.auth
})

export default connect(mapStateToProps,{updateUser})(ProfileForm);