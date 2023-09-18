/**********************************************
 * Delta Project
 * 
 * Authors:
 * Lexington Whalen (@lxaw)
 * Carter Marlowe (@Cmarlowe123)
 * Vince Kolb-Lugo (@vancevince)
 * Blake Seekings (@j-blake-s)
 * Naveen Chithan (@nchithan)
 * 
 * OrganizationCard.js
 * 
 * A functional component used to display identifying information for an
 * organization. Used in the Organization.js component as the item in the 
 * list of items to display, in this case a list of organizations registered
 * under the Delta app.
 *************************************************/

import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const OrganizationCard = (props) => {
    // hover changes color
    const [hover, setHover] = useState(false);

    const style = {
        background: hover ? '#cce6ff' : '',
        width: "21rem"
    }
    return (
        <div
            data-testid="organization_card-1"
            className="border card m-2" style={style} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
            <Link to={`/community/organizations/${props.orgObj.id}`} style={{ textDecoration: 'none' }}>
                {props.imgSrc != undefined &&
                    <div>
                        <img src={props.imgSrc} className="card-img-top" alt={`Image for ${props.orgObj.name}`} />
                    </div> 
                }
                <div className="card-body">
                    <h5 className="card-title">
                        {props.orgObj.name}
                    </h5>
                </div>
            </Link>
        </div>
    )
}

export default OrganizationCard