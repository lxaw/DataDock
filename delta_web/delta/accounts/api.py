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
#
# api.py
# Brief description:
#
# Is the API functionality for the `accounts` app of Django.
# Deals with all user actions, such as registration, login, logout, et cetera.

from unicodedata import name
from rest_framework import generics, permissions
from rest_framework.response import Response
from organizations.models import Organization
from rest_framework import status
from rest_framework.decorators import action
from knox.models import AuthToken
from .serializers import UserSerializer,RegisterSerializer,LoginSerializer,PublicUserSerializer
from organizations.serializers import OrganizationSerializer

from rest_framework import viewsets, permissions

# Email validation
from email_validator import validate_email, EmailNotValidError

from django.contrib.auth import get_user_model

# Profiles
from .models import Profile

# Notifications
from social.models import (NotificationNews,NotificationWhatsHot)

User = get_user_model()

# Register API
# Used to register new users.
# To register new users, hit the endpoint given in this folder's `urls.py` using a POST method.
class RegisterAPI(generics.GenericAPIView):
    serializer_class = RegisterSerializer

    # Handling post request
    def post(self,request,*args, **kwargs):

        # create a serialized object from the request's data
        serializer = self.get_serializer(data=request.data)

        # send back any errors that are needed
        serializer.is_valid(raise_exception=True)
        
        # Save the new user
        user = serializer.save()
        # users have a profile that is a 1-1 match, so need to create that as well.
        # the profile stores the bio of the user.
        user.profile = Profile(user=user)
        user.profile.save()

        # grab the organization key 
        organization_key = request.data.get("organization_key")
        
        # get organization or null if key invalid
        try: 
            modelOrg = Organization.objects.get(key=organization_key)
            modelOrg.following_users.add(user)
            modelOrg.save()
        # TO DO: 
        # MAKE THIS BETTER
        except Exception as e:
            # Indicate that the entered organization key is invalid to the user, 
            # and offer them to register again or not
            pass
        
        ######
        # Create notifications for the new users.
        #
        # This should be automated in the future to create notifications from a set of prexisting ones. 
        # For now we just create them here.
        #
        listNotificationNewsDicts = [
            {
                "title":"Welcome!",
                "text":"Welcome to Delta!"
            },
            {
                "title": "What is this?",
                "text": "You can do a lot here, from upload data sets to writing reviews to messaging other users. Be sure to check it all out!"
            }
            ,
            {
                "title":"How do I get rid of these?",
                "text":"To remove these notifications from your screen, please click the \"Got it\" button.",
            }
        ]
        listNotificationWhatsHotDicts = [
            {
                "title":"New Organization: ValafarLab",
                "text":"Dr. Valafar's lab, \"ValafarLab\" now joins the Delta family!",
            },
            {
                "title":"Delta enters the Forbes 500 list!",
                "text":"Yeah, right!"
            }
        ]
        # create notifs
        for notifDict in listNotificationNewsDicts:
            notif = NotificationNews(title=notifDict["title"],text=notifDict["text"],recipient=user)
            notif.save()

        for notifDict in listNotificationWhatsHotDicts:
            notif = NotificationWhatsHot(title=notifDict["title"],text=notifDict["text"],recipient=user)
            notif.save()

            
        return Response({
            # give the serialized user
            "user":UserSerializer(user,context=self.get_serializer_context()).data,
            # send the token so you can login immediately
            # create token specific for that user
            # AuthToken returns a tuple, need the second item
            "token":AuthToken.objects.create(user)[1]
        })

# Login API
# Used to login existing user 
class LoginAPI(generics.GenericAPIView):
    serializer_class = LoginSerializer

    def post(self,request,*args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        # send back any errors that are needed
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        return Response({
            # give the serialized user
            "user":UserSerializer(user,context=self.get_serializer_context()).data,
            # send the token so you can login immediately
            # create token specific for that user
            # AuthToken returns a tuple, need the second item
            "token":AuthToken.objects.create(user)[1]
        })

# deletion api
# Used to delete an existing user
class DeleteAPI(generics.DestroyAPIView):
    permission_classes = [
        permissions.IsAuthenticated
    ]
    serializer_class = UserSerializer

    def post(self,request,*args,**kwargs):
        #
        # NOTE:
        # DO NOT ACTUALLY DELETE THE USER.
        # ONLY MARK THEM AS INACTIVE
        # This was as determined by Dr. Valafar.
        # see: https://stackoverflow.com/questions/44735385/how-can-i-delete-a-user-account-in-django-rest-framework
        
        request.user.delete()

        return Response({
            "message":"Account " + request.user.username + " has successfully been deleted."
        })

# Update API
# Used to update an existing user
class UpdateAPI(generics.UpdateAPIView):

    permission_classes = [
        permissions.IsAuthenticated
    ]
    serializer_class = UserSerializer

    # Update user attributes.
    # Expected arguments:
    # username: str representing the new username of the user
    # email: str representing the new email of the user
    # first_name: str representing the new first name of the user
    # last_name: str representing the new last name of the user
    # password: str representing the new password of the user
    # bio: str representing the new bio of the user
    def patch(self,request,*args,**kwargs):

        strNewUserName = request.data.get("username",None)
        strNewEmail = request.data.get("email",None)
        strNewFirstName = request.data.get("first_name",None)
        strNewLastName = request.data.get("last_name",None)
        strNewPassword = request.data.get("password",None)
        strNewBio = request.data.get('bio',None)


        # Perform tests on username
        if(strNewUserName):
            # Try to save new user, raise exception if already have user with username
            try:
                request.user.username = strNewUserName
                request.user.save()
            except Exception as e:
                print(e)
                return Response(data = {"message":"A user with that username already exists."},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        # Perform tests on email
        if(strNewEmail):
            try:
                v = validate_email(strNewEmail)
                # Try to save new email, raise exception if email already exists
                request.user.email = strNewEmail
                request.user.save()
            except Exception as e:
                return Response(data={"message":str(e)},status = status.HTTP_500_INTERNAL_SERVER_ERROR)
        # First name last name do not have to be unique
        if(strNewFirstName) :
            request.user.first_name = strNewFirstName
        if(strNewLastName):
            request.user.last_name = strNewLastName
        if(strNewPassword):
            # simple password test
            # Needs to be at least 8 characters.
            if(len(strNewPassword)) < 8:
                return Response(data={"message":"Passwords must be at least 8 characters"},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            request.user.set_password(strNewPassword)
        if(strNewBio):
            request.user.profile.bio = strNewBio
            request.user.profile.save()

        # First we get all the new organizations, put them into a list.
        # then we clear the user from any orgs.
        # then we add the user back.
        # NOTE: you could check to see if the qsOrg elements are similar to request.user.followed_organizations.all()
        # from there, you can see if you need to actually remove the user or not.
        qsOrgs = []
        for orgJson in request.data.get('organizations'):
            orgObj = Organization.objects.get(pk=orgJson['id'])
            if(orgObj in request.user.followed_organizations.all()):
                # then have authority to remove or add
                qsOrgs.append(Organization.objects.get(pk=orgJson['id']))
        
        # clear user orgs
        for orgObj in request.user.followed_organizations.all():
            orgObj.following_users.remove(request.user)
            orgObj.save()
        
        # then reupdate the orgs
        for orgObj in qsOrgs:
            orgObj.following_users.add(request.user)
            orgObj.save()

        # check for new organizations
        # using the new org key
        newOrgKey = request.data.get('newOrgKey')

        msg = ""
        # need a try except here as Django returns an error when no org object exists with the key
        if newOrgKey != "":
            try:
                modelOrg = Organization.objects.get(key=newOrgKey)
                modelOrg.following_users.add(request.user)
                modelOrg.save()
            except Exception as e:
                msg = "Invalid organization key. All other changes were saved."
                pass

        # Save the changes
        request.user.save()

        return Response({
            # give the serialized user
            "user":UserSerializer(request.user,context=self.get_serializer_context()).data,
            "msg":msg
        })

# Get User API
# Retrieve instance of user
class UserAPI(generics.RetrieveAPIView):
    # this route needs protection
    # need a valid token to view
    permission_classes = [
        permissions.IsAuthenticated,
    ]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user

    # Get the registered organizations of the user
    @action(methods=['get'],detail=True)
    def registered_orgs(self,request,*args,**kwargs):
        instance = self.get_object()

        orgs = instance.followed_organizations.all()

        serializer = OrganizationSerializer(orgs,many=True)

        return Response(serializer.data)

# for any action dealing with public info of users
# For instance, this is shown on the public profile page of users.
class ViewsetPublicUser(viewsets.ModelViewSet):
    permission_classes = [
        permissions.IsAuthenticated,
    ]
    serializer_class = PublicUserSerializer

    def get_queryset(self):
        return self.request.user

    # Expects:
    # username: str representing the user
    @action(methods=["post"],detail=False)
    def get_user(self,request):
        user = User.objects.get(username=request.data.get('username'))
        return Response(self.serializer_class(user).data)