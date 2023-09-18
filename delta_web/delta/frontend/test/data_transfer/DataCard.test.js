import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from "@testing-library/react"
import DataCard from '../../src/components/data_transfer/DataCard'
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
    render(
        <Provider store = {store}>
            <Router location={history.location} navigator={history}>
                <DataCard
                author = {"test"}
                date={"2022-02-11"}
                rating={5}
                downloadCount={1}
                title={"Title"}
                text={"text"}
                tags={[{text:"Hello"}]}
                link={"link.com"}
                />
            </Router>
        </Provider>
    )
    const reviewElement = screen.getByTestId('data_card-1');

    // should render
    expect(reviewElement).toBeInTheDocument();
})