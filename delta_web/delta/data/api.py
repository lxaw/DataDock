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

# json
import json

# import necessary models
from django.http import FileResponse,HttpResponse
from .models import (DataSet, TagDataset,File,Folder)
from rest_framework import status,renderers
from rest_framework.decorators import action

# zip the folder (dataset)
import shutil

# threading
import threading

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
from rest_framework.parsers import FileUploadParser, MultiPartParser

# import orgs
from organizations.models import Organization

# import necessary serializers
from .serializers import (SerializerDataSet,SerializerTagDataset,
                          SerializerFolder)

#https://stackoverflow.com/questions/38697529/how-to-return-generated-file-download-with-django-rest-framework
# Passes the generated file to the browser
# This is used for downloading csv files
class PassthroughRenderer(renderers.BaseRenderer):
    media_type = 'text/csv'
    format = None
    def render(self,data,accepted_media_type=None,renderer_context=None):
        return data

class ViewsetFolder(viewsets.ModelViewSet):
    serializer_class = SerializerFolder
    permission_classes = [permissions.IsAuthenticated]

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        if getattr(instance, '_prefetched_objects_cache', None):
            instance._prefetched_objects_cache = {}

        return Response(serializer.data)

    def get_queryset(self):
        return Folder.objects.filter(author=self.request.user)

    def perform_create(self, serializer):
        folder = serializer.save(author=self.request.user)

        # get the dataset ids
        dataset_ids= json.loads(self.request.data.get('dataset_ids', []))
        # then update the datasets
        datasets = DataSet.objects.filter(id__in=dataset_ids, author=self.request.user)
        for dataset in datasets:
            dataset.folder = folder
            dataset.save()

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

def write_file(file_path, file_data):
    with open(file_path, 'wb+') as f:
        f.write(file_data)

def process_files(file_data_list, dataset_path, dataset_zip_path):
    threads = []

    if not os.path.exists(dataset_path):
        os.makedirs(dataset_path)

    # Process the files
    for file_obj in file_data_list:
        file_data = file_obj['file_data']
        file_path = file_obj['file_path']
        print(f'FILE PATH: {file_path}')

        # create directory if not exists
        directory = os.path.dirname(file_path)
        if not os.path.exists(directory):
            os.makedirs(directory)

        # write the file
        thread = threading.Thread(
            target=write_file,
            args=(file_path, file_data),
        )
        thread.start()
        threads.append(thread)

    # wait for threads
    for thread in threads:
        thread.join()

    # zip the files
    shutil.make_archive(base_name=dataset_zip_path[:-4],
                        format='zip',
                        root_dir=dataset_path)

    # now delete the files you just zipped
    shutil.rmtree(dataset_path)
        

# DataSet viewset api
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
        # Create the directory if it doesn't exist
        os.makedirs(strDataSetPath,exist_ok=True)

        # step 1: create the dataset
        dataSet = DataSet(author=author,is_public=is_public,description=desc,
                          is_public_orgs=is_public_orgs,
                          name=name,original_name=name)
        dataSet.save()

        # Step 2: Create File objects with file paths
        fileDatas = []

        # create dataset tags first
        num_files = 0
        
        # NOTE!
        # As of (06/18/2024) have not found a better way to do this.
        # I know, I hate it too! But I cannot seem to find a better way using 
        # Django REST than to just loop through the items. Even if I try to send
        # the items as an array of dictionaries in JSON, I still receive indexed values
        # in Django. 
        for (k,v) in request.data.items():
            if k.startswith('tag'):
                t = TagDataset(text=v)
                t.dataset = dataSet
                t.save()
            elif k.endswith('relativePath'):
                # count the number of files
                num_files +=1
            # attach organizations
            elif k.startswith('registered_organizations'):
                org_id = int(v)
                # get the org 
                # Get the organization instance with the given id
                organization = Organization.objects.get(id=org_id)

                # Add the organization to the ManyToManyField
                dataSet.registered_organizations.add(organization)
        
        # then create the files
        for index in range(0,num_files):
            file_key = f"file.{index}"
            relative_path_key = file_key + '.relativePath'
            full_path= os.path.join(strDataSetPath,request.data[relative_path_key])
            file = request.data[file_key]
            
            # probably better way to do this
            file_obj = File(dataset=dataSet, 
                            file_path=full_path, 
                            file_name=str(file))
            file_obj.save()

            # for use in threaded process
            file_data = file.read()
            fileDatas.append({
                    'file_path': full_path,
                    'file_data': file_data
                })

        # then attach the organizations

    

        # Step 4: Start a new thread to process the files
        thread = threading.Thread(target=process_files,args=(fileDatas,strDataSetPath,dataSet.get_zip_path()))
        thread.start()

        return Response(self.get_serializer(dataSet).data)
    
    def partial_update(self, request, *args, **kwargs):
        super().partial_update(request,*args,**kwargs) 
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