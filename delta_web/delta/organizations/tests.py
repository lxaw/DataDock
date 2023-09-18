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
# File name: tests.py
#
# Brief description: Contains the tests for organizations 
# Runs through different cases of creating organizations and makes sure there is proper 
# behavior.
#
from django.test import TestCase

from rest_framework.authtoken.models import Token
from rest_framework.test import APITestCase
from rest_framework import status

# Create your tests here.
class TestCase(APITestCase):
    
    # UTILITY: Tests the regular creation of an organization with proper data
    # INPUT: Current instance
    # OUTPUT: Assertion of equality between response and expected value
    def test_createOrganization(self):
        # all data needed to create new user instance
        data = {
            'name':'testcase',
            'following_user_count':1,
            'description':'testPassword',
            'password':'somestupid',
        }
        response = self.client.post('/api/organization/',data)

        # 201 is success response code
        # Note it destroys the test database afterwards
        self.assertEqual(response.status_code,status.HTTP_201_CREATED)
    
    # UTILITY: Tests the creation of an organization with no name
    # INPUT: Current instance
    # OUTPUT: Assertion of equality between response and expected value
    def test_createOrganizationNoName(self):
        # all data needed to create new user instance
        data = {
            'name':'',
            'following_user_count':1,
            'description':'testPassword',
            'password':'somestupid',
        }
        response = self.client.post('/api/organization/',data)

        # 201 is success response code
        # Note it destroys the test database afterwards
        self.assertEqual(response.status_code,status.HTTP_400_BAD_REQUEST)
 
    # UTILITY: Tests the creation of an organization with no description
    # INPUT: Current instance
    # OUTPUT: Assertion of equality between response and expected value     
    def test_createOrganizationNoDescription(self):
        # all data needed to create new user instance
        data = {
            'name':'testcase2',
            'following_user_count':1,
            'description':'',
            'password':'somestupid',
        }
        response = self.client.post('/api/organization/',data)

        # 201 is success response code
        # Note it destroys the test database afterwards
        self.assertEqual(response.status_code,status.HTTP_201_CREATED)
        
    # UTILITY: Tests the creation of an organization with negative follow count
    # INPUT: Current instance
    # OUTPUT: Assertion of equality between response and expected value 
    def test_createOrganization(self):
        # all data needed to create new user instance
        data = {
            'name':'testcase',
            'following_user_count':-1,
            'description':'testPassword',
            'password':'somestupid',
        }
        response = self.client.post('/api/organization/',data)

        # 201 is success response code
        # Note it destroys the test database afterwards
        self.assertEqual(response.status_code,status.HTTP_201_CREATED)