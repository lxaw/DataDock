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
# admin.py
#
# This file is the configuration for the admin page of the `data` Django app.
# It handles what can be visible from /admin/data/
from django.contrib import admin

# Register your models here.
from .models import File, TagFile

# create the admin class for File
class FileAdmin(admin.ModelAdmin):
    fields = ['file_path','file_name',"description","is_public",
    "is_public_orgs","registered_organizations","author","original_file_name"]

# create the admin class for TagFile
class TagFileAdmin(admin.ModelAdmin):
    fields = ['text','pub_date','file']

admin.site.register(File,FileAdmin)
admin.site.register(TagFile,TagFileAdmin)