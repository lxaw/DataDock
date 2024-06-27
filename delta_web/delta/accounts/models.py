########################
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
    
# Cart
# The cart is a 1-1 with the user.
# It holds in the datasets the user would like to download.
class Cart(models.Model):
    user = models.OneToOneField(User,on_delete=models.CASCADE,null=True)

# Item for cart
class CartItem(models.Model):
    cart = models.ForeignKey(Cart,related_name='cart_items',
                             on_delete=models.CASCADE)
    dataset = models.OneToOneField(to='data.DataSet',
                                on_delete=models.CASCADE,
                                related_name='cart_items')

    def __str__(self):
        return f"{self.cart.user.username}'s cart item: {self.dataset}"