/*
###############################################################################

Delta project

Authors:
Lexington Whalen (@lxaw)

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
import cartItems from './cartActions'; // Import the new reducer

export default combineReducers({
    errors,
    messages,
    auth,
    cartItems,
});