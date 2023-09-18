import axios from "axios";
import { tokenConfig } from "./auth";
import { createMessage } from "./messages";

export const addNotificationReview = (notificationData) => (dispatch,getState) => {
    axios.post('/api/notification_review/',notificationData,tokenConfig(getState))
    .then((res)=>{
    })
    .catch((err)=>{
    })
}
export const markReadNotificationReview = (notificationId) => (dispatch,getState) => {
    axios.get(`/api/notification_review/${notificationId}/perform_read/`,tokenConfig(getState))
    .then((res)=>{
        dispatch(createMessage({readNotification:"Notification has been read."}))
    })
    .catch((err)=>{})
}

export const addNotificationMessage = (notificationData) => (dispatch,getState) =>{
    axios.post('/api/notification_message/',notificationData,tokenConfig(getState))
    .then((res)=>{
    })
    .catch((err)=>{
    })
}

export const markReadNotificationMessage = (notificationId) => (dispatch,getState) => {
    axios.get(`/api/notification_message/${notificationId}/perform_read/`,tokenConfig(getState))
    .then((res)=>{
        dispatch(createMessage({readNotification:"Notification has been read."}))
    })
    .catch((err)=>{})
}

// notification news
export const markReadNotificationNews = (notificationId) => (dispatch,getState) => {
    axios.get(`/api/notification_news/${notificationId}/perform_read/`,tokenConfig(getState))
    .then((res)=>{
        dispatch(createMessage({readNotification:"Notification has been read."}))
    })
    .catch((err)=>{

    })
}

// notification whats hot
export const markReadNotificationWhatsHot = (notificationId) => (dispatch,getState) => {
    axios.get(`/api/notification_whats_hot/${notificationId}/perform_read/`,tokenConfig(getState))
    .then((res)=>{
        dispatch(createMessage({readNotification:"Notification has been read."}))
    })
    .catch((err)=>{})
}