########################
#
# Delta project.
#
# Brief description:
#
# This file is the configuration for the admin page of the `accounts` Django app.
# It handles what can be visible from /admin/accounts/

from django.contrib import admin

# Register your models here.
from .models import Profile, Cart

# create the admin class for profile
class ProfileAdmin(admin.ModelAdmin):
    # what can be visible in admin part of website
    fields = ["user","bio"]

class CartAdmin(admin.ModelAdmin):
    fields = ['user']

admin.site.register(Profile,ProfileAdmin)
admin.site.register(Cart,CartAdmin)