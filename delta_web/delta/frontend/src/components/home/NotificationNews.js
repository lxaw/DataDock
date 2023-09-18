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
 * NotificationNews.js
 *
 * Displays a news notification and gives it a button to allow the user to
 * read a notification.
 * By clicking the button the notification will be set as read.
 */
import React from "react";
import { connect } from "react-redux";
import { markReadNotificationNews } from "../../actions/notification";
import NotificationData from "./NotificationData";

const NotificationNews = (props) => {
  /*UTILITY: Reads the current notification
   *INPUTS: Makes use of the current notifications id
   *OUTPUTS: Updated notification data to be read and removed
   */
  const performRead = () => {
    props.markReadNotificationNews(props.notif.id);
    props.parentRemoveNotif(props.notif.id);
  };

  return (
    <div>
      <NotificationData 
      notif={props.notif} 
      parentOnClick={performRead}
      />
    </div>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { markReadNotificationNews })(
  NotificationNews
);
