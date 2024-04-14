########################
#
# Delta project.
#
# File name: admin.py
#
# Brief description: Contains the information of organizations for the admin page of the Django project
#
from django.contrib import admin

# Register your models here.
from .models import Organization

class OrganizationAdmin(admin.ModelAdmin):
    list_display= ['id','author','timestamp','name','key']

admin.site.register(Organization,OrganizationAdmin)