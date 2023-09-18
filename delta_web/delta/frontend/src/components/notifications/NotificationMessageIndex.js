/************************************
*
* Delta project.
*
* Authors:
* Lexington Whalen (@lxaw)
* Carter Marlowe (@Cmarlowe132)
* Vince Kolb-LugoVince (@vancevince) 
* Blake Seekings (@j-blake-s)
* Naveen Chithan (@nchithan)
*
* NotificationMessageIndex.js
*
* This file is the parent class of NotificationMessage.js. It is used to display
* all the notifications of messages that the user has received. This also allows the 
* user to view the message and remove the notification.
*************************************/

import React, { useEffect, useState } from 'react'
import { connect } from "react-redux"
import axios from 'axios';

import NotificationMessage from './NotificationMessage';

const NotificationMessageIndex = (props) =>{
    // notifications
    const [arrNotifications, setArrNotifications] = useState([]);

  // get notifications
  //
  const getNotifications = () =>{
    axios.get('/api/notification_message/get_unread',{headers:{'Content-Type':'application/json','Authorization': `Token ${props.auth.token}`}})
    .then((res)=>{
      setArrNotifications(res.data)
    })
  }
    useEffect(()=>{
        getNotifications()
    },[]);

    return (
        <div className="container" data-testid="notification_message_index-1">
            <h1>Notifications of Messages</h1>
            <p>
              Here are all your messages. You can view the user who sent you the message by clicking their username, and
              you can see the contents of the message by clicking "See message".

              You can message users by clicking their name and then creating a conversation. On all files or reviews of files there is present the name of the user who uploaded the file or reviewed it; by clicking that name you can begin a conversation.
              
              To remove the notification, click "Got it".
            </p>
            <hr/>
            <div>
              {arrNotifications.length != 0 ? 
              <div>
                {arrNotifications.map((objNotif,index)=>(
                  <NotificationMessage data = {objNotif} key={index}/>
                ))}
              </div> 
              : 
              <div>
                <p>No notifications yet!</p>
              </div>
              }
            </div>
        </div>
    )
}

const mapStateToProps = state =>({
    auth:state.auth
})

export default connect(mapStateToProps,{})(NotificationMessageIndex);