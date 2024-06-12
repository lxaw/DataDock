import {createMessage,returnErrors} from './messages';
import {tokenConfig,fileTokenConfig} from './auth';
import axios from 'axios';

export const addReview = (dictData) => (dispatch, getState) => {
  axios.post('/api/review/', dictData, fileTokenConfig(getState))
    .then((res) => {
      dispatch(createMessage({ addReviewSuccess: "Your review has been posted." }));
    })
    .catch((err) => {
        const errorText = err.response ? err.response.data.detail : "Error uploading review.";
        console.log(errorText)
        dispatch(createMessage({ addReviewFail: errorText}));
    });
};


export const deleteReview = (id) => (dispatch,getState) => {
    axios.delete(`api/review/${id}`,fileTokenConfig(getState))
    .then((res)=>{
        dispatch(createMessage({deleteReviewSuccess:"Your review has successfully been deleted."}));
    })
    .catch((err)=>{});
}

export const updateReview = (data) => (dispatch,getState) =>{
    // data expects
    /*
    id: id of review
    title: title of review
    text: text of review
    rating: int rating of review
    */
    axios.patch(`api/review/${data.id}/`,data,tokenConfig(getState))
    .then((res)=>{
        dispatch(createMessage({updateReviewSuccess:"Your review has successfully been updated."}))
    })
    .catch((err)=>{
    })
}