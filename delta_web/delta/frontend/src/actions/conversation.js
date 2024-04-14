import axios from "axios"
import { tokenConfig,fileTokenConfig} from "./auth"
import { createMessage } from "./messages"

export const addConversation = (dictData) => (dispatch,getState) =>{
    /*
    dict data must have
    author: user id of person starting convo
    title: text title of convo
    other_user_username: the str username of the other user
    */
    axios.post('/api/conversation/',dictData,fileTokenConfig(getState))
    .then((res)=>{
        dispatch(createMessage({addConversationSuccess:"Successfully created a conversation."}))
    })
    .catch((err)=>{
    })
}

export const getUserConversations = (username) => async (dispatch,getState) =>{
    console.log(username)
    try {
        const res = await axios.post('/api/conversation/get_convos_with_user/', {'other_user_username': username },fileTokenConfig(getState));
        return res.data;
      } catch (err) {
        console.error(err);
        throw err; // Propagate the error
      }
}