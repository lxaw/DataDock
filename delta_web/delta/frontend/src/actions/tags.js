import axios from "axios";
import { tokenConfig } from "./auth";
import { createMessage } from "./messages";

export const addTags = (dictData) => (dispatch,getState) =>{
    /*
    dictData expects
    'tags' arr str of tags
    'file': file id
    */
    axios.post('/api/tags/',dictData,tokenConfig(getState))
    .then((res)=>{
    })
    .catch((err)=>{
    })
}