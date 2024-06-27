########################
#
# Delta project.
#
# Lexington Whalen (@lxaw)
#
# urls.py
#
# This file is the configuration for the urls of the `data` Django app.
# This is mainly the csv, tags, and the viewablity of the csv
#
from django.urls import path

from rest_framework import routers
from .api import (ViewsetDataSet,
     ViewsetPublicDataSet,
    ViewsetTagDataset,ViewsetFolder
)

router = routers.DefaultRouter()
router.register('api/datasets',ViewsetDataSet,'DataSets')
router.register('api/public_datasets',ViewsetPublicDataSet,'Publics')
router.register('api/tags',ViewsetTagDataset,'TagDataset')
router.register('api/folder',ViewsetFolder,'Folders')


# for all non viewsets, need to add to regular urls
# https://stackoverflow.com/questions/56052906/django-rest-framework-type-object-x-has-no-attribute-get-extra-actions
urlpatterns  = [
    # path('api/upload/csv/',UploadApiView.as_view(),name='UploadCSV')
]

urlpatterns += router.urls