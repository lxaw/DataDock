import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import {HashRouter as Router, Route,Routes} from 'react-router-dom';
import PrivateRoute from './common/PrivateRoute';

import { Provider as AlertProvider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";

import Header from './layout/Header';
import Dashboard from './home/Dashboard';
import Alerts from './layout/Alerts';
import Login from './accounts/Login';
import Register from './accounts/Register';
import NotFound from './home/NotFound'
// about page
import About from './about/About';

// profile
/*
NOTE: 
ANYTHING THAT NEEDS MAP STATE DOES NOT USE SQUARE BRACKETS
https://stackoverflow.com/questions/70140588/const-authenticated-this-props-is-undefined-though-i-can-clearly-see-it-in
*/
import ProfileGlance from "./profile/ProfileGlance";
import ProfileDetailed from "./profile/ProfileDetailed";
// community
import Organizations from "./community/Organizations"
import OrganizationDetail from "./community/OrganizationDetail"

// csvFiles
import CsvFileDetail from "./csvFile/CsvFileDetail";
import CsvFileEdit from "./csvFile/CsvFileEdit";

// data page
import DataDownload from "./data_transfer/DataDownload";
import DataUpload from "./data_transfer/DataUpload";
// private routes

import { Provider } from 'react-redux';
import store from "../store";
import {loadUser} from '../actions/auth';

// react 18
// https://reactjs.org/blog/2022/03/08/react-18-upgrade-guide.html
import {createRoot} from "react-dom/client";
import NotificationReviewIndex from './notifications/NotificationReviewIndex';
import NotificationMessageIndex from './notifications/NotificationMessageIndex';

// public profile
import PublicProfile from './profile/PublicProfile';

// conversations
import ConversationDetail from './conversations/ConversationDetail';

// Review
import ReviewDetail from './csvFile/ReviewDetail';

// Alert options
const alertOptions = {
    timeout: 3000,
    position: 'top center'
};

class App extends Component{
    // fire when main app is loaded
    componentDidMount(){
        store.dispatch(loadUser());
    };


    render(){
        return(
            <Provider store={store}>
                <AlertProvider template = {AlertTemplate}{...alertOptions}>
                    <Router>
                        <Fragment>
                            <Header/>
                            <Alerts/>
                                <Routes>
                                    <Route exact path ="/dashboard" element= {
                                        <PrivateRoute>
                                            <Dashboard/>
                                        </PrivateRoute>
                                    }/>
                                    {/* Public profile */}
                                    <Route exact path ="/profile/:username" element={
                                        <PrivateRoute>
                                            <PublicProfile />
                                        </PrivateRoute>
                                    }/>

                                    {/* Notifications */}
                                    <Route exact path ="/notifications/reviews" element={
                                        <PrivateRoute>
                                            <NotificationReviewIndex/>
                                        </PrivateRoute>
                                    }/>
                                    {/* Messages */}
                                    <Route exact path ="/notifications/messages" element = {
                                        <PrivateRoute>
                                            <NotificationMessageIndex/>
                                        </PrivateRoute>
                                    }/>
                                    {/* Conversations */}
                                    <Route exact path ="/messages/conversations/:id" element = {
                                        <PrivateRoute>
                                            <ConversationDetail/>
                                        </PrivateRoute>
                                    }/>

                                    {/* Need to use private routes here */}
                                    <Route exact path ="/profile/glance" element={
                                        <PrivateRoute>
                                            <ProfileGlance/>
                                        </PrivateRoute>
                                    }/>
                                    <Route exact path ="/profile/detailed" element={
                                        <PrivateRoute>
                                            <ProfileDetailed/>
                                        </PrivateRoute>
                                    }/>
                                    <Route exact path ={"/csvs/:id"} element={
                                        <PrivateRoute>
                                            <CsvFileDetail/>
                                        </PrivateRoute>
                                    }/>
                                    <Route exact path ={"/csvs/:id/edit"} element={
                                        <PrivateRoute>
                                            <CsvFileEdit/>
                                        </PrivateRoute>
                                    }/>
                                    <Route exact path ="/community/organizations" element={
                                        <PrivateRoute>
                                            <Organizations/>
                                        </PrivateRoute>
                                    }/>
                                    <Route exact path ={"/community/organizations/:id"} element={
                                        <PrivateRoute>
                                            <OrganizationDetail/>
                                        </PrivateRoute>
                                    }/>

                                    <Route exact path ="/data/download" element={
                                        <PrivateRoute>
                                            <DataDownload></DataDownload>
                                        </PrivateRoute>
                                    }/>
                                    <Route exact path ="/data/upload" element={
                                        <PrivateRoute>
                                            <DataUpload/>
                                        </PrivateRoute>
                                    }/>
                                    <Route exact path ="/reviews/:id" element={
                                        <PrivateRoute>
                                            <ReviewDetail/>
                                        </PrivateRoute>
                                    } />
                                    
                                    <Route exact path ="/register"element={
                                        <Register/>
                                    }/>
                                    <Route exact path ="/login" element={
                                        <Login/>
                                    }/>
                                    <Route exact path = "/" element = {
                                        <About/>
                                    }/>
                                    <Route exact path ="*" element={
                                        <NotFound/>
                                    }/>
                                </Routes>
                        </Fragment>
                    </Router>
                </AlertProvider>
            </Provider>
        )
    }
}

const container = document.getElementById('app');
const root = createRoot(container);
root.render(<App />);