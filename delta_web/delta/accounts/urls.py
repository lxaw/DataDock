########################
#
# Delta project.
#
# Brief description: 
#       This file handles the urls related to accounts. This is
# mainly register, delete, login, and logout. 
#
from django.urls import path, include
from .api import (RegisterAPI,LoginAPI,UserAPI
,DeleteAPI,UpdateAPI,ViewsetPublicUser,ViewsetCart,
ViewsetCartItem,PasswordTokenCheckAPIView,RequestPasswordResetEmail)
from knox import views as knox_views

from rest_framework import routers

urlpatterns = [
    path('api/auth',include('knox.urls')),
    path('api/auth/register',RegisterAPI.as_view()),
    path('api/auth/login',LoginAPI.as_view()),
    path('api/auth/update',UpdateAPI.as_view()),
    path('api/auth/user',UserAPI.as_view()),
    # delete user
    path('api/auth/delete',DeleteAPI.as_view()),
    # invalidates the token, so they need to log back in to grab the token
    # this destroys the token created at log in
    path('api/auth/logout',knox_views.LogoutView.as_view(),name='knox_logout'),

    # reset password
    path('password-reset/<uidb64>/<token>/', PasswordTokenCheckAPIView.as_view(), name='password-reset-confirm'),
    # reset email
    path('request-reset-email/',RequestPasswordResetEmail.as_view(),name='request-reset-email')
]

router = routers.DefaultRouter()
# public user
router.register('api/user',ViewsetPublicUser,"PublicUser")
router.register('api/cart',ViewsetCart,"Cart")
router.register('api/cart_item',ViewsetCartItem,"CartItem")

urlpatterns += router.urls