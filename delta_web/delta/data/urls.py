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
# urls.py
#
# This file is the configuration for the urls of the `data` Django app.
# This is mainly the csv, tags, and the viewablity of the csv
#
from django.urls import path

from rest_framework import routers
from .api import (ViewsetFile,
    UploadApiView, ViewsetPublicFile,
    ViewsetTagFile
)

router = routers.DefaultRouter()
router.register('api/csv',ViewsetFile,'Files')
router.register('api/public_csvs',ViewsetPublicFile,'Publics')
router.register('api/tags',ViewsetTagFile,'TagFile')


# for all non viewsets, need to add to regular urls
# https://stackoverflow.com/questions/56052906/django-rest-framework-type-object-x-has-no-attribute-get-extra-actions
urlpatterns  = [
    path('api/upload/csv/',UploadApiView.as_view(),name='UploadCSV')
]

urlpatterns += router.urls