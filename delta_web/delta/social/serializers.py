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
# File name: serializers.py
#
# Brief description: Defines the functions to be performed on the social models. Breaks down querysets
# into native python data types to facilitate data transfer.

#
from rest_framework import serializers
from .models import (Review,NotificationReview,
NotificationWhatsHot,NotificationNews,
Conversation,Message,NotificationMessage)

from rest_framework.validators import UniqueTogetherValidator
from rest_framework.decorators import action

# Serializer for review class
class SerializerReview(serializers.ModelSerializer):
    author_username = serializers.SerializerMethodField()
    formatted_date = serializers.SerializerMethodField()
    # to get the user who recieved the review
    recipient_id = serializers.SerializerMethodField()

    class Meta:
        model = Review
        fields = "__all__"

        validators = [
            UniqueTogetherValidator(
                queryset = Review.objects.all(),
                fields=['author','title']
            )
        ]

    # UTILITY: Gets the review author's name
    # INPUT: Current review object instance and reviewer's name
    # OUTPUT: String of the author's name
    def get_author_username(self,obj):
        return obj.author.username

    # UTILITY: Gets the date the review was posted
    # INPUT: Current review object instance
    # OUTPUT: Formatted string for review's publish date
    def get_formatted_date(self,obj):
        return obj.pub_date.strftime('%Y-%m-%d')

    # UTILITY: Gets the id of the user who RECEIVED the review
    # INPUT: Current review object instance
    # OUTPUT: String of the id of the user who RECEIVED the review
    def get_recipient_id(self,obj):
        return obj.file.author.id

# serializer for review notification class
class SerializerNotificationReview(serializers.ModelSerializer):
    sender_username = serializers.SerializerMethodField()
    formatted_date = serializers.SerializerMethodField()
    file_id = serializers.SerializerMethodField()
    class Meta:
        model = NotificationReview
        fields = "__all__"

    # UTILITY: Gets the notification-of-review author's name
    # INPUT: Current notification-of-review object instance and notification-of-review's name
    # OUTPUT: String of the author's name
    def get_sender_username(self,obj):
        return obj.sender.username

    # UTILITY: Gets the date the notification-of-review was posted
    # INPUT: Current notification-of-review object instance
    # OUTPUT: Formatted string for notification-of-reviewer's publish date
    def get_formatted_date(self,obj):
        return obj.pub_date.strftime('%Y-%m-%d')

    # UTILITY: Gets the id of the file for the notification-of-review
    # INPUT: Current notification-of-review object instance
    # OUTPUT: String of the notification-of-reviewer's file id
    def get_file_id(self,obj):
        return obj.review.file.id

# serializer for news notification class
class SerializerNotificationNews(serializers.ModelSerializer):
    formatted_date = serializers.SerializerMethodField()
    class Meta:
        model = NotificationNews
        fields = "__all__"

    # UTILITY: Gets the date the news notification was posted
    # INPUT: Current news notification object instance
    # OUTPUT: Formatted string for news notification's publish date
    def get_formatted_date(self,obj):
        return obj.pub_date.strftime('%Y-%m-%d')

# serializer for WhatsHot notification class
class SerializerNotificationWhatsHot(serializers.ModelSerializer):
    formatted_date = serializers.SerializerMethodField()
    class Meta:
        model = NotificationWhatsHot
        fields = "__all__"

    # UTILITY: Gets the date the WhatsHot notification was posted
    # INPUT: Current WhatsHot notification object instance
    # OUTPUT: Formatted string for WhatHot publish date
    def get_formatted_date(self,obj):
        return obj.pub_date.strftime('%Y-%m-%d')

# serializer for Conversation class
class SerializerConversation(serializers.ModelSerializer):
    author_username = serializers.SerializerMethodField()
    other_user_username= serializers.SerializerMethodField()
    messages = serializers.SerializerMethodField()

    class Meta:
        model = Conversation
        fields = "__all__"
    
    # UTILITY: Gets name of the author (initiator) of conversation
    # INPUT: Current conversation object instance
    # OUTPUT: Formatted string for conversation starter's name
    def get_author_username(self,obj):
        return obj.author.username

    # UTILITY: Gets the name of the other user who is part of conversation class
    # INPUT: Current conversation object instance
    # OUTPUT: Formatted string for other user who in conversation
    def get_other_user_username(self,obj):
        return obj.other_user.username
    
    # UTILITY: Gets the date the notification-of-review was posted
    # INPUT: Current notification-of-review object instance
    # OUTPUT: Formatted string for notification-of-reviewer's publish date
    def get_messages(self,obj):
        return SerializerMessage(obj.convo_message_set.all(),many=True).data

# serializer for Message class    
class SerializerMessage(serializers.ModelSerializer):
    author_username = serializers.SerializerMethodField()
    formatted_date = serializers.SerializerMethodField()
    recipient_username = serializers.SerializerMethodField()

    class Meta:
        model = Message
        fields = "__all__"

    # UTILITY: Gets the username of the author of the message
    # INPUT: Current message object instance
    # OUTPUT: Formatted string for message author's name
    def get_author_username(self,obj):
        return obj.author.username

    # UTILITY: Gets the date the notification-of-review was posted
    # INPUT: Current notification-of-review object instance
    # OUTPUT: Formatted string for notification-of-reviewer's publish date
    def get_recipient_username(self,obj):
        return obj.recipient.username

    # UTILITY: Gets the date the message was sent
    # INPUT: Current message object instance
    # OUTPUT: Formatted string for message's publish date
    def get_formatted_date(self,obj):
        return obj.pub_date.strftime('%H:%M, %Y-%m-%d')

# serializer for Notification Message class
class SerializerNotificationMessage(serializers.ModelSerializer):
    sender_username = serializers.SerializerMethodField()
    recipient_username = serializers.SerializerMethodField()
    formatted_date = serializers.SerializerMethodField()
    convo_id = serializers.SerializerMethodField()

    class Meta:
        model = NotificationMessage
        fields = "__all__"
    
    # UTILITY: Gets the username of the message sender
    # INPUT: Current notification message object instance
    # OUTPUT: Formatted string of message's sender
    def get_sender_username(self,obj):
        return obj.sender.username

    # UTILITY: Gets the username of the message recipient
    # INPUT: Current notification message object instance
    # OUTPUT: Formatted string of message recipient's username
    def get_recipient_username(self,obj):
        return obj.recipient.username

    # UTILITY: Gets the date the notification-of-review was posted
    # INPUT: Current notification-of-review object instance
    # OUTPUT: Formatted string for publish date of notification message
    def get_formatted_date(self,obj):
        return obj.pub_date.strftime('%H:%M, %Y-%m-%d')
    
    # UTILITY: Gets the ID of the converation object
    # INPUT: Current notification message object instance
    # OUTPUT: Formatted string of conversation ID
    def get_convo_id(self,obj):
        return obj.message.convo.id