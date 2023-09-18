/*
###############################################################################

Delta project

Authors:
Lexington Whalen (@lxaw)
Carter Marlowe (@Cmarlowe132)
Vince Kolb-LugoVince (@vancevince) 
Blake Seekings (@j-blake-s)
Naveen Chithan (@nchithan)

File name:  ConversationCard.js

Brief description: 
    Users can communicate with each other through conversations. Each
conversation is displayed through a conversation card similar to the data
card for public data. This shows the title, the user, and the data of the 
conversation. This file defines the layout of that card.

###############################################################################
*/

import React from 'react'
import { Link } from 'react-router-dom'

const ConversationCard = (props) => {
    /*
    Takes in a conversation object, or a serialized 
    */
  return (
    <div className="container border border-rounded p-3">
        <p>
            {props.convoObj.pub_date}
        </p>
        <p>
            {props.convoObj.title}
        </p>
        <Link to={`/messages/conversations/${props.convoObj.id}`}>
            View
        </Link>
    </div>
  )
}

export default ConversationCard