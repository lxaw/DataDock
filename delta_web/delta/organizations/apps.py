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
# File name: apps.py
#
# Brief description: Creates the config for the organizations app in Django
#
from django.apps import AppConfig


class OrganizationsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'organizations'
