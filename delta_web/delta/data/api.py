########################
#
# Delta project.
#
# Authors:
# Lexington Whalen (@lxaw)
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

# zip the folder (dataset)
import shutil

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

        zip_file_path = instance.get_zip_path()

        # if does not exist, zip it
        if not os.path.exists(zip_file_path):
            shutil.make_archive(zip_file_path, 'zip',instance.folder_path)

        # the shutil makes the file automatically include '.zip'
        zip_file_path = zip_file_path +'.zip'

        # increase the download count
        # instance.download_count += 1
        # instance.save()

        with open(zip_file_path, 'rb') as f:
            response = FileResponse(f, content_type='application/zip')
            response['Content-Disposition'] = f'attachment; filename={instance.name + ".zip"}'
            return response

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
        print(self.request.data)
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

        # folder is the dataset
        strDataSetPath = f'static/users/{request.user.username}/files/{name}'

        # step 1: create the dataset
        dataSet = DataSet(author=author,is_public=is_public,description=desc,
                          is_public_orgs=is_public_orgs,
                          name=name,folder_path=strDataSetPath)
        dataSet.save()

        # Check if the directory already exists
        if not os.path.exists(strDataSetPath):
            # Create the directory and any necessary intermediate directories
            os.makedirs(strDataSetPath)

        # step 2: create the files / tags
        for k,v in request.data.items():
            # file
            if k.startswith('file'):
                # file path
                file_path = os.path.join(strDataSetPath,str(v))

                with open(file_path,'wb+') as f:
                    for chunk in v.chunks():
                        f.write(chunk)

                # create file objects
                file = File(dataset=dataSet,file_path=file_path,file_name=str(v))
                file.save()
            # tag
            elif k.startswith('tag'):
                t = TagDataset(text=v)
                t.dataset = dataSet
                t.save()

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