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
 * Displays a whats hot notification and gives it a button to allow the user to
 * read a notification.
 * By clicking the button the notification will be set as read.
 */
import React from "react";
import { connect } from "react-redux";
import { markReadNotificationWhatsHot } from "../../actions/notification";
import NotificationData from "./NotificationData";

const NotificationNews = (props) => {
  /*UTILITY: Reads the current notification
   *INPUTS: Makes use of the current notifications id
   *OUTPUTS: Updated notification data to be read and removed
   */
  const performRead = () => {
    props.markReadNotificationWhatsHot(props.notif.id);
    props.parentRemoveNotif(props.notif.id);
  };

  return (
      <NotificationData 
        notif={props.notif} 
        parentOnClick = {performRead}
      />
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { markReadNotificationWhatsHot })(
  NotificationNews
);
