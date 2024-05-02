########################
#
# Delta project.
#
# Authors:
# Lexington Whalen (@lxaw)
#
# File name:
# serializer.py
#
# Brief description:
#
# The serializers relevant to `accounts` app.
from operator import truediv
from rest_framework import serializers
from django.contrib.auth.models import User

from django.contrib.auth import authenticate

from organizations.serializers import OrganizationSerializer

from rest_framework.response import Response
from rest_framework import status

# cart
from .models import Cart,CartItem
# dataset
from data.serializers import SerializerDataSet

# User serializer
class UserSerializer(serializers.ModelSerializer):
    # Number of followed organizations
    followed_organization_count = serializers.SerializerMethodField()
    # The followed organizations
    followed_organizations = serializers.SerializerMethodField()
    # bio
    bio = serializers.SerializerMethodField()

    class Meta:
        # Need unique validator on name and email https://stackoverflow.com/a/38160343/12939325
        model = User
        fields = ('id','username','email','first_name','last_name',
            'followed_organization_count','followed_organizations','bio')
        # cant change id
        read_only_fields = ['id']
    
    def get_followed_organization_count(self,obj):
        return len(obj.followed_organizations.all())
    
    def get_followed_organizations(self,obj):
        listOrgs = obj.followed_organizations.all()
        serializer = OrganizationSerializer(listOrgs,many=True)
        return serializer.data
    
    def get_bio(self,obj):
        return obj.profile.bio

# Register serializer
class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id','username','first_name','last_name','email','password',) 
        extra_kwargs = {'password':{'write_only':True}}

    def create(self, validated_data):
        # password validation
        user = User.objects.create_user(username=validated_data['username'],
                                        first_name=validated_data['first_name'],
                                        last_name=validated_data['last_name'],
                                        email=validated_data['email'],
                                        password=validated_data['password'])
        return user
    
    # https://stackoverflow.com/questions/31278418/django-rest-framework-custom-fields-validation
    def validate(self,data):
        # need at least 8 char
        if(len(data['password']) < 8):
            raise serializers.ValidationError("Need at least 8 characters in password")
        return data

# Login serializer
# validation of user
class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()
    
    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Incorrect Credentials")

# serializer for public info on users
class PublicUserSerializer(serializers.ModelSerializer):
    # bio 
    bio = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('username','bio')
    
    def get_bio(self,obj):
        return obj.profile.bio

class CartSerializer(serializers.ModelSerializer):
    cart_items = serializers.SerializerMethodField() 
    class Meta:
        model = Cart
        fields = ('cart_items','user')
    
    def get_cart_items(self, obj):
        cart_items = obj.cart_items.all()

        return CartItemSerializer(cart_items,many=True).data

class CartItemSerializer(serializers.ModelSerializer):
    dataset = serializers.SerializerMethodField()
    class Meta:
        model = CartItem
        fields = ('cart','dataset')
    
    def get_dataset(self,obj):
        return SerializerDataSet(obj.dataset).data