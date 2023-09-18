/************************************************
 * Delta Project
 * 
 * Authors:
 * Lexington Whalen (@lxaw)
 * Carter Marlowe (@Cmarlowe123)
 * Vince Kolb-Lugo (@vancevince)
 * Blake Seekings (@j-blake-s)
 * Naveen Chithan (@nchithan)
 * 
 * Organizations.js
 * 
 * This page displays all organizations registered with the Delta project.
 * Just makes a call to the organizations api to retrieve data and displays it
 * in an OrganizationCard. This page jumps to more detailed pages for 
 * each organization.
 ***********************************************/

import axios from 'axios';
import React, { Component, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import OrganizationCard from './OrganizationCard';

const Organizations = (props) => {
    // grab oraganization information
    const [orgData, setOrgData] = useState(null);

    // check that data loads
    useEffect(() => {
        axios.get('/api/organization/').then((res) => {
            setOrgData(res.data);
        })
            .catch(err => {
                console.log(err)
            })
    }, [])
    if (orgData == null) return <div data-testid="organizations-1"></div>;

    return (
        <div className="container" data-testid="organizations-1">
            <div>
                <h1 className="text-center">
                    Organizations
                </h1>
                <p className="text-center">
                    Here you can see all organizations registered with Delta. Click an organization to view it.
                </p>
            </div>
            <div className='row'>
                {orgData.map((item, index) => (
                    <OrganizationCard
                        orgObj={item}
                        imgSrc={'/media/Generic_Laboratory_Logo.png'}
                        key={index}
                    />
                ))}
            </div>
        </div>
    )
}


export default Organizations;