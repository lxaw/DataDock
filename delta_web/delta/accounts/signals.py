#
# Authors:
# @param71kr
#

# Django imports
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User

# Models
from .models import Profile,Cart

# When create a user, create a profile for them
@receiver(post_save, sender=User)
def create_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)

# When create a user, create a cart for them
@receiver(post_save, sender=User)
def create_cart(sender, instance, created, **kwargs):
    if created:
        Cart.objects.create(user=instance)