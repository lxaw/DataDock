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
# serializers.py
#
# The serializers for the data app.
#
from rest_framework import serializers
from .models import (DataSet,TagDataset)

from rest_framework.validators import UniqueTogetherValidator

# aggregation of csv reviews
from django.db.models import Avg

# serializers
from social.serializers import SerializerReview

from organizations.serializers import OrganizationSerializer

# serializer for csv file
class SerializerDataSet(serializers.ModelSerializer):
    author_username = serializers.SerializerMethodField()
    tags = serializers.SerializerMethodField()
    formatted_date = serializers.SerializerMethodField()

    class Meta:
        model = DataSet
        fields = "__all__"
        read_only_fields = ['id','file_path']

    def get_author_username(self,obj):
        return obj.author.username

    def get_tags(self,obj):
        return SerializerTagDataset(obj.tag_set.all(),many=True).data

    def get_reviews(self,obj):
        return SerializerReview(obj.review_set.all().order_by('-pub_date'),many=True).data
    
    def get_formatted_date(self,obj):
        return obj.timestamp.strftime("%Y/%m/%d")
    

# serializer for tag csv file
class SerializerTagDataset(serializers.ModelSerializer):

    class Meta:
        model = TagDataset
        fields = "__all__"