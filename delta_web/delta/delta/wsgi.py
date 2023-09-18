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
#
# Brief description:
#
"""
WSGI config for delta project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.1/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application
from pathlib import Path 
from whitenoise import WhiteNoise

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'delta.settings')


BASE_DIR = Path(__file__).resolve().parent.parent
application = get_wsgi_application()
application = WhiteNoise(application,root=os.path.join(BASE_DIR,"build/static"))