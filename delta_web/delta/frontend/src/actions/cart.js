import axios from 'axios';

import {createMessage,returnErrors} from "./messages";
import {fileTokenConfig,tokenConfig} from './auth';

import { updateCartItems } from '../reducers/cartActions';
export const addToCart = (dictData) => (dispatch, getState) => {
    return axios.post('/api/cart_item/', dictData, fileTokenConfig(getState))
        .then((res) => {
            dispatch(createMessage({ addCartItemSuccess: "Added dataset to cart." }));
            dispatch({ type:USER_UPDATE_SUCCESS,payload:res.data});

            // Get the updated number of cart items
            const updatedNumCartItems = getState().cartItems.numCartItems + 1;
            dispatch(updateCartItems(updatedNumCartItems));  // Update the cart items count

            return res;
        })
        .catch((err) => {
            dispatch(returnErrors(err.response.data, err.response.status));
        });
}


export const getCartItems = () => (dispatch,getState) =>{
    // console.log('getting cart items')
    return axios.get('/api/cart',fileTokenConfig(getState))
    .then((res)=>{
        return res.data
    })
}

export const deleteCartItem = (id) => (dispatch, getState) => {
    axios
      .delete(`/api/cart_item/${id}/`, fileTokenConfig(getState))
      .then((res) => {
          dispatch(createMessage({ removeCartItemSuccess: "Cart item removed." }));
            dispatch({ type:USER_UPDATE_SUCCESS,payload:res.data});
  
          // Get the updated number of cart items
          const updatedNumCartItems = getState().cartItems.numCartItems - 1;
          dispatch(updateCartItems(updatedNumCartItems));  // Update the cart items count
      })
      .catch((err) => {
        console.log(err);
        // Handle error
      });
  };