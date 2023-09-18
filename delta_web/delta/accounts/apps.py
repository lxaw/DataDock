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
# apps.py
# Brief description:
# A default created file by Django. 

from django.apps import AppConfig


class AccountsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'accounts'
