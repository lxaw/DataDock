/*
###############################################################################

Delta project

Authors:
Lexington Whalen (@lxaw)
Carter Marlowe (@Cmarlowe132)
Vince Kolb-LugoVince (@vancevince) 
Blake Seekings (@j-blake-s)
Naveen Chithan (@nchithan)

File name:  ConversationTable.js

Brief description: 
    When visiting another user's profile. One can see all previous
conversations with them. This is done through the use of a display table,
similar to how public data is shown. This file determines the layout of that
table.

###############################################################################
*/


import React from 'react'
import { Link } from 'react-router-dom';
import ConversationCard from './ConversationCard';

const ConversationTable = (props) => {
    if(props.convos == undefined) return null;
    console.log(props.convos)
  return (
    <div>
        {props.convos.map((item,index)=>(
            <ConversationCard
                key={index}
                convoObj={item}
            />
        ))}
    </div>
  )
}

export default ConversationTable;