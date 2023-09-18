/*
###############################################################################

Delta project

Authors:
Lexington Whalen (@lxaw)
Carter Marlowe (@Cmarlowe132)
Vince Kolb-LugoVince (@vancevince) 
Blake Seekings (@j-blake-s)
Naveen Chithan (@nchithan)

File name:  MessageDetail.js

Brief description: 
    When having a conversation with another user, messages appear in cards.
Each card displays the message, the time sent, and the user who sent the
message. This file defines the layout of that message card.

###############################################################################
*/

import React from 'react';
import {Link} from 'react-router-dom';

const MessageDetail = (props) => {
    /*
    Expects:
    author_username
    text
    date
    */
  return (
    <div className="border m-3 p-2 rounded">
        <div className = "row">
          <small> Sent by <Link to={`/profile/${props.author_username}`}>{props.author_username}</Link> at {props.date}</small>
        </div>
        {props.text} 
    </div>
  )
}

export default MessageDetail