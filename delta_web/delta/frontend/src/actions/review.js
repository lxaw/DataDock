import {createMessage,returnErrors} from './messages';
import {tokenConfig,fileTokenConfig} from './auth';
import axios from 'axios';

// Get all comments created by the user
export const getUserReviewComments = () => (dispatch, getState) => {
  axios
    .get('/api/review_comment/', fileTokenConfig(getState))
    .then((res) => {
      // Handle the response data
      return res.data
    })
    .catch((err) => {
      console.log(err);
    });
};

// Create a new comment
export const addReviewComment = (commentData) => (dispatch, getState) => {
  return new Promise((resolve, reject) => {
    axios
      .post('/api/review_comment/', commentData, fileTokenConfig(getState))
      .then((res) => {
        dispatch(createMessage({ addReviewCommentSuccess: 'Your comment has been posted.' }));
        resolve(res.data);
      })
      .catch((err) => {
        const errorText = err.response ? err.response.data.detail : 'Error adding comment.';
        console.log(errorText);
        dispatch(createMessage({ addReviewCommentFail: errorText }));
        reject(err);
      });
  });
};

// Retrieve a specific comment
export const getReviewComment = (commentId) => (dispatch, getState) => {
  axios
    .get(`/api/review_comment/${commentId}/`, fileTokenConfig(getState))
    .then((res) => {
      // Handle the response data
      return res.data
    })
    .catch((err) => {
      const errorText = err.response ? err.response.data.detail : 'Error retrieving comment.';
      console.log(errorText);
      dispatch(createMessage({ getCommentFail: errorText }));
    });
};

// Update a comment
export const updateReviewComment = (commentId, commentData) => (dispatch, getState) => {
  return new Promise((resolve, reject) => {
    axios
      .patch(`/api/review_comment/${commentId}/`, commentData, fileTokenConfig(getState))
      .then((res) => {
        dispatch(createMessage({ updateReviewCommentSuccess: 'Comment updated successfully.' }));
        resolve(res.data);
      })
      .catch((err) => {
        const errorText = err.response ? err.response.data.detail : 'Error updating comment.';
        console.log(errorText);
        dispatch(createMessage({ updateReviewCommentFail: errorText }));
        reject(err);
      });
  });
};

export const deleteReviewComment = (commentId) => (dispatch, getState) => {
  return new Promise((resolve, reject) => {
    axios
      .delete(`/api/review_comment/${commentId}/`, fileTokenConfig(getState))
      .then((res) => {
        dispatch(createMessage({ deleteReviewCommentSuccess: 'Comment deleted successfully.' }));
        resolve(res.data);
      })
      .catch((err) => {
        const errorText = err.response ? err.response.data.detail : 'Error deleting comment.';
        console.log(errorText);
        dispatch(createMessage({ deleteReviewCommentFail: errorText }));
        reject(err);
      });
  });
};

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