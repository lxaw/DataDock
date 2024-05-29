import axios from 'axios';

import {createMessage,returnErrors} from "./messages";
import {fileTokenConfig,tokenConfig} from './auth';

import {ADD_CSV_FILE, DELETE_CSV_FILE,GET_CSV_FILE,
    ADD_CART_ITEM,DELETE_CART_ITEM, 
    CSV_FILE_UPDATE_SUCCESS,GET_CSV_FILES_PUBLIC} from "./types";
import { updateCartItems } from '../reducers/cartActions';

export const addToCart = (dictData) => (dispatch, getState) => {
    return axios.post('/api/cart_item/', dictData, fileTokenConfig(getState))
        .then((res) => {
            dispatch(createMessage({ addCartItemSuccess: "Added dataset to cart." }));
            dispatch({ type: ADD_CART_ITEM, payload: res.data });

            // Get the updated number of cart items
            const updatedNumCartItems = getState().cartItems.numCartItems + 1;
            dispatch(updateCartItems(updatedNumCartItems));  // Update the cart items count

            return res;
        })
        .catch((err) => {
            dispatch(returnErrors(err.response.data, err.response.status));
        });
}


export const getCartItems = () => (dispatch,getState) =>{
    // console.log('getting cart items')
    return axios.get('/api/cart',fileTokenConfig(getState))
    .then((res)=>{
        return res.data
    })
}

export const deleteCartItem = (id) => (dispatch, getState) => {
    axios
      .delete(`/api/cart_item/${id}/`, fileTokenConfig(getState))
      .then((res) => {
          dispatch(createMessage({ removeCartItemSuccess: "Cart item removed." }));
          dispatch({ type: DELETE_CART_ITEM, payload: res.data });
  
          // Get the updated number of cart items
          const updatedNumCartItems = getState().cartItems.numCartItems - 1;
          dispatch(updateCartItems(updatedNumCartItems));  // Update the cart items count
      })
      .catch((err) => {
        console.log(err);
        // Handle error
      });
  };


// POST FILE 
export const addCsvFile = (dictData) => (dispatch,getState) =>{
    console.log(dictData)
    return axios.post('/api/csv/',dictData,fileTokenConfig(getState))
    .then((res)=>{
        dispatch(createMessage({addCsvFileSuccess:"File Posted"}))
        dispatch({type:ADD_CSV_FILE,payload:res.data});
        return res;
    })
    .catch((err)=>{
        console.log(err)
    })
}
// GET FILES
export const getCsvFiles = () => (dispatch,getState) =>{
    axios.get('/api/csv/',tokenConfig(getState))
        .then(res => {
            return res;
        })
        .catch(err=>dispatch(
            returnErrors(err.response.data,err.response.status)
        ))
}

// GET FILE by ID
export const getCsvFile = (id) => (dispatch,getState) =>{
    axios.get(`/api/csv/${id}/`,tokenConfig(getState))
        .then(res => {
            dispatch({
                type:GET_CSV_FILE,
                payload:res.data
            })
        })
        .catch(err=>
            {
                dispatch(
                    returnErrors(err.response.data,err.response.status))
                }
        )
}
// dict data expects:
/*
file_name
description
is_public
is_public_orgs
registered_organizations
tags
id (id of file)
*/
export const updateCsvFile = (dictData) => (dispatch,getState)=>{
    axios.patch(`api/csv/${dictData['id']}/`,dictData,fileTokenConfig(getState))
        .then(res=>{
            dispatch(createMessage({updateCsvFileSuccess:"File successfully updated."}))
            dispatch({
                type:CSV_FILE_UPDATE_SUCCESS,
                payload:res.data
            })
        })
        .catch((err)=>{
            console.log(err)
        })
}

// DELETE FILE
export const deleteCsvFile = (id) => (dispatch,getState) =>{
    axios.delete(`api/csv/${id}/`,fileTokenConfig(getState))
    .then(res=>{
        dispatch(createMessage({deleteCsvFile:"Csv File Deleted"}));
        dispatch({
            type:DELETE_CSV_FILE,
            payload: id
        });
    })
    .catch(err=>{console.log(err)});
}

// GET PUBLIC FILES
export const getCsvFilesPublic = () => (dispatch,getState) =>{
    axios.get('/api/public_csvs/',tokenConfig(getState))
    .then(res=>{
        dispatch({
            type:GET_CSV_FILES_PUBLIC,
            payload:res.data
        })
    })
    .catch(err=>{
    })
}

// DOWNLOAD A FILE
//  id is of file object
// to do: 
// these should all be zips
export const downloadCsvFile = (id) => (dispatch, getState) =>{
    var config = tokenConfig(getState)
    config['responseType'] = "arraybuffer"
    axios.get(`/api/public_csvs/${id}/download`,config)
    .then(res=>{
        var fileContent = res.data;
        // temporary solution to get file name, naive
        var fileName = res.headers['content-disposition'].split('filename=')[1].split(';')[0];
        var blob = new Blob([fileContent],{type:"application/zip"});
        // Create a link element and trigger the download
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob)
        link.download = fileName;
        link.click();
    })
    .catch(err=>{
    })
}