import axios from 'axios';

import {createMessage,returnErrors} from "./messages";
import {fileTokenConfig,tokenConfig} from './auth';

import {ADD_DATASET, DELETE_DATASET,GET_DATASET,
    ADD_CART_ITEM,DELETE_CART_ITEM, 
    DATASET_UPDATE_SUCCESS,GET_DATASETS_PUBLIC,
    USER_UPDATE_SUCCESS,
} from "./types";


import { updateCartItems } from '../reducers/cartActions';

export const updateFolder = (id, folderData) => (dispatch, getState) => {
    return axios
      .patch(`/api/folder/${id}/`, folderData, fileTokenConfig(getState))
      .then((res) => {
        dispatch(createMessage({ updateFolderSuccess: 'Folder updated successfully.' }));
        console.log(res);
        return res.data;
      })
      .catch((err) => {
        console.log(err);
        dispatch(createMessage({ updateFolderError: 'Failed to update folder.' }));
      });
  };

// delete folder
export const deleteFolder = (id) => (dispatch,getState) =>{
    return axios.delete(`/api/folder/${id}`,fileTokenConfig(getState))
    .then((res)=>{
        dispatch(createMessage({deleteFolderSuccess: "Successfully deleted folder." }));
        console.log(res)
    })
    .catch((err)=>{
        console.log(err)
    })
}

// create folder
export const createFolder = (dictData) => (dispatch,getState) => {
  return axios.post('/api/folder/',dictData,fileTokenConfig(getState))
  .then((res)=>{
    dispatch(createMessage({createFolderSuccess: "Successfully created folder." }));
    console.log(res)
  })
  .catch((err)=>{
    console.log(err)
  })
};

// get a specific folder's info
export const getFolderById = (id) =>(dispatch,getState) =>{
    return axios.get(`/api/folder/${id}`,fileTokenConfig(getState))
    .then((res)=>{
        return res
    })
    .catch((err)=>{
        console.log(err)
    })
}

// get folders
export const getFolders = () => (dispatch,getState) => {
  return axios.get('/api/folder/',fileTokenConfig(getState))
  .then((res)=>{
    return res
  })
  .catch((err)=>{
    console.log(err)
  })
};

export const addToCart = (dictData) => (dispatch, getState) => {
    return axios.post('/api/cart_item/', dictData, fileTokenConfig(getState))
        .then((res) => {
            dispatch(createMessage({ addCartItemSuccess: "Added dataset to cart." }));
            dispatch({ type:USER_UPDATE_SUCCESS,payload:res.data});

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
            dispatch({ type:USER_UPDATE_SUCCESS,payload:res.data});
  
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
export const addDataset = (dictData) => (dispatch,getState) =>{
    return axios.post('/api/dataset/',dictData,fileTokenConfig(getState))
    .then((res)=>{
        dispatch(createMessage({addDatasetSuccess:"File Posted"}))
        dispatch({type:ADD_DATASET,payload:res.data});
        return res;
    })
    .catch((err)=>{
        console.log(err)
    })
}
// GET FILES
export const getDatasets = () => (dispatch,getState) =>{
    axios.get('/api/dataset/',tokenConfig(getState))
        .then(res => {
            return res;
        })
        .catch(err=>dispatch(
            returnErrors(err.response.data,err.response.status)
        ))
}

// GET FILE by ID
export const getDataset = (id) => (dispatch,getState) =>{
    axios.get(`/api/dataset/${id}/`,tokenConfig(getState))
        .then(res => {
            dispatch({
                type:GET_DATASET,
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
export const updateDataset = (dictData) => (dispatch,getState)=>{
    axios.patch(`api/dataset/${dictData['id']}/`,dictData,fileTokenConfig(getState))
        .then(res=>{
            dispatch(createMessage({updateDatasetSuccess:"File successfully updated."}))
            dispatch({
                type:DATASET_UPDATE_SUCCESS,
                payload:res.data
            })
        })
        .catch((err)=>{
            console.log(err)
        })
}

// DELETE FILE
export const deleteDataset = (id) => (dispatch,getState) =>{
    axios.delete(`api/dataset/${id}/`,fileTokenConfig(getState))
    .then(res=>{
        dispatch(createMessage({deleteDataset:"dataset File Deleted"}));
        dispatch({
            type:DELETE_DATASET,
            payload: id
        });
    })
    .catch(err=>{console.log(err)});
}

// GET PUBLIC FILES
export const getDatasetsPublic = () => (dispatch,getState) =>{
    axios.get('/api/public_datasets/',tokenConfig(getState))
    .then(res=>{
        dispatch({
            type:GET_DATASETS_PUBLIC,
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
export const downloadDataset = (id) => (dispatch, getState) =>{
    var config = tokenConfig(getState)
    config['responseType'] = "arraybuffer"
    axios.get(`/api/public_datasets/${id}/download`,config)
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
        console.log(err)
    })
}