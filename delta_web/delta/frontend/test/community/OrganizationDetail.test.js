import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from "@testing-library/react"
import OrganizationDetail from '../../src/components/community/OrganizationDetail'
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
    const data = {
        name:'OrgName',
        following_user_count : 1,
        description : "Hello world!",
    };
    const dataPosts = [
        {
            author_username:"bill",
            formatted_date:"2022-2-2",
            rating:1,
            title:"Title",
            id:1,
            file_name:"NameOfFile.csv",
            description:"Description",
            tags:[{text:"Here"}],
            download_count:10,
        }
    ]

    render(
        <Provider store = {store}>
            <Router location={history.location} navigator={history}>
                <OrganizationDetail
                    data={data}
                    dataPosts={dataPosts}
                />
            </Router>
        </Provider>
    )
    const reviewElement = screen.getByTestId('organization_detail-1');

    // should render
    expect(reviewElement).toBeInTheDocument();
})