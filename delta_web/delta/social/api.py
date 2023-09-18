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
# File name: api.py
#
# Brief description: Constains the rules for how to interact with the server side of the 
# Delta project.
#
from rest_framework import viewsets, permissions
from rest_framework.response import Response

from .serializers import (SerializerReview,SerializerNotificationReview,
SerializerConversation,SerializerMessage,SerializerNotificationMessage,
SerializerNotificationWhatsHot,SerializerNotificationNews
)
from data.models import CSVFile

from rest_framework.decorators import action
from rest_framework.response import Response

from django.contrib.auth import get_user_model

from .models import (Conversation,Message,Review,
NotificationMessage,NotificationReview)

# https://stackoverflow.com/questions/739776/how-do-i-do-an-or-filter-in-a-django-query
from django.db.models import Q

User = get_user_model()

# review api 
class ViewsetReview(viewsets.ModelViewSet):
    # need to be logged in (ie have an API key) to use this resource
    permission_classes = [
        permissions.IsAuthenticated,
    ]
    serializer_class = SerializerReview

    # get all of the user's created reviews
    def get_queryset(self):
        return self.request.user.review_set.all().order_by('-pub_date')
    
    # create an object
    def perform_create(self,serializer):
        modelCsvFile = CSVFile.objects.get(pk=self.request.data['file'])
        modelReview = serializer.save(author=self.request.user,file=modelCsvFile)
        # create Notification
        #
        reviewText = self.request.data["text"]
        csvFileName = modelCsvFile.file_name
        # prepare notification text
        notifText = f"Review of file {csvFileName} from user {self.request.user}. \n\"{reviewText}\""
        modelNotif = NotificationReview(sender = self.request.user,recipient = modelCsvFile.author,review=modelReview,text=notifText)
        modelNotif.save()

    # get an instance of an object
    def retrieve(self,request,pk=None):
        return Response(self.serializer_class(Review.objects.get(pk=pk)).data)

    # update an object
    def partial_update(self,request,*args,**kwargs):
        super().partial_update(request,*args,**kwargs)
        return Response(self.serializer_class(Review.objects.get(pk=kwargs['pk'])).data)

# notification API
class ViewsetNotificationReview(viewsets.ModelViewSet):
    # need to be logged in (have an API key) to access
    permission_classes = [
        permissions.IsAuthenticated,
    ]
    serializer_class = SerializerNotificationReview

    # get all notifications, order them by publication date
    def get_queryset(self):
        return self.request.user.recipient_notification_post_set.all().order_by('-pub_date')
    
    # create a notification
    def perform_create(self,serializer):
        serializer.save()
    
    # get all unread posts
    @action(methods=['get'],detail=False)
    def get_unread(self,request):
        return Response(SerializerNotificationReview(self.request.user.recipient_notification_post_set.filter(read=False).order_by('-pub_date'),many=True).data)
    
    # perform the read action on a notification
    @action(methods=['get'],detail=True)
    def perform_read(self,*args,**kwargs):
        instance = self.get_object()
        instance.read = True
        instance.save()
        return Response(self.get_serializer(instance).data)

# notification API
class ViewsetNotificationWhatsHot(viewsets.ModelViewSet):
    permission_classes = [
        permissions.IsAuthenticated,
    ]
    serializer_class = SerializerNotificationWhatsHot

    def get_queryset(self):
        return self.request.user.recipient_notification_whats_hot_set.all().order_by('-pub_date')
    
    def perform_create(self,serializer):
        serializer.save()
    
    # get all unread posts
    @action(methods=['get'],detail=False)
    def get_unread(self,request):
        return Response(SerializerNotificationWhatsHot(self.request.user.recipient_notification_whats_hot_set.filter(read=False).order_by('-pub_date'),many=True).data)
    
    @action(methods=['get'],detail=True)
    def perform_read(self,*args,**kwargs):
        instance = self.get_object()
        instance.read = True
        instance.save()
        return Response(self.get_serializer(instance).data)

# notification API
class ViewsetNotificationNews(viewsets.ModelViewSet):
    permission_classes = [
        permissions.IsAuthenticated,
    ]
    serializer_class = SerializerNotificationNews

    def get_queryset(self):
        return self.request.user.recipient_notification_news_set.all().order_by('-pub_date')
    
    def perform_create(self,serializer):
        serializer.save()
    
    # get all unread posts
    @action(methods=['get'],detail=False)
    def get_unread(self,request):
        return Response(SerializerNotificationNews(self.request.user.recipient_notification_news_set.filter(read=False).order_by('-pub_date'),many=True).data)
    
    @action(methods=['get'],detail=True)
    def perform_read(self,*args,**kwargs):
        instance = self.get_object()
        instance.read = True
        instance.save()
        return Response(self.get_serializer(instance).data)

class ViewsetConversation(viewsets.ModelViewSet):
    permission_classes = [
        permissions.IsAuthenticated
    ]
    serializer_class = SerializerConversation
    
    def get_queryset(self):
        # simply get all conversations that user created
        return self.request.user.author_conversation_set.all().order_by('-pub_date')
    
    def retrieve(self,request,pk=None):
        return Response(self.serializer_class(Conversation.objects.get(pk=pk)).data)
    
    @action(methods=['post'],detail=False)
    def get_convos_with_user(self,request):
        # get all conversations with another user
        # two cases for lookups, need the union of them
        # 1. You created the conversation, so the other user is a partner (your_created_convos)
        # 2. The other user created a conversation, so you are partner (other_created_convos)
        other_user = User.objects.get(username=request.data.get('other_user_username'))

        your_created_convos = self.request.user.author_conversation_set.all().filter(other_user=other_user)
        your_participate_convos = self.request.user.participant_conversation_set.all().filter(author=other_user)
        total_convos = your_created_convos.union(your_participate_convos)
        total_convos = total_convos.order_by('-pub_date')

        return Response(self.get_serializer(total_convos,many=True).data)

    def create(self,request):
        author = User.objects.get(pk=request.data.get('author'))
        other_user = User.objects.get(username=request.data.get('other_user_username'))

        instance = Conversation(other_user=other_user,author=author,title=request.data.get('title'))
        instance.save()

        return Response(self.get_serializer(instance).data)
    
class ViewsetMessage(viewsets.ModelViewSet):
    permission_classes = [
        permissions.IsAuthenticated,
    ]
    serializer_class = SerializerMessage

    # return all of users messages (created by user)
    def get_queryset(self):
        return self.request.user.author_message_set.all().order_by('-pub_date')
    
    @action(methods=['post'],detail=False)
    def get_messages_under_convo(self,request):
        # get all messages under a conversation
        convo = Conversation.objects.get(pk=request.data.get('convo_id'))
        return Response(self.get_serializer(convo.convo_message_set.all(),many=True).data)

    def create(self,request):
        author = User.objects.get(pk=request.data.get('author_id'))
        other_user = User.objects.get(username=request.data.get('other_user_username'))
        text = request.data.get('text')
        convo = Conversation.objects.get(pk=request.data.get('convo_id'))

        # create message
        message = Message(author=author,recipient=other_user,text=text,convo=convo)
        message.save()

        return Response(self.get_serializer(message).data)

# Notification Message API
class ViewsetNotificationMessage(viewsets.ModelViewSet):
    permission_classes = [
        permissions.IsAuthenticated,
    ]
    serializer_class = SerializerNotificationMessage

    def get_queryset(self):
        return self.request.user.sender_notification_message_set.all().order_by('-pub_date')
    
    def perform_create(self,serializer):
        serializer.save()

    @action(methods=['get'],detail=True)
    def perform_read(self,*args,**kwargs):
        instance = NotificationMessage.objects.get(pk=kwargs['pk'])
        instance.read = True
        instance.save()
        return Response(self.get_serializer(instance).data)

    # get all unread posts
    @action(methods=['get'],detail=False)
    def get_unread(self,request):
        return Response(self.get_serializer(self.request.user.recipient_notification_message_set.filter(read=False).order_by('-pub_date'),many=True).data)