import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from "@testing-library/react"
import ReviewDetail from '../../src/components/csvFile/ReviewDetail'
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

    // data to pass into thumb
    const csvFile = {
        "id":1,
        "formatted_date":"2022-01-22",
        "author_username":"lex",
        "download_count":1,
        "file_name":"AwesomeFile.csv",
        "description":"Hello worlds!",
        "tags":[{"text":'here'}],
        "org_objs":[{id:1,name:"ValafarLab"}]
    }

    render(
        <Provider store = {store}>
            <Router location={history.location} navigator={history}>
                <ReviewDetail
                csvFile = {csvFile}
                />
            </Router>
        </Provider>
    )
    const reviewElement = screen.getByTestId('review_detail-1');

    // should render
    expect(reviewElement).toBeInTheDocument();
})