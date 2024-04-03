########################
#
# Delta project.
#
# Authors:
# Lexington Whalen (@lxaw)
#
# File name:
# apps.py
# Brief description:
# A default created file by Django. 

from django.apps import AppConfig


class AccountsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'accounts'
    
    def ready(self):
        import accounts.signals
