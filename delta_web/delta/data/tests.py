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
# tests.py
#
# Contains all the tests for the data app.
#
"""
    Managed to get rid of the authentication issue with uploading files. 
    All actions taken to solve this issue can be found in the tests.py file under data.

    Another issue arised in the form of some ErrorDetail message about no file name.
    To fix this issue, a line was changed in api.py under data. Specifically line 122
    which invovled parser classes. The parser class was changed from FileUploadParser
    to MultiPartParser. For whatever reasons this seems to have solved that issue. Although
    I do no know if it caused anymore issues elsewhere.

    Finally, it seems I can upload a file but I am not able to change the other aspects of it
    such as is_public or file_name through the paylad. Will have to investigate this more 
    tommorow.
"""

from django.test import TestCase
from rest_framework.test import APITestCase
from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework.authtoken.models import Token
from django.contrib.auth import get_user
from rest_framework import status

# Create your tests here.

User = get_user_model()

# Tests if the data uploads correctly
class DataTestCase(APITestCase):

    def test_data_upload_no_file(self):

        # Get Upload URL
        self.data_upload = reverse('UploadCSV')

        # Create User
        self.user = User.objects.create_user(username="test2",password="test2")

        # Log User in / Grab Auth Token
        token = self.client.post('/api/auth/login',{'username':'test2','password':'test2'}).data['token']

        # Apply the Auth Token to the Client
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token)
            

        res = self.client.post('/api/upload/csv/',None)
        

        self.assertEqual(res.status_code,status.HTTP_200_OK) and self.assertEqual(res.data['message'], 'Error upon uploading file')



    # def test_data_upload_no_auth(self):

    #     # Get Upload URL
    #     self.data_upload = reverse('UploadCSV')
            
    #     with open("/home/seekingj/Desktop/data.txt") as file:
    #         # import pdb
    #         # pdb.set_trace()
    #         res = self.client.post('/api/upload/csv/',{'file':file})
        

    #         self.assertEqual(res.status_code,status.HTTP_401_UNAUTHORIZED)

    # def test_data_upload_correct_file_with_auth(self):

    #     # Get Upload URL
    #     self.data_upload = reverse('UploadCSV')

    #     # Create User
    #     self.user = User.objects.create_user(username="test2",password="test2")

    #     # Log User in / Grab Auth Token
    #     token = self.client.post('/api/auth/login',{'username':'test2','password':'test2'}).data['token']

    #     # Apply the Auth Token to the Client
    #     self.client.credentials(HTTP_AUTHORIZATION='Token ' + token)

    #     # TODO how to load test file on any computer
    #     file = file
            
    #     res = self.client.post('/api/upload/csv/',{'file':file})

    #     self.assertEqual(res.status_code,status.HTTP_200_OK)