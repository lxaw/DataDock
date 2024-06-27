########################
#
# File name:
# serializer.py
#
# Brief description:
#
# The serializers relevant to `accounts` app.
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.encoding import smart_str,force_str,smart_bytes,DjangoUnicodeDecodeError
from django.utils.http import urlsafe_base64_decode,urlsafe_base64_encode

# Rest imports
from rest_framework import serializers
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import AuthenticationFailed

# Models
from .models import Cart,CartItem

# Serializers
from data.serializers import SerializerDataSet
from organizations.serializers import OrganizationSerializer

# User serializer
class UserSerializer(serializers.ModelSerializer):
    # Number of followed organizations
    followed_organization_count = serializers.SerializerMethodField()
    # The followed organizations
    followed_organizations = serializers.SerializerMethodField()
    # bio
    bio = serializers.SerializerMethodField()
    # num cart items (this should be removed soon)
    num_cart_items = serializers.SerializerMethodField()
    # cart items
    cart_items = serializers.SerializerMethodField()

    class Meta:
        # Need unique validator on name and email https://stackoverflow.com/a/38160343/12939325
        model = User
        fields = ('id','username','email','first_name','last_name',
            'followed_organization_count','followed_organizations','bio',
            "num_cart_items",'cart_items')
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

    def get_num_cart_items(self,obj):
        return obj.cart.cart_items.count()
    
    def get_cart_items(self,obj):
        return CartItemSerializer(obj.cart.cart_items.all(),many=True).data

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

# Serializer for Cart
# Cart stores datasets (CartItems are a wrapper over dataset)
class CartSerializer(serializers.ModelSerializer):
    cart_items = serializers.SerializerMethodField() 
    class Meta:
        model = Cart
        fields = ('cart_items','user')
    
    def get_cart_items(self, obj):
        cart_items = obj.cart_items.all()

        return CartItemSerializer(cart_items,many=True).data

# Serializer for CartItem
# CartItem is a wrapper for a dataset to download
class CartItemSerializer(serializers.ModelSerializer):
    dataset = serializers.SerializerMethodField()
    class Meta:
        model = CartItem
        fields = ('cart','dataset','id')
    
    def get_dataset(self,obj):
        return SerializerDataSet(obj.dataset).data

# request forgot password
# (As of 06/25/2024 this does nothing!)
class ResetPasswordEmailRequestSerializer(serializers.Serializer):
    email = serializers.EmailField(min_length=2)

    redirect_url = serializers.CharField(max_length=500, required=False)

    class Meta:
        fields = ['email']

# request forgot password
# (As of 06/25/2024 this does nothing!)
class SetNewPasswordSerializer(serializers.Serializer):
    password = serializers.CharField(
        min_length=6, max_length=68, write_only=True)
    token = serializers.CharField(
        min_length=1, write_only=True)
    uidb64 = serializers.CharField(
        min_length=1, write_only=True)

    class Meta:
        fields = ['password', 'token', 'uidb64']

    def validate(self, attrs):
        try:
            password = attrs.get('password')
            token = attrs.get('token')
            uidb64 = attrs.get('uidb64')

            id = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(id=id)
            if not PasswordResetTokenGenerator().check_token(user, token):
                raise AuthenticationFailed('The reset link is invalid', 401)

            user.set_password(password)
            user.save()

            return (user)
        except Exception as e:
            raise AuthenticationFailed('The reset link is invalid', 401)
        return super().validate(attrs)