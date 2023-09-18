/*
###############################################################################

Delta project

Authors:
Lexington Whalen (@lxaw)
Carter Marlowe (@Cmarlowe132)
Vince Kolb-LugoVince (@vancevince) 
Blake Seekings (@j-blake-s)
Naveen Chithan (@nchithan)

File name:  auth.js

Brief description: 
    This file handles a variety of different actions relating to 
authentication. This is mostly with login/logout and registration.

###############################################################################
*/

import {
    USER_LOADED,
    USER_LOADING,
    USER_DELETE,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT_SUCCESS,
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    USER_UPDATE_SUCCESS
} from "../actions/types"

const initialState = {
    // token stored in local storage
    token: localStorage.getItem('token'),
    // this was originally null
    isAuthenticated: localStorage.getItem('isAuthenticated') != undefined ? true : false,
    isLoading: false,
    // this was originally null
    user: localStorage.getItem('user')
}

export default function(state=initialState, action){
    switch(action.type){
        case USER_LOADING:
            return {...state, isLoading:true};
        case USER_LOADED:
            // these were changed compared to original, 
            // in order to help refresh maintain place
            localStorage.setItem('isAuthenticated',true)
            localStorage.setItem('user',action.payload)
            return {
                ...state,
                isAuthenticated: true,
                isLoading:false,
                user: action.payload
            }
        case USER_UPDATE_SUCCESS:
            return {
                ...state,
                ...action.payload,
                isAuthenticated:true,
                isLoading:false,
            }
        case LOGIN_SUCCESS:
        case REGISTER_SUCCESS:
            // when login successfully gives user a token
            localStorage.setItem('token',action.payload.token);
            return {
                ...state,
                ...action.payload,
                isAuthenticated:true,
                isLoading:false,
            }
        // login fail and auth error do the same thing atm
        case AUTH_ERROR:
        case LOGIN_FAIL:
        case LOGOUT_SUCCESS:
        case USER_DELETE:
        case REGISTER_FAIL:
            // destroy token
            localStorage.removeItem('token');
            return{
                ...state,
                token:null,
                user:null,
                isAuthenticated:false,
                isLoading:false
            }
        default:
            return state;
    }
}