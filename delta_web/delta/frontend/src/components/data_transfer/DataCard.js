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



import React, { useState } from 'react'
import { Link } from 'react-router-dom';

import tag_styles from "./tags.module.css";

const DataCard = (props) => {

    const predefinedStyles = {
        'height':'20rem',
        'width' :'30rem'
    }

    const [style,setStyle] = props.isDownload == true ? 


    useState({width:predefinedStyles['width'],height:predefinedStyles['height'],backgroundColor:"#cce6ff"}) : 
    useState({width:predefinedStyles['width'],height:predefinedStyles['height']});

  return (
    <div className="card" style={style}  data-testid="data_card-1">
      <div className="card-body">
        <div className="d-flex justify-content-between">
          <div>
            <h6 className="card-title">
              {props.data.name}
            </h6>
            <p className="m-0">Rating: {props.data.avg_rating}</p>
            <p>Download count: {props.data.download_count}</p>
          </div>
          <div>
            <p>
              <Link to={`/profile/${props.data.author_username}`}>{props.data.author_username}</Link>@{props.data.formatted_date}
            </p>
          </div>
        </div>
        <p className="card-text">
          {props.data.description}
        </p>
      </div>
      <div>
        <h6>Tags:</h6>
        {props.data.tags.map((tag, index) => (
          <div className={tag_styles.tag_item} key={index}>
            <span className={tag_styles.text}>
              {tag.text}
            </span>
          </div>
        ))}
      </div>
      <div>
        <Link to={props.link} className="btn btn-sm btn-primary">
          {props.linkText}
        </Link>
      </div>
    </div>
  );
}

export default DataCard;