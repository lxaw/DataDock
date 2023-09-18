/**************************************************
 * Delta Project
 * 
 * Authors:
 * Lexington Whalen (@lxaw)
 * Carter Marlowe (@Cmarlowe123)
 * Vince Kolb-Lugo (@vancevince)
 * Blake Seekings (@j-blake-s)
 * Naveen Chithan (@nchithan)
 * 
 * OrganizationDetail.js
 * 
 * This is a detailed view of an organization registered under the 
 * Delta project. Here app users can see reviews of the organization 
 * posted by other users. Users can search for a file name or by tag.
 * Contains a PublicCsvFileTable component to display reviews and 
 * reviewer information.
 *************************************************/
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import PublicCsvFileTable from "../data_transfer/PublicCsvFileTable";

const OrganizationDetail = (props) => {
    // in reality you would use a function to grab organization data 
    // based on the passed id
    const [data, setData] = useState(null);
    const [dataPosts, setDataPosts] = useState(null);

    const { id } = useParams();

    /**getData
    * UTILITY: Gets an organization's data by its ID
    * INPUTS: None
    * OUTPUTS: An organization object with its identifying information
    */
    const getData = () => {
        axios.get('/api/organization/' + id + '/')
            .then((res) => {
                setData(res.data);
            })
    }

    /**getPosts
     * UTILITY: Fetches an organization's posts (reviews, csv files)
     * INPUTS: None
     * OUTPUTS: List of data posts associated with the organization
     */
    const getPosts = () => {
        axios.get('/api/organization/' + id + '/data_posts/', { headers: { 'Content-Type': 'application/json', 'Authorization': `Token ${props.auth.token}` } })
            .then((res) => {
                setDataPosts(res.data);
                console.log(res.data)
            })
    }

    useEffect(() => {
        getData();
        getPosts();
    }, []);

    // check that data has loaded
    if (data == null || dataPosts == null) return <div data-testid="organization_detail-1"></div>;

    return (
        <div className="container" data-testid="organization_detail-1">
            <div>
                <h1>Organization Name: {data.name}</h1>
                <p>Number of users: {data.following_user_count}</p>
                <hr />
                <div>
                    <p>Organization description:</p>
                    <p>
                        <i>
                            {data.description}
                        </i>
                    </p>
                </div>
                <h4>
                    All files under this organization
                </h4>
                <small>
                    When you upload a file, you can set it to be under any of the organizations you are also a part of.
                </small>
                <hr />

                <div>
                    <PublicCsvFileTable csvs={dataPosts} textMinLength={3} />
                </div>

                <span>
                    <Link className="btn btn-secondary btn-sm" to="/community/organizations">
                        Back to Organizations
                    </Link>
                </span>
            </div>
        </div>
    );
}

const mapStateToProps = state => ({
    auth: state.auth,
})

export default connect(mapStateToProps, {})(OrganizationDetail);