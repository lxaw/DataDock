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
# File name:
# models.py
#
# Brief description:
# 
# Stores all the information related to the models of `accounts` app.

from django.db import models
from django.contrib.auth.models import User

# simple profile
# https://www.youtube.com/watch?v=FdVuKt_iuSI

# Profile model.
# The profile holds extra data associated with users.
# As we are using the default django user class, it did not come with a bio field.
# We created one within the Profile field.
class Profile(models.Model):
    user = models.OneToOneField(User,on_delete=models.CASCADE,null=True)
    bio = models.CharField(max_length = 255)

    def __str__(self):
        return '{} Profile'.format(self.user.username)