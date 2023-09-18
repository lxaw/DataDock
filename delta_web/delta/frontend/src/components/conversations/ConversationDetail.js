/*
###############################################################################

Delta project

Authors:
Lexington Whalen (@lxaw)
Carter Marlowe (@Cmarlowe132)
Vince Kolb-LugoVince (@vancevince) 
Blake Seekings (@j-blake-s)
Naveen Chithan (@nchithan)

File name:  ConversationDetail.js

Brief description: 
    When a user clicks on a conversation card, they are able to take a closer
look at the conversation. Here they are able to add to the conversation and
see what other users have said. This file defines that interaction.

###############################################################################
*/

import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import MessageForm from './MessageForm'
import MessageTable from './MessageTable'

const ConversationDetail = (props) => {
    const {id} = useParams()

    const [convo, setConvo] = useState(null);

    var otherUserUsername = null;


    // UTILITY: Get the data for a specific conversation
    const getData = () =>{
        axios.get(`/api/conversation/${id}/`,{headers:{'Content-Type':'application/json','Authorization':`Token ${props.auth.token}`}})
        .then((res)=>{
            setConvo(res.data);
        })
        .catch((err)=>{
            console.log(err)
        })
    }

    useEffect(()=>{
        getData()
    },[])

    if(convo == null) return;

    // setting who the other user is
    if(props.auth.user.username != convo.author_username){
        otherUserUsername = convo.author_username
    }else{
        otherUserUsername = convo.other_user_username
    }

  return (
    <div className="container">
        <h1>
            Conversation Detail
        </h1>
        <div>
            <h5>Title: {convo.title}</h5>
            <p>Started: {convo.pub_date}</p>
            <p>Other user: 
                <Link to={`/profile/${otherUserUsername}`}>{otherUserUsername}</Link>
            </p>
        </div>
        <div>
            <h5>Messages</h5>
            <div>
                <MessageTable messages={convo.messages} user={props.auth.user} />
            </div>
            <MessageForm convoId = {convo.id} 
            refresh={getData}
            otherUserUsername={otherUserUsername}
            author_id={props.auth.user.id}
            />
        </div>
        <br/>
    </div>
  )
}

const mapStateToProps = state => ({
    auth:state.auth
})

export default connect(mapStateToProps,{})(ConversationDetail)