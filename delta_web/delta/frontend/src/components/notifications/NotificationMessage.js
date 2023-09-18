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
* NotificationMessage.js
*
* This file is the child class of NotificationMessageIndex.js. It is used to display the
* notification messages that are sent to the user. It will give the user the message is from 
* and the date the message was sent.
*************************************/

import React, { useState } from 'react'
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { markReadNotificationMessage} from '../../actions/notification';

const NotificationMessage = (props) => {

    console.log(props)

    const [style,setStyle] = useState({});
    
    const handleRead = () =>{
        props.markReadNotificationMessage(props.data.id)
        setStyle({display:'none'})
    }

  return (
    <div className = "container border m-3 p-3" style={style} data-testid="notification_message-1">
        <div className="d-flex justify-content-between">
            <div>
                <strong>Notification from <Link to={`/profile/${props.data.sender_username}`}>{props.data.sender_username}</Link></strong>
            </div>
            <div>
                <p>{props.data.formatted_date}</p>
            </div>
        </div>
        <div>
            <p>
                {props.data.text}
            </p>
        </div>
        <div>
            <Link to = {`/messages/conversations/${props.data.convo_id}`}>
                See message
            </Link>
        </div>
        <div>
            <button onClick={handleRead} class="btn btn-sm btn-success">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" ><path d="m10 15.586-3.293-3.293-1.414 1.414L10 18.414l9.707-9.707-1.414-1.414z"></path></svg>
                Got it
            </button>
        </div>
    </div>
  )
}

const mapStateToProps = state =>({
    auth:state.auth
})

export default connect(mapStateToProps,{markReadNotificationMessage},)(NotificationMessage);