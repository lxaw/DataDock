########################
#
# Delta project.
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
    reviews = serializers.SerializerMethodField()
    avg_rating = serializers.SerializerMethodField()
    org_objs = serializers.SerializerMethodField()
    num_reviews = serializers.SerializerMethodField()

    class Meta:
        model = DataSet
        fields = "__all__"
        read_only_fields = ['id','file_path']

    def get_author_username(self,obj):
        return obj.author.username

    def get_tags(self,obj):
        return SerializerTagDataset(obj.tag_set.all(),many=True).data

    def get_avg_rating(self,obj):
        # note: probably better to store this int as a sum in the csv file
        # rounds to 1 decimal
        if obj.review_set.count() == 0:
            return 0
        return round(obj.review_set.aggregate(Avg('rating'))['rating__avg'],1)

    def get_reviews(self,obj):
        return SerializerReview(obj.review_set.all().order_by('-pub_date'),many=True).data
    
    def get_num_reviews(self,obj):
        return obj.review_set.count()
    
    def get_formatted_date(self,obj):
        return obj.timestamp.strftime("%Y/%m/%d")

    def get_org_objs(self,obj):
        return OrganizationSerializer(obj.registered_organizations.all(),many=True).data
    

# serializer for tag csv file
class SerializerTagDataset(serializers.ModelSerializer):

    class Meta:
        model = TagDataset
        fields = "__all__"