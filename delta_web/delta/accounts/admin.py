########################
#
# Brief description:
#
# This file is the configuration for the admin page of the `accounts` Django app.
# It handles what can be visible from /admin/accounts/

from django.contrib import admin

# Register your models here.
from .models import Profile, Cart,CartItem

# create the admin class for profile
class ProfileAdmin(admin.ModelAdmin):
    # what can be visible in admin part of website
    fields = ["user","bio"]

# Cart is where users can place datasets
# Think Amazon cart
class CartAdmin(admin.ModelAdmin):
    fields = ['user']

# Cart Item is a wrapper that goes over the Dataset object
class CartItemAdmin(admin.ModelAdmin):
    fields = ['cart','dataset']

admin.site.register(Profile,ProfileAdmin)
admin.site.register(Cart,CartAdmin)
admin.site.register(CartItem,CartItemAdmin)