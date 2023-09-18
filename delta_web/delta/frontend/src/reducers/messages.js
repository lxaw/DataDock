/*
###############################################################################

Delta project

Authors:
Lexington Whalen (@lxaw)
Carter Marlowe (@Cmarlowe132)
Vince Kolb-LugoVince (@vancevince) 
Blake Seekings (@j-blake-s)
Naveen Chithan (@nchithan)

File name:  messages.js

Brief description: 
    This file handles the message action types such as GET_MESSAGE and
CREATE_MESSAGE. Determines what to return depending on the action type.

###############################################################################
*/

import { GET_MESSAGE, CREATE_MESSAGE } from "../actions/types";

const initialState = {};

export default function(state = initialState, action){
    switch(action.type){
        case GET_MESSAGE:
            return action.payload;
        case CREATE_MESSAGE:
            return (state = action.payload);
        default: 
            return state;
    }
}