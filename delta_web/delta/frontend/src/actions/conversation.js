import axios from "axios"
import { tokenConfig } from "./auth"
import { createMessage } from "./messages"

export const addConversation = (dictData) => (dispatch,getState) =>{
    /*
    dict data must have
    author: user id of person starting convo
    title: text title of convo
    other_user_username: the str username of the other user
    */
    axios.post('/api/conversation/',dictData,tokenConfig(getState))
    .then((res)=>{
        dispatch(createMessage({addConversationSuccess:"Successfully created a conversation."}))
    })
    .catch((err)=>{
    })
}