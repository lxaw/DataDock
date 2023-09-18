/*
###############################################################################

Delta project

Authors:
Lexington Whalen (@lxaw)
Carter Marlowe (@Cmarlowe132)
Vince Kolb-LugoVince (@vancevince) 
Blake Seekings (@j-blake-s)
Naveen Chithan (@nchithan)

File name:  MessageTable.js

Brief description: 
    This file defines how message cards are displayed in conversation
detail. The current user is displayed on the right while the other user
is displayed on the left.

###############################################################################
*/

import React, { useEffect, useRef } from 'react'
import MessageDetail from './MessageDetail';

const MessageTable = (props) => {
  // assumes that there is a props.user representing the user object
  // needs an array of message objs
  if(props.messages == undefined) return null;

  const listRef = useRef();
  useEffect(()=>{
    listRef.current.scrollTo(0,listRef.current.scrollHeight,'auto');
  },[]);

  return (
    <div className="overflow-scroll container" style={{height:"20rem"}} id="list" ref={listRef}>
        {props.messages.map((item,index)=>(
            <div key = {index}>
                {item.author_username == props.user.username ? 
                // You 
                <div
                    className="d-flex flex-row-reverse"
                >
                    <MessageDetail author_username={item.author_username} date={item.formatted_date} text={item.text}/>
                </div>
                :
                // Other person
                <div
                    className="d-flex flex-row"
                >
                    <MessageDetail author_username={item.author_username} date={item.formatted_date} text={item.text}/>
                </div>
                }
            </div>
        ))}        
    </div>
  )
}

export default MessageTable