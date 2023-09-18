import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from "@testing-library/react"
import Personal from '../../src/components/profile/Personal'
import { Provider } from 'react-redux'
import { applyMiddleware, combineReducers, createStore } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import { Router } from 'react-router-dom'

import { createMemoryHistory } from '@remix-run/router'

/*
Test creating an organization thumbnail
*/
test("Should create personal page",()=>{
    const history = createMemoryHistory();
    const initialAuthState = {
        token: "TEST",
        isAuthenticated: true,
        isLoading: false,
        user: { id: 1 }
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

    // data to pass into thumb

    render(
        <Provider store = {store}>
            <Personal
                csvFiles={{org:{name:1}}}
            />
        </Provider>
    )
    const reviewElement = screen.getByTestId('personal-1');

    // should render
    expect(reviewElement).toBeInTheDocument();
})
