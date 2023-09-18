import axios from 'axios';

import {createMessage,returnErrors} from "./messages";
import {fileTokenConfig,tokenConfig} from './auth';

import {ADD_CSV_FILE, DELETE_CSV_FILE, GET_CSV_FILES,GET_CSV_FILE, 
    CSV_FILE_UPDATE_SUCCESS,GET_CSV_FILES_PUBLIC} from "./types";
import { addTags } from './tags';

// POST FILE 
/*
The strat is that you first create the csv object in the database.
This will let you know if the file name overlaps with any other files.
Then you actually write the file to the system, only if no errors with the file 
*/
export const addCsvFile= (dictData) => (dispatch,getState) =>{
    /*
    Dict data has keys
    file: file object
    isPublic: bool
    description: str
    orgs: array of orgs
    */
    // pass in token

    // first create the csv data object in Django, then make the file
    return axios.post('/api/csv/',dictData,tokenConfig(getState))
    .then((res)=>{
        // this means that the creation of the csv file model in django sucessful
        // thus we move onto actually creating the file
        axios.post('/api/upload/csv/',dictData['file'],fileTokenConfig(getState,dictData['file']))
            .then(res=>{
                dispatch(createMessage({addCsvFileSuccess:"File posted"}));
                dispatch({
                    type:ADD_CSV_FILE,
                    payload: res.data
                });
                return res;
            })
            .catch(err=>{
                if(err.response){
                    dispatch(createMessage({addCsvFileError:err.response.data.message}))
                }
                else{
                    dispatch(createMessage({addCsvFileError:"Error uploading file. Check that the file name is unique compared to your previously uploaded files."}))
                }
                return err;
            })
    })
    .catch((err)=>{
        dispatch(createMessage({addCsvFileError:"Error uploading file. Check that the file name is unique compared to your previously uploaded files."}))

        return err;
    })
}

// GET FILES
export const getCsvFiles = () => (dispatch,getState) =>{
    axios.get('/api/csv/',tokenConfig(getState))
        .then(res => {
            console.log(res);
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
    axios.patch(`api/csv/${dictData['id']}/`,dictData,tokenConfig(getState))
        .then(res=>{
            dispatch(createMessage({updateCsvFileSuccess:"File successfully updated."}))
            dispatch({
                type:CSV_FILE_UPDATE_SUCCESS,
                payload:res.data
            })
        })
        .catch((err)=>{
        })
}

// DELETE FILE
export const deleteCsvFile = (id) => (dispatch,getState) =>{
    axios.delete(`api/csv/${id}/`,tokenConfig(getState))
    .then(res=>{
        dispatch(createMessage({deleteCsvFile:"Csv File Deleted"}));
        dispatch({
            type:DELETE_CSV_FILE,
            payload: id
        });
    })
    .catch(err=>{});
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
// TODO: Make sure that you can only download files that are public
// or under your organization
// or are yours
export const downloadCsvFile = (id) => (dispatch, getState) =>{
    axios.get(`/api/public_csvs/${id}/download`,tokenConfig(getState))
    .then(res=>{
        var fileContent = res.data;
        // temporary solution to get file name, naive
        var fileName = res.headers['content-disposition'].split('filename=')[1].split(';')[0];
        var downloadLink = document.createElement('a');
        var blob = new Blob(["\ufeff",String(fileContent)]);
        var url = URL.createObjectURL(blob);
        downloadLink.href=url;
        downloadLink.download = fileName + ".csv";
        document.body.appendChild(downloadLink);
        downloadLink.click()
        document.body.appendChild(downloadLink);
    })
    .catch(err=>{
    })
}