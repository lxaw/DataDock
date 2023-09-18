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
# File name: app.py
#
# Brief description: Single web application for the social aspects of the Delta Project. 
# Manages the schemas for the social models.
#
from django.apps import AppConfig


class SocialConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'social'
