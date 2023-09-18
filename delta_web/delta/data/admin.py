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
from .models import CSVFile, TagCsvFile

# create the admin class for CSVFile
class CSVFileAdmin(admin.ModelAdmin):
    fields = ['file_path','file_name',"description","is_public",
    "is_public_orgs","registered_organizations","author"]

# create the admin class for TagCSVFile
class TagCsvFileAdmin(admin.ModelAdmin):
    fields = ['text','pub_date','file']

admin.site.register(CSVFile,CSVFileAdmin)
admin.site.register(TagCsvFile,TagCsvFileAdmin)