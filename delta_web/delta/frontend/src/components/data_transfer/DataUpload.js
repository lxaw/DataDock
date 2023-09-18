/*
###############################################################################

Delta project

Authors:
Lexington Whalen (@lxaw)
Carter Marlowe (@Cmarlowe132)
Vince Kolb-LugoVince (@vancevince) 
Blake Seekings (@j-blake-s)
Naveen Chithan (@nchithan)

File name:  DataUpload.js

Brief description: 
    This file defines the layout of the data upload page.

###############################################################################
*/

import React from 'react';
import { connect } from 'react-redux';
import DataUploadForm from './DataUploadForm';

const DataUpload = (props) => {
  if(props.auth.user.username == undefined) return;
  return(
    <div className = "container" data-testid="data_upload-1">
        <h1>
            Data Upload        
        </h1>
        <DataUploadForm availableOrgs= {props.auth.user.followed_organizations}/>
        <a role="button" href="/#/data/download" className="btn btn-danger">
            Cancel
        </a> 
    </div>
  )
}

const mapStateToProps = state => ({
  auth:state.auth
});


export default connect(mapStateToProps,null)(DataUpload);