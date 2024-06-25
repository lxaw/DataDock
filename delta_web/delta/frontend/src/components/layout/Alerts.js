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
* Alerts.js
*
* This file allows for the different alert messages to appear if 
* the conditions apply. Some of the alert messages include needing to
* fill out required parts of a form, username is already in use, passwords matching,
* and etc.  
*************************************/


import React, { Component,Fragment } from 'react'
import { withAlert } from 'react-alert';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

export class Alerts extends Component {
    static propTypes = {
        error: PropTypes.object.isRequired,
        message: PropTypes.object.isRequired
    }
    componentDidUpdate(prevProps){
        const { error,alert,message } = this.props;

        // check for changed error
        if(error !== prevProps.error){
            if(error.msg.file_path){
                alert.error(`File Path: ${error.msg.file_path.join()}`);
            }
            if(error.msg.non_field_errors){
                alert.error(error.msg.non_field_errors.join());
            }
            if(error.msg.username){
                alert.error(error.msg.username.join());
            }
            if(error.msg.email){
                alert.error(error.msg.email.join())
            }
        }
        // check for changed message
        if(message !== prevProps.message){
            // review comments
            if(message.addReviewCommentSuccess){
                alert.success(message.addReviewCommentSuccess)
            }
            if(message.addReviewCommentFail){
                alert.error(message.addReviewCommentFail)
            }
            if(message.deleteReviewCommentSuccess){
                alert.success(message.deleteReviewCommentSuccess)
            }
            if(message.updateReviewCommentSuccess){
                alert.success(message.updateReviewCommentSuccess)
            }
            if(message.updateReviewCommentFail){
                alert.error(message.updateReviewCommentFail)
            }
            // cart items
            if(message.addCartItemSuccess){
                alert.success(message.addCartItemSuccess);
            }
            if(message.removeCartItemSuccess){
                alert.success(message.removeCartItemSuccess);
            }
            // files
            if(message.addDatasetSuccess){
                alert.success(message.addDatasetSuccess);
            }
            if(message.addDatasetError){
                alert.error(message.addDatasetError);
            }
            if(message.updateDatasetSuccess){
                alert.success(message.updateDatasetSuccess);
            }
            if(message.deleteDataset){
                alert.success(message.deleteDataset);
            }
            if(message.updateUser){
                alert.success(message.updateUser);
            }
            if(message.updateUserBadOrg){
                // bad org key but all else good for update user
                alert.error(message.updateUserBadOrg);
            }
            if(message.updateUserFail){
                alert.error(message.updateUserFail);
            }
            if(message.deleteUserSuccess){
                alert.success(message.deleteUserSuccess)
            }
            if(message.deleteUserFail){
                alert.error(message.deleteUserFail)
            }
            if(message.registerUser){
                alert.success(message.registerUser);
            }
            if(message.registerFail){
                alert.error(message.registerFail);
            }
            if(message.passwordsDoNotMatch){
                alert.error(message.passwordsDoNotMatch);
            }
            if(message.addReviewSuccess){
                alert.success(message.addReviewSuccess);
            }
            if(message.addReviewFail){
                alert.error(message.addReviewFail);
            }
            if(message.updateReviewSuccess){
                alert.success(message.updateReviewSuccess)
            }
            if(message.deleteReviewSuccess){
                alert.success(message.deleteReviewSuccess);
            }
            if(message.readNotification){
                alert.success(message.readNotification)
            }
            if(message.addConversationSuccess){
                alert.success(message.addConversationSuccess)
            }
            if(message.addMessageSuccess){
                alert.success(message.addMessageSuccess)
            }
            if(message.createFolderSuccess){
                alert.success(message.createFolderSuccess)
            }
            if(message.deleteFolderSuccess){
                alert.success(message.deleteFolderSuccess)
            }
            if(message.updateFolderSuccess){
                alert.success(message.updateFolderSuccess)
            }
            if(message.updateFolderError){
                alert.error(message.updateFolderError)
            }
        }
    }

    render() {
        return <Fragment />;
    }
}

const mapStateToProps = state => ({
    error:state.errors,
    message: state.messages
});

export default connect(mapStateToProps)(withAlert()(Alerts));