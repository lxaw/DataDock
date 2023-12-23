/*
###############################################################################

Delta project

Authors:
Lexington Whalen (@lxaw)

File name:  DataDownload.js

Brief description: 
    This file defines the layout of the public data download page.

###############################################################################
*/




import React, {useState,useEffect} from 'react';
import { connect } from 'react-redux';
import {Link} from 'react-router-dom';
import DataSetTable from './DataSetTable';
import axios from "axios";

const DataDownload = (props) =>{
    // the csv files
    const [dataSets, setDataSets] = useState(undefined);

    // UTILITY: Grabs all public csv files
    const getCsvs = () =>{
        axios.get('/api/public_csvs/',{headers:{'Content-Type':'application/json','Authorization':`Token ${props.auth.token}`}})
        .then(res=>{
        setDataSets(res.data);
        })
    }
    
    // on load call this
    useEffect(()=>{
        getCsvs()
    },[])

    if (dataSets == undefined) return <div data-testid="data_download-1"></div>;
    console.log(dataSets)

    return(
        <div className="container" data-testid="data_download-1">
            <div>
                <h1>
                    Download Page  
                </h1>
                <p>
                    <em>Click </em> a file to add it to your download queue. Files in the queue will have a light blue background. 
                    To remove a file from the queue, reclick it.
                    You must click at least one file to be able to download. To download, click the cloud icon when having one or more files in the download queue.
                </p>
            </div>
            <DataSetTable 
            dataSets= {dataSets}
            textMinLength = {3}
            refreshCsvs = {getCsvs}
            />
        </div>
    )
}
const mapStateToProps = state => ({
  auth:state.auth
});

export default connect(mapStateToProps,{})(DataDownload);