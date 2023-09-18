/*
###############################################################################

Delta project

Authors:
Lexington Whalen (@lxaw)
Carter Marlowe (@Cmarlowe132)
Vince Kolb-LugoVince (@vancevince) 
Blake Seekings (@j-blake-s)
Naveen Chithan (@nchithan)

File name:  MessageForm.js

Brief description: 
    This file defines the layout of the form object used to converse with
other users. This form appears in conversation detail and allows users to
send messages inside a certain convo with a user.

###############################################################################
*/

import React,{useState} from 'react'
import { connect } from 'react-redux';
import { addMessage } from '../../actions/convo_message'
import { addNotificationMessage } from '../../actions/notification';

const MessageForm = (props) => {
    const convoId = props.convoId;
    const otherUserUsername = props.otherUserUsername
    const userId = props.author_id

    const [messageText,setMessageText] = useState('');

    const onChange = (e) =>{
        setMessageText(e.target.value);
    }

    const onSubmit = (e) =>{
        e.preventDefault();
        props.addMessage({text:messageText,
            other_user_username:otherUserUsername,
            convo_id:convoId,
            author_id:userId
        })
        setTimeout(()=>{
            props.refresh();
        },200)
    }

  return (
    <form onSubmit = {onSubmit}>
        <div>
            <small>
                Send a message
            </small>
        </div>
        <div className="row">
            <div className="col-9">
                <div className = "form-group">
                    <input className="form-control" id = "text"
                    name="text"
                    onChange = {onChange}
                    />
                </div>
            </div>
            <div className= "col-3">
                <button className="btn btn-outline-success">
                    Send
                </button>
            </div>
        </div>
    </form>
  )
}


export default connect(null,{addMessage})(MessageForm)