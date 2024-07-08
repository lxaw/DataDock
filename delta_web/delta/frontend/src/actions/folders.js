import axios from "axios";
import {createMessage,returnErrors} from "./messages";
import {fileTokenConfig,tokenConfig} from './auth';

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