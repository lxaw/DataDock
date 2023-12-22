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
# api.py
#
# Is the API for the data app. It handles the logic for the data app of Django.
# This includes the logic for uploading, downloading, deleting csv files, and who can see them.

# import necessary models
from django.http import FileResponse
from .models import DataSet, TagDataset,File
from rest_framework import status,renderers
from rest_framework.decorators import action

from pathlib import Path

import random
import string

# files
from django.conf import settings as django_settings
import os

# import necessary rest_framework stuff
from rest_framework import viewsets, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import FileUploadParser
from rest_framework.parsers import MultiPartParser

# import orgs
from organizations.models import Organization

# import necessary serializers
from .serializers import SerializerDataSet,SerializerTagDataset

#https://stackoverflow.com/questions/38697529/how-to-return-generated-file-download-with-django-rest-framework
# Passes the generated file to the browser
# This is used for downloading csv files
class PassthroughRenderer(renderers.BaseRenderer):
    media_type = 'text/csv'
    format = None
    def render(self,data,accepted_media_type=None,renderer_context=None):
        return data

# Public CSV viewset api
# For dealing with public viewing of csv files
#
class ViewsetPublicDataSet(viewsets.ModelViewSet):
    queryset = DataSet.objects.all()

    permission_classes = [
        permissions.IsAuthenticated
    ]


    serializer_class = SerializerDataSet

    def get_queryset(self):
        return DataSet.objects.filter(is_public=True)

    @action(methods=['get'],detail=True,renderer_classes=(PassthroughRenderer,))
    def download(self,*args,**kwargs):
        instance = self.get_object()
        # increase the download count
        instance.download_count += 1
        instance.save()
        with open(instance.file_path,'rb') as file:
            return Response(
                file.read(),
                headers = {"Content-Disposition":'attachment; filename={}'.format(instance.file_name)},
                content_type="text/csv",
            )
# CSV viewset api
# Has the permission classes for the csv file viewset
# Makes viewable only if csv files are marked as public.
class ViewsetDataSet(viewsets.ModelViewSet):
    queryset = DataSet.objects.all()

    permission_classes = [
        permissions.IsAuthenticated
    ]

    serializer_class = SerializerDataSet

    parser_classes = (MultiPartParser,)

    def get_queryset(self):
        return self.request.user.csv_files.all()

    def create(self,request):
        print("HERE************")
        print(self.request.data)
        print("HERE************")
        author = self.request.user
        is_public = self.request.data.get("is_public")
        desc = self.request.data.get('description')
        arr_int_registered_orgs = self.request.data.get('registered_organizations')
        arr_tags = self.request.data.get('tags')
        is_public_orgs = self.request.data.get('is_public_orgs')
        name = self.request.data.get('name')

        # javascript sometimes uses "true" and "false", we need "True" and "False"
        if is_public == "true":
            is_public = True
        else:
            is_public = False
        if is_public_orgs == "true":
            is_public_orgs = True
        else:
            is_public_orgs = False

        # step 1: create the dataset
        dataSet = DataSet(author=author,is_public=is_public,description=desc,
                          is_public_orgs=is_public_orgs,
                          name=name)
        dataSet.save()

        
        # folder is the dataset
        strDataSetPath = f'static/users/{request.user.username}/files/{name}'

        # Check if the directory already exists
        if not os.path.exists(strDataSetPath):
            # Create the directory and any necessary intermediate directories
            os.makedirs(strDataSetPath)

        # step 2: create the files
        for k,v in request.data.items():
            if k.startswith('file'):
                # create file objects
                file_path = os.path.join(strDataSetPath,str(v))
                file = File(dataset=dataSet,file_path=file_path,file_name=str(v))
                file.save()

                

        # step 3: link the files to the dataset

        # need an id for dataset prior to set


        return Response(self.get_serializer(dataSet).data)
    
    def partial_update(self, request, *args, **kwargs):
        super().partial_update(request,*args,**kwargs)
        obj = DataSet.objects.get(id=kwargs['pk'])
        if('registered_organizations' in  request.data):
            for orgId in request.data['registered_organizations']:
                # check if org exists
                try:
                    orgObj = Organization.objects.get(pk=orgId)
                    obj.registered_organizations.add(orgObj)
                    obj.save()
                except Organization.DoesNotExist as e:
                    print(e)
                    pass
        if('tags' in request.data):
            # remove old tags
            obj.tag_set.all().delete()
            # create new tags
            for strTag in request.data['tags']:
                tag = TagDataset(file=obj,text=strTag)
                tag.save()
    
        return Response(self.get_serializer(obj).data)
    
    def retrieve(self,request,*args,**kwargs):
        obj_id = kwargs['pk']
        obj = DataSet.objects.get(id=obj_id)
        # ONLY ALLOW USER TO SEE FILE IF THE FOLLOWING CONDITIONS ARE MEET
        # 1. DataSet is public OR
        # 2. User owns file OR
        # 3. User is part of org with file
        serialized = self.get_serializer(obj)
        return Response(serialized.data)

# tagviewset api
# Sets the view to the tag of a csv file
class ViewsetTagDataset(viewsets.ModelViewSet):
    permission_classes = [
        permissions.IsAuthenticated
    ]

    serializer_class = SerializerTagDataset

    # never use this, just need for api to work
    def get_queryset(self):
        return TagDataset.objects.all()
    
    def create(self,request):
        # file is file id
        file = DataSet.objects.get(pk=request.data.get('file'))
        # text is an array
        arrTags = request.data.get('tags')
        newTags = []
        for tag in arrTags:
            tag = TagDataset(file=file,text=tag)
            tag.save()
            newTags.append(tag)

        return Response(self.get_serializer(newTags,many=True).data)