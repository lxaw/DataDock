
import axios from 'axios'
import React from 'react'
import { tokenConfig } from './auth'
import { createMessage } from './messages'
// create notification
import { addNotificationMessage } from './notification'

export const addMessage = (dictData) => (dispatch,getState) => {
    /*
    dictData must have:
    text: str of text of message
    other_user_username: username of other user
    convo_id: id of convo
    author_id: id of author
    */
   axios.post('/api/message/',dictData,tokenConfig(getState))
   .then((res)=>{
        console.log(dictData)
        dispatch(createMessage({addMessageSuccess:"Successfully sent message."}))
        dispatch(addNotificationMessage({
          text:`New message from ${res.data.author_username}. "${dictData.text}"`,
          sender:res.data.author,
          message:res.data.id,
          recipient:res.data.recipient,
        }))
   })
   .catch((err)=>{
   })
}
