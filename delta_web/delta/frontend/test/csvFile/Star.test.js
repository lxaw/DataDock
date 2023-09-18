/** @jest-environment jsdom */
// https://www.youtube.com/watch?v=ML5egqL3YFE
import React from 'react'
import '@testing-library/jest-dom'
import {render, screen} from "@testing-library/react"
import StarSvg from '../../src/components/csvFile/StarSvg'
import { applyMiddleware, combineReducers, createStore } from 'redux'
import { createMemoryHistory } from '@remix-run/router'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import { Router } from 'react-router-dom'

import { Provider } from 'react-redux'

/*
Test rendering of star
*/
test('Should Render Star',()=>{
    const history = createMemoryHistory();
    const initialAuthState = {
        token: "TEST",
        isAuthenticated: true,
        isLoading: false,
        user: { id: 1,
            username:"testUser",
            first_name:"first",
            last_name:"last",
            email:"email",
            bio:"bio",
            organizations:[{name:"1"},],
            followed_organizations:[{}]
         }
    }
    const auth = function (state = initialAuthState, action) {
        return { ...state }
    }
    const reducers = combineReducers({
        auth
    })
    const initialState = {}
    const middleware = [thunk]
    const store = createStore(
        reducers,
        initialState,
        composeWithDevTools(applyMiddleware(...middleware))
    )

    const style = {fill:'none'}
    render(<Provider store={store}><StarSvg
        style={style}
        /></Provider>);
    const  star = screen.getByTestId('star');
    expect(star).toBeInTheDocument();
})