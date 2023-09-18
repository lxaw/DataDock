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
# Brief description: Defines the api for gathering organizations and organization data.
# Makes use of a Rest API framework
#
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework import status,viewsets,renderers
from knox.models import AuthToken
from organizations.models import Organization
from unicodedata import name
from rest_framework.decorators import action
from itertools import chain

from data.serializers import SerializerCSVFile

from .serializers import OrganizationSerializer


## TO DO!!!
# CHECK ALL PERMISSIONS.
# ONLY ALLOW USERS THEMSELVES TO SEE THEIR ORGANIZATIONS.
class ViewsetOrganizations(viewsets.ModelViewSet):
    queryset = Organization.objects.all()

    serializer_class = OrganizationSerializer

    permission_classes = []

    # UTILITY: Returns the full queryset containing all organizations
    # INPUT: Current instance
    # OUTPUT: set of all Organizations
    def get_queryset(self):
        return Organization.objects.all()

    # UTILITY: Retrieves data from a request from a model
    # INPUT: Current instance, the request being made, and arguments made for the request
    # OUTPUT: Returns the response to the request
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)
    
    # UTILITY: Creates an organization
    # INPUT: Current instance and the serializer used to create an organization
    # OUTPUT: Saves the serializer
    def perform_create(self,serializer):
        serializer.save()

    # UTILITY: Gathers the data posts within an organization
    # INPUT: Current instance, the request for data being made, and arguments for the request
    # OUTPUT: Response of the serialized data containing csv files
    @action(methods=['get'],detail=True)
    def data_posts(self,request,*args,**kwargs):
        instance = self.get_object()

        user_in_org = False
        if request.user in instance.following_users.all():
            user_in_org = True       
            
        PublicCsvFiles = instance.uploaded_files.filter(is_public=True)
        PublicOrgCsvFiles = instance.uploaded_files.filter(is_public_orgs=True)

        if user_in_org:
            csvFiles = list(chain(PublicOrgCsvFiles, PublicCsvFiles))
        else:
            csvFiles = PublicCsvFiles

        serializer = SerializerCSVFile(csvFiles,many=True)

        return Response(serializer.data)
    