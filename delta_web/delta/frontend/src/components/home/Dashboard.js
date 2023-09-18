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
 * Dashboard.js
 *
 * Defines the home page that a user is brought to after logging in.
 * Contains the notification scrollers that display any notifications that a user has built up.
 */
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import NotificationNews from "./NotificationNews";
import NotificationWhatsHot from "./NotificationWhatsHot";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "./dashboard.css";
import axios from "axios";

const Dashboard = (props) => {
  const [arrNotificationNews, setArrNotificationNews] = useState([]);
  const [arrNotificationWhatsHot, setArrNotificationWhatsHot] = useState([]);

  const data = [];

  /*UTILITY: Retrieves all of the unread news notifications that a user has
   *INPUTS: The user's token for authorization.
   *OUTPUTS: Sets the notification news array to the retrieved data.
   */
  const getNotificationNews = () => {
    axios
      .get("/api/notification_news/get_unread", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${props.auth.token}`,
        },
      })
      .then((res) => {
        setArrNotificationNews(res.data);
      });
  };

  /*UTILITY: Retrieves all of the unread what's hot notifications that a user has
   *INPUTS: The user's token for authorization.
   *OUTPUTS: Sets the notification what's hot array to the retrieved data.
   */
  const getNotificationWhatsHot = () => {
    axios
      .get("/api/notification_whats_hot/get_unread", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${props.auth.token}`,
        },
      })
      .then((res) => {
        setArrNotificationWhatsHot(res.data);
      });
  };

  useEffect(() => {
    getNotificationNews();
    getNotificationWhatsHot();
  }, []);

  /*UTILITY: Removes a news notification once the user has selected they've read it
   *INPUTS: ID of the news notification to be removed.
   *OUTPUTS: New array of news notifications without the removed notification.
   */
  const removeNotificationNews = (id) => {
    let newNotifs = arrNotificationNews.filter((item) => item.id != id);
    setArrNotificationNews(newNotifs);
  };

  /*UTILITY: Removes a what's hot notification once the user has selected they've read it
   *INPUTS: ID of the what's hot notification to be removed.
   *OUTPUTS: New array of what's hot notifications without the removed notification.
   */
  const removeNotificationWhatsHot = (id) => {
    let newNotifs = arrNotificationWhatsHot.filter((item) => item.id != id);
    setArrNotificationWhatsHot(newNotifs);
  };

  if (props.auth.user.username == undefined) return;

  return (
    <div className="container">
      <h1>
        Welcome back <strong>{props.auth.user.username}</strong>.
      </h1>
      <h3>Here's what you've missed.</h3>

      <div>
        <h5>Recent News in Delta</h5>
        {arrNotificationNews.length != 0 ? (
          <div
            className="box shadow-sm rounded bg-light mb-3 border border-gray"
            style={{ height: "40vh" }}
          >
            <Swiper
              navigation={true}
              modules={[Navigation]}
              className="mySwiper"
            >
              {arrNotificationNews.map((data, index) => (
                <SwiperSlide key={index}>
                  <NotificationNews
                    parentRemoveNotif={removeNotificationNews}
                    notif={data}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        ) : (
          <div>
            <p>Looks like you're all caught up. Well done!</p>
          </div>
        )}
      </div>

      <div>
        <h5>Whats Hot in Delta</h5>
        {arrNotificationWhatsHot.length != 0 ? (
          <div
            className="box shadow-sm rounded bg-light mb-3 border border-gray"
            style={{ height: "40vh" }}
          >
            <Swiper
              navigation={true}
              modules={[Navigation]}
              className="mySwiper"
            >
              {arrNotificationWhatsHot.map((data, index) => (
                <SwiperSlide index={index}>
                  <NotificationWhatsHot
                    parentRemoveNotif={removeNotificationWhatsHot}
                    notif={data}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        ) : (
          <div>
            <p>Looks like you're all caught up. Well done!</p>
          </div>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, {})(Dashboard);
