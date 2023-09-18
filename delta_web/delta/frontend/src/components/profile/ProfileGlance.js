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
* File name: ProfileGlance.js
*
* Brief description: This file renders the brief easy overview of the user's profile. The user will be able to
*                    quickly and easily see all the information that is on their account in a read only format.
*                    Items that are displayed include username, firstname, lastname, email, bio, and followed organizations. 
*************************************/

import React, { Component, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from "prop-types";
import axios from 'axios';
import "./profile.css";
import OrganizationCard from '../community/OrganizationCard';
import PublicCsvFileTable from '../data_transfer/PublicCsvFileTable';

<script src="https://kit.fontawesome.com/f45b95bc62.js" crossorigin="anonymous"></script>

// UTILITY: This is used to render and display the Profile at a Glance Page. This is a read only of the users information.  
// INPUTS: Props is immutable data that is passed to the function. It should have all of the user's information passed into this.
// OUTPUTS: The output is the rendered Profile at a Glance Page. With the sidebar on the left hand side of the page. Displays all of users information.
const ProfileGlance = (props) => {
    //This is the rendering for the profile at a glance page.
    const { isAuthenticated, user } = props.auth; //Making sure that its the specific user thats information is displayed
    const [csvFiles, setCsvFiles] = useState(null);

    useEffect(() => {
        axios.get('/api/csv/', { headers: { 'Content-Type': 'application/json', 'Authorization': `Token ${props.auth.token}` } })
            .then(res => {
                setCsvFiles(res.data);
            })
    }, [])

    if (csvFiles == null) return <div data-testid="profile_glance-1"></div>;

    if (user.followed_organizations == null) return <div data-testid="profile_glance-1"></div>;
    return (
        //This is the main container that holds the information. User can view all their information without editing the
        //fields. They can view their organizations and click on the link to go to their organizations page.

        //<div>
        <div className='container bootstrap snippets bootdey' data-testid="profile_glance-1">
            <div>
                <div className="profile-info">
                    <div className="panel">
                        <div className="bio-graph-heading bg-primary">
                            <p style={{color:"white"}}>
                                Your bio:
                            </p>
                            <p className="fs-3" style={{color:"white"}}>
                                {user.bio}
                            </p>
                        </div>
                        <div>
                            <br/>
                            <Link to={`/profile/${user.username}`}>
                                <button class="btn btn-outline-primary">
                                        See your Public Profile
                                </button>
                            </Link>
                        </div>
                        <div className="panel-body bio-graph-info">
                            <h2>Basic Information</h2>
                            <div className="row">
                                <div className="bio-row">
                                    <p><span>First Name: </span> {user.first_name}</p>
                                </div>
                                <div className="bio-row">
                                    <p><span>Last Name: </span> {user.last_name}</p>
                                </div>
                                <div className="bio-row">
                                    <p><span>Username: </span> {user.username}</p>
                                </div>
                                <div className="bio-row">
                                    <p><span>Email:</span> {user.email}</p>
                                </div>
                                <h1>Your Organizations</h1>
                                <div className="row">
                                    {(user.followed_organizations).map((item, index) => (
                                        <OrganizationCard
                                            orgObj={item}
                                        />
                                    ))}
                                </div>
                                <h1>Your Files</h1>
                                <div>
                                    <PublicCsvFileTable
                                        csvs = {csvFiles}
                                        textMinLength={3}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps)(ProfileGlance);