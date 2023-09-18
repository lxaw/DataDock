/*
###############################################################################

Delta project

Authors:
Lexington Whalen (@lxaw)
Carter Marlowe (@Cmarlowe132)
Vince Kolb-LugoVince (@vancevince) 
Blake Seekings (@j-blake-s)
Naveen Chithan (@nchithan)

File name:  DataCard.js

Brief description: 
    When viewing public data, entries are shown via a data card which
displays all of the relevant information in an appealing manner. This file 
defines the layout of that data card and how it can be interacted with.

###############################################################################
*/



import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

import tag_styles from "./tags.module.css";

const DataCard = (props) => {

    const [toDownload,setToDownload] = useState(props.isDownload);
    const [style,setStyle] = props.isDownload == true ? useState({width:'25rem',backgroundColor:"#cce6ff"}) : useState({width:"25rem"});
    // UTILITY: Changes the ToDownload attribute of the DataCard when clicked.
    // UTILITY: Initial state is false, every click changes it to true and vice-versa.
    const checkDownload = (e) =>{
        e.preventDefault()
        if(toDownload){
            // uncheck
            setToDownload(false);
            setStyle({...style,backgroundColor:""})
            props.parentOnCheckChange(props.data)
        }else{
            setToDownload(true)
            setStyle({...style,backgroundColor:"#cce6ff"})
            props.parentOnCheckChange(props.data)
        }
    }

  return (
    <div className="card m-2 pt-2 pb-2" style={style} onMouseDown={checkDownload}
        data-testid="data_card-1"
    >
        <div className="card-body">
            <div className="d-flex justify-content-between">
                <p>
                    Author: <Link to={`/profile/${props.data.author_username}`}>{props.data.author_username}</Link>
                </p>
                <p>
                    Published: {props.data.formatted_date}
                </p>
            </div>
            <h6>Rating: {props.data.avg_rating}</h6>
            <small>Download count: {props.data.download_count}</small>
            <h6 className="card-title">
                File Name: {props.data.file_name}
            </h6>
            <p className="card-text">
                {props.data.description}
            </p>
            <div>
                <h6>Tags:</h6>
                {props.data.tags.map((tag,index)=>(
                    <div className={tag_styles.tag_item} key = {index}>
                        <span className={tag_styles.text}>
                            {tag.text}
                        </span>
                    </div>
                ))}
            </div>
        </div>
        <div className="d-flex justify-content-between">
            <Link to={props.link} className="btn btn-sm btn-primary">
                {props.linkText}
            </Link>
        </div>
    </div>
  )
}

export default DataCard;