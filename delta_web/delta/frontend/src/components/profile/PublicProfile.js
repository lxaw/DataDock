/************************************
*
* Delta project.
*
* Authors:
* Lexington Whalen (@lxaw)
*
* PublicProfile.js
*
* This file is used to display the Public Profile page. 
* This is what other users (not yourself) will see when they view your profile. There is a sidebar for only when the user is viewing their profile.
* You can also view conversations and converse with a user from this page. 
*************************************/

import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ConversationForm from '../conversations/ConversationForm'
import { connect } from 'react-redux'
import { getPublicUserData } from '../../actions/auth'
import ConversationTable from '../conversations/ConversationTable'
import axios from 'axios'
import "./profile.css"
import { getUserConversations } from '../../actions/conversation'


// UTILITY: This is used to render and display the Public Profile Page. 
// INPUTS: Props is immutable data that is passed to the function.
// OUTPUTS: The output is the rendered Public Profile Page. With a sidebar if the user is viewing their 
//          own public profile or without a sidebar and the ability to converse with that user in a direct message form if they are viewing someone elses public profile.
const PublicProfile = (props) => {

  if (props.getPublicUserData == undefined) return;

  const [convos, setConvos] = useState(null)
  const [userData, setUserData] = useState(null)

  // public profile that you are viewing's username
  const { username } = useParams()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await props.getPublicUserData(username);
        const userConvos = await props.getUserConversations(username)
        console.log(userConvos)
        
        if (userData) {
          setUserData(userData);
        } else {
          console.error("User data is undefined.");
        }
        if(userConvos){
          setConvos(userConvos)
        }else{
          console.log("no user convos")
        }
      } catch (error) {
        console.error(error);
      }
    };
  
    fetchData();
  }, [])

  // hasn't loaded yet
  console.log(userData)
  if (userData == null) return <div data-testid="public_profile-1" ></div>;

  return (
    <div className="container" data-testid="public_profile-1">
      <div className='row'>
        <div className= {props.auth.user.username == username ? 'profile-info' : 'something'}>
          <div>
            <h1>
              {username}'s profile
            </h1>
            <div>
              <i>
                {userData.bio}
              </i>
            </div>
          </div>
          <hr />

          <div>
            {
              props.auth.user.username == username ?
                <div>
                  <p>This is how you appear to others.</p>
                  <Link to="/profile/glance" className="btn btn-primary">
                    See your private profile
                  </Link>
                </div>
                :
                <div>
                  <h4>Start a Conversation?</h4>
                  <ConversationForm />
                  <h4>Past Conversations</h4>
                  <ConversationTable convos={convos} />
                </div>
            }
          </div>
        </div>
      </div>
    </div>
  )
}
const mapStateToProps = state => ({
  auth: state.auth
})

export default connect(mapStateToProps, {getPublicUserData,getUserConversations})(PublicProfile)