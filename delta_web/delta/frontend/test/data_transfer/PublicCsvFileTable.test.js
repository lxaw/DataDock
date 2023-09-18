import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from "@testing-library/react"
import PublicCsvFileTable from '../../src/components/data_transfer/PublicCsvFileTable'
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
    const csvs = [{
        "id":1,
        "tags":[{"text":"Hello"}]
    }]

    render(
        <Provider store = {store}>
            <Router location={history.location} navigator={history}>
                <PublicCsvFileTable
                    csvs={csvs}
                />
            </Router>
        </Provider>
    )
    const reviewElement = screen.getByTestId('public_csv_file_table-1');
    // should render
    expect(reviewElement).toBeInTheDocument();
})