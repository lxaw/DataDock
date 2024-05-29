import { UPDATE_CART_ITEMS } from '../actions/types';

export const updateCartItems = (count) => ({
  type: UPDATE_CART_ITEMS,
  payload: count,
});

export const initializeCart = () => (dispatch, getState) => {
  // Check if auth user data is available
  const authUser = getState().auth.user;
  if (authUser) {
    const numCartItems = authUser.num_cart_items || 0;
    dispatch(updateCartItems(numCartItems));
  }
};


const initialState = {
  numCartItems: 0,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case UPDATE_CART_ITEMS:
      return {
        ...state,
        numCartItems: action.payload,
      };
    default:
      return state;
  }
}