/*
###############################################################################

Delta project

Authors:
Lexington Whalen (@lxaw)
Carter Marlowe (@Cmarlowe132)
Vince Kolb-LugoVince (@vancevince) 
Blake Seekings (@j-blake-s)
Naveen Chithan (@nchithan)

File name:  errors.js

Brief description: 
    This file defines how to handle the GET_ERRORS action. In such case,
returns the error msg and status code as a dictionary.

###############################################################################
*/

import { GET_ERRORS } from "../actions/types";

const initialState = {
    msg: {},
    status:null
}

export default function(state = initialState, action){
    switch(action.type){
        case GET_ERRORS:
            return {
                msg:action.payload.msg,
                status:action.payload.status
            };
            default: 
                return state;
    }
}