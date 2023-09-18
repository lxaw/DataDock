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
# admin.py
#
# Brief description:
#
# This file is the configuration for the admin page of the `accounts` Django app.
# It handles what can be visible from /admin/accounts/

from django.contrib import admin

# Register your models here.
from .models import Profile

# create the admin class for profile
class ProfileAdmin(admin.ModelAdmin):
    # what can be visible in admin part of website
    fields = ["user","bio"]

admin.site.register(Profile,ProfileAdmin)