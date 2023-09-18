/*
###############################################################################

Delta project

Authors:
Lexington Whalen (@lxaw)
Carter Marlowe (@Cmarlowe132)
Vince Kolb-LugoVince (@vancevince) 
Blake Seekings (@j-blake-s)
Naveen Chithan (@nchithan)

File name:  index.js

Brief description: 
    This file is a simple reducer which combines the errors, messages, and auth
functions from the other reducers.

###############################################################################
*/

// root reducer is a meeting place for all other reducers
import { combineReducers } from 'redux';
import errors from "./errors";
import messages from "./messages";
import auth from "./auth";

export default combineReducers({
    errors,
    messages,
    auth,
});