/*
###############################################################################

Delta project

Authors:
Lexington Whalen (@lxaw)
Carter Marlowe (@Cmarlowe132)
Vince Kolb-LugoVince (@vancevince) 
Blake Seekings (@j-blake-s)
Naveen Chithan (@nchithan)

File name:  PrivateRoute.js

Brief description: 
    This file defines the proxy for a regular route and checks to see if
the user is logged in.  Users must be authenticated to reach the interior
of the website or else they are redirected to the login page.

###############################################################################
*/

import React from 'react'
import {Route, Navigate} from 'react-router-dom';
import {connect, Connect} from 'react-redux';
import PropTypes from "prop-types";

// see: https://stackoverflow.com/questions/69923420/how-to-use-private-route-in-react-router-domv6
const PrivateRoute = ({isAuthenticated,children}) => {
    if(!isAuthenticated){
        return <Navigate to ="/login" />
    }
    return children;
}

const mapStateToProps = (state) =>({
    isAuthenticated:state.auth.isAuthenticated,
});

export default connect(mapStateToProps)(PrivateRoute);
