/**
 * Delta Project
 *
 * Authors:
 * Lexington Whalen (@lxaw)
 * Carter Marlowe (@Cmarlowe123)
 * Vince Kolb-Lugo (@vancevince)
 * Blake Seekings (@j-blake-s)
 * Naveen Chithan (@nchithan)
 *
 * NotificationData.js
 *
 * Defines the individual card for notifications.
 * Takes in the title, notification detail, and date of the notification and
 * orients it.
 */
import React from "react";

// holds data for notifications
const NotificationData = (props) => {
  return (
    <div className="container">
      <div
        className="position-relative border rounded mx-5 my-2 bg-white p-3"
        style={{ height: "37vh" }}
      >
        <div>
          <div className="justify-content-between">
            <h4>
              {props.notif.title}
            </h4>
            <p>
              {props.notif.formatted_date}
            </p>
          </div>
          <p className="small">
            {props.notif.text}
          </p>
          <button className="btn btn-outline-success position-absolute bottom-0 mb-3"
            onClick={props.parentOnClick}>Got it!
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationData;
