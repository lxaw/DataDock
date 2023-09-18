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
from .models import CSVFile, TagCsvFile
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
from .serializers import SerializerCSVFile,SerializerTagCsvFile

# helper function to get folder path
def getUserFolderPath(strUser):
    return 'static/users/{}/csvs'.format(strUser)

def getUserFilePath(strFileName,strUser):
    return os.path.join(getUserFolderPath(strUser),strFileName)

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
class ViewsetPublicCsvFile(viewsets.ModelViewSet):
    queryset = CSVFile.objects.all()

    permission_classes = [
        permissions.IsAuthenticated
    ]

    serializer_class = SerializerCSVFile

    def get_queryset(self):
        return CSVFile.objects.filter(is_public=True)

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
class ViewsetCSVFile(viewsets.ModelViewSet):
    queryset = CSVFile.objects.all()

    # TO DO: 
    # UPDATE THE PERMISSION CLASSES
    # Right now anyone can view CSV files. 
    # We should make viewable only if csv files are marked as public.
    # Could mark for public for all or for organization.


    # TO DO: 
    # UNSURE ABOUT SECURITY HERE.
    # It may be possible to call api methods at an index other than yours to update
    # other users data. Please note this possiblity!

    permission_classes = [
        permissions.IsAuthenticated
    ]

    serializer_class = SerializerCSVFile

    def get_queryset(self):
        return self.request.user.csv_files.all()

    # https://stackoverflow.com/questions/30650008/django-rest-framework-override-create-in-modelserializer-passing-an-extra-par
    def create(self,request):
        author = self.request.user
        is_public = self.request.data.get("is_public")
        desc = self.request.data.get('description')
        file_name = self.request.data.get('file_name')
        arr_int_registered_orgs = self.request.data.get('registered_organizations')
        arr_tags = self.request.data.get('tags')
        is_public_orgs = self.request.data.get('is_public_orgs')
        file_path = self.request.data.get("file")['path']

        obj = CSVFile(author=author,file_name=file_name,is_public=is_public,
                      is_public_orgs=is_public_orgs,description=desc)
        # here we should test
        obj.save()

        # now give all other features
        for orgId in arr_int_registered_orgs:
            # check if org exists
            try:
                orgObj = Organization.objects.get(pk=orgId)
                obj.registered_organizations.add(orgObj)
                obj.save()
            except Organization.DoesNotExist as e:
                pass
        for tag in arr_tags:
            tag = TagCsvFile(file=obj,text=tag)
            tag.save()

        # give it the file path
        # note the file path is only to be based on the file name.
        # this is only temporary and is used to link to the functionality of actually saving files
        # the `post` method of UploadCsvFile only knows the file name and the user.
        # thus we can only keep the file path as the file name for now.
        strFilePath = getUserFilePath(strFileName=file_path,strUser=request.user.username)
        obj.file_path = strFilePath
        obj.save()

        return Response(self.get_serializer(obj).data)
    
    def partial_update(self, request, *args, **kwargs):
        super().partial_update(request,*args,**kwargs)
        obj = CSVFile.objects.get(id=kwargs['pk'])
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
                tag = TagCsvFile(file=obj,text=strTag)
                tag.save()
    
        # add the file path to the obj
        strUserCsvFolder = 'static/users/{}/csvs'.format(request.user.username)


        return Response(self.get_serializer(obj).data)
    
    def retrieve(self,request,*args,**kwargs):
        obj_id = kwargs['pk']
        obj = CSVFile.objects.get(id=obj_id)
        # ONLY ALLOW USER TO SEE FILE IF THE FOLLOWING CONDITIONS ARE MEET
        # 1. File is public OR
        # 2. User owns file OR
        # 3. User is part of org with file
        serialized = self.get_serializer(obj)
        return Response(serialized.data)


###################
#
# TO DO [10/03/22]
# WHEN DELETE A USER, DELETE ALL OF THEIR FOLDERS!
# OR COULD WRITE A CLEAN UP SCRIPT.
# THIS IS CURRENTLY HANDLED IN MODELS.PY AS A SIGNAL.
# see https://stackoverflow.com/questions/71278989/how-to-call-a-function-when-you-delete-a-model-object-in-django-admin-page-or
# 
###################
# CSV Upload api
# Uploads a csv file
class UploadCsvApiView(APIView):
    parser_classes = (FileUploadParser,)
    # parser_classes = (MultiPartParser,)

    permission_classes = [
        permissions.IsAuthenticated
    ]
    serializer_class = SerializerCSVFile

    # handle post requests
    def post(self,request,*args,**kwargs):
        # get the file, or return None if nothing there
        dataFile = request.data.get('file',None)

        if(dataFile):
            fileName = Path(str(dataFile))

            # create dir if doesnt exist
            if not os.path.exists(getUserFolderPath(request.user.username)):
                # make it
                os.makedirs(getUserFolderPath(request.user.username))

            strFilePath = getUserFilePath(fileName,request.user.username)

            # get the last one
            csvFileObj = CSVFile.objects.filter(author=request.user,file_path=strFilePath).last()

            # if a file already present, do not overwrite
            if(os.path.exists(strFilePath)):
                while(os.path.exists(strFilePath)):
                    strRandom = ''.join(random.choices(string.ascii_lowercase+string.digits,k=100))
                    strFilePath += "_"+ strRandom
                # finally add .csv
                strFilePath+=".csv"

            with open(strFilePath,'wb+') as file:
                for chunk in dataFile.chunks():
                    file.write(chunk)
            # file is now saved.
            # update the new file path
            csvFileObj.file_path = strFilePath
            csvFileObj.save()
            print(csvFileObj.file_path)
            
            return Response({
                "csvFile":SerializerCSVFile(csvFileObj).data
            })

        else:
            return Response(data={"message":"Error upon uploading file"})
# tagviewset api
# Sets the view to the tag of a csv file
class ViewsetTagCsvFile(viewsets.ModelViewSet):
    permission_classes = [
        permissions.IsAuthenticated
    ]

    serializer_class = SerializerTagCsvFile

    # never use this, just need for api to work
    def get_queryset(self):
        return TagCsvFile.objects.all()
    
    def create(self,request):
        # file is file id
        file = CSVFile.objects.get(pk=request.data.get('file'))
        # text is an array
        arrTags = request.data.get('tags')
        newTags = []
        for tag in arrTags:
            tag = TagCsvFile(file=file,text=tag)
            tag.save()
            newTags.append(tag)

        return Response(self.get_serializer(newTags,many=True).data)