########################
#
# Delta project.
#
# Authors:
# Lexington Whalen (@lxaw)
# Carter Marlowe (@Cmarlowe132)
# Vince Kolb-LugoVince (@vancevince) 
# Blake Seekings (@j-blake-s)
# Naveen Chithan (@nchithan)
#
# File name:
# urls.py
# Brief description:
# Routes the API endpoints to a URL.
#
from django.urls import path

from rest_framework import routers
from .api import (ViewsetReview,ViewsetNotificationReview,
ViewsetConversation,ViewsetMessage,ViewsetNotificationMessage,
ViewsetNotificationNews,ViewsetNotificationWhatsHot
)

router = routers.DefaultRouter()
router.register('api/review',ViewsetReview,'Reviews')
router.register('api/notification_review',ViewsetNotificationReview,"NotificationReviews")
router.register('api/notification_message',ViewsetNotificationMessage,"NotificationMessage")
router.register('api/notification_news',ViewsetNotificationNews,"NotificationNews")
router.register('api/notification_whats_hot',ViewsetNotificationWhatsHot,"NotificationWhatsHot")
router.register('api/conversation',ViewsetConversation,"Conversations")
router.register('api/message',ViewsetMessage,"Messages")

urlpatterns = router.urls