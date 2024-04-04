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
from django.http import FileResponse,HttpResponse
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
        # permissions.IsAuthenticated
    ]

    serializer_class = SerializerDataSet

    def get_queryset(self):
        return DataSet.objects.filter(is_public=True)

    @action(methods=['get'],detail=True,renderer_classes=(PassthroughRenderer,))
    def download(self,*args,**kwargs):
        instance = self.get_object()

        zip_file_path = instance.get_zip_path()


        # increase the download count
        instance.download_count += 1
        instance.save()

        f = open(zip_file_path,'rb')
        size = os.path.getsize(zip_file_path)
        response = HttpResponse(f, content_type='application/zip')
        response['Content-Length'] = size
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
        return self.request.user.datasets.all()

    def create(self,request):
        author = self.request.user
        is_public = self.request.data.get("is_public")
        desc = self.request.data.get('description')
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

        # user file path
        strUserFilePath = f'static/users/{request.user.username}/files'
        # folder is the dataset
        strDataSetPath = os.path.join(strUserFilePath,name)

        # step 1: create the dataset
        dataSet = DataSet(author=author,is_public=is_public,description=desc,
                          is_public_orgs=is_public_orgs,
                          name=name,original_name=name)
        dataSet.save()

        # Check if the directory already exists
        if not os.path.exists(strDataSetPath):
            # Create the directory and any necessary intermediate directories
            os.makedirs(strDataSetPath)


        intNumFiles = 0
        # step 2: create the files / tags
        for k,v in request.data.items():
            # file
            if k.startswith('file'):
                intNumFiles += 1
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
        # update number of files
        dataSet.num_files = intNumFiles
        dataSet.save()

        # zip the files
        shutil.make_archive(dataSet.get_zip_path()[:-4], 'zip',strUserFilePath)

        # now delete the files you just zipped
        shutil.rmtree(strDataSetPath)



        # need an id for dataset prior to set

        return Response(self.get_serializer(dataSet).data)
    
    def partial_update(self, request, *args, **kwargs):
        # super().partial_update(request,*args,**kwargs)
        print(request.data)
        obj = DataSet.objects.get(id=kwargs['pk'])

        # NOTE: likely a better way to do this
        # remove old tags
        obj.tag_set.all().delete()
        for k,v in request.data.items(): 
            if k.startswith('registered_organizations'):
                for orgId in v:
                    # check if org exists
                    try:
                        orgObj = Organization.objects.get(pk=orgId)
                        obj.registered_organizations.add(orgObj)
                        obj.save()
                    except Organization.DoesNotExist as e:
                        print(e)
                        pass
            elif k.startswith('tags'):
                # create new tags
                tag = TagDataset(dataset=obj,text=v)
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