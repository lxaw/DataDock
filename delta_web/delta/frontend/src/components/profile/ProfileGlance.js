/************************************
*
* Delta project.
*
* Authors:
* Lexington Whalen (@lxaw)
*
* File name: ProfileGlance.js
*
* Brief description: This file renders the brief easy overview of the user's profile. The user will be able to
*                    quickly and easily see all the information that is on their account in a read only format.
*                    Items that are displayed include username, firstname, lastname, email, bio, and followed organizations. 
*************************************/

import React, { Component, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import OrganizationCard from '../community/OrganizationCard';
import DataSetTable from '../data_transfer/DataSetTable';
import FolderList from "../data_transfer/FolderList"
import { getFolders } from '../../actions/folders';

<script src="https://kit.fontawesome.com/f45b95bc62.js" crossorigin="anonymous"></script>

// UTILITY: This is used to render and display the Profile at a Glance Page. This is a read only of the users information.  
// INPUTS: Props is immutable data that is passed to the function. It should have all of the user's information passed into this.
// OUTPUTS: The output is the rendered Profile at a Glance Page. With the sidebar on the left hand side of the page. Displays all of users information.
const ProfileGlance = (props) => {
    //This is the rendering for the profile at a glance page.
    const { isAuthenticated, user } = props.auth; //Making sure that its the specific user thats information is displayed
    const [csvFiles, setCsvFiles] = useState([]);
    const [folders,setFolders] = useState([]);

    useEffect(() => {
        axios.get('/api/csv/', { headers: { 'Content-Type': 'application/json', 'Authorization': `Token ${props.auth.token}` } })
            .then(res => {
                setCsvFiles(res.data);
            })
        props.getFolders().then((res)=>{
            setFolders(res.data)
        })
        .catch((err)=>{
            console.log(err)
        })
    }, [])

    if (csvFiles == null) return <div data-testid="profile_glance-1"></div>;

    if (user.followed_organizations == null) return <div data-testid="profile_glance-1"></div>;
    return (
        //This is the main container that holds the information. User can view all their information without editing the
        //fields. They can view their organizations and click on the link to go to their organizations page.

        //<div>
    <div className="container mt-4">
        <div className="card">
            <div className="card-header bg-white">
                <h2 className="card-title m-0">User Information</h2>
            </div>
            <div className="card-body">
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <p className="m-0"><strong>First Name:</strong> {user.first_name}</p>
                    </div>
                    <div className="col-md-6 mb-3">
                        <p className="m-0"><strong>Last Name:</strong> {user.last_name}</p>
                    </div>
                    <div className="col-md-6 mb-3">
                        <p className="m-0"><strong>Username:</strong> {user.username}</p>
                    </div>
                    <div className="col-md-6 mb-3">
                        <p className="m-0"><strong>Email:</strong> {user.email}</p>
                    </div>
                    <div className="col-md-12 mb-3">
                        <p className="m-0"><strong>Bio:</strong> {user.bio}</p>
                    </div>
                </div>
            </div>
        </div>

    <div className="panel panel-default mt-4">
        <div className="panel-heading">
            <h1 className="panel-title">Your Organizations</h1>
            <small>Organizations are a way for groups of people to organize their data. Organizations can only be created by admins, and require a unique password to join.</small>
        </div>
        {user.followed_organizations.length > 0 ? (
        <div className="panel-body">
            <div className="row">
                {user.followed_organizations.map((item, index) => (
                    <div key={index} className="col-md-4 mb-3">
                        <OrganizationCard orgObj={item} />
                    </div>
                ))}
            </div>
        </div>
        ):(
            <div>
                Nothing yet. Contact your organization's administrator to recieve an organization key to join.
            </div>
        )
        }
    </div>

    <div className="panel panel-default mt-4">
        <div className="panel-heading">
            <h1 className="panel-title">Your Folders</h1>
            <small>Folders are a way for you to organize your own data.</small>
            <FolderList
                folders={folders}
            />
        </div>
        {csvFiles.length > 0 ? (
            <div className="panel-body">
            </div>
        ) : (
            <div>Nothing yet.</div>
        )}
    </div>

    <div className="panel panel-default mt-4">
        <div className="panel-heading">
            <h1 className="panel-title">Your Files</h1>
        </div>
        {csvFiles.length > 0 ? (
            <div className="panel-body">
                <DataSetTable dataSets={csvFiles} textMinLength={3} />
            </div>
        ) : (
            <div>Nothing yet.</div>
        )}
    </div>    

</div>

    )
}

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps,{getFolders})(ProfileGlance);