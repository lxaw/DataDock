########################
#
# Delta project.
#
# Authors:
# Lexington Whalen (@lxaw)
#
# DataSet name: api.py
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

from data.serializers import SerializerDataSet

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
            
        PublicCsvDataSets = instance.uploaded_datasets.filter(is_public=True)
        PublicOrgCsvDataSets = instance.uploaded_datasets.filter(is_public_orgs=True)

        if user_in_org:
            csvDataSets = list(chain(PublicOrgCsvDataSets, PublicCsvDataSets))
        else:
            csvDataSets = PublicCsvDataSets

        serializer = SerializerDataSet(csvDataSets,many=True)

        return Response(serializer.data)
    