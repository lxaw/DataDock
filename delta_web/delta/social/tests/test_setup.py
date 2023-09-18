from rest_framework.test import APITestCase
from django.urls import reverse
from django.contrib.auth import get_user_model

from data.models import CSVFile

User = get_user_model()

from django.contrib.auth import get_user_model

from data.models import CSVFile

User = get_user_model()
class TestSetUp(APITestCase):
    
    def setUp(self):
        self.reviews_url = reverse('Reviews-list')
        self.NotifReviews_url = reverse('NotificationReviews-list')

        # Create User
        self.user = User.objects.create_user(username="test2",password="test2")

        self.csvFile = CSVFile(author=self.user,file_path="testPath",file_name="testName",description="desc")
        self.csvFile.save()

        # Log User in / Grab Auth Token
        self.token = self.client.post('/api/auth/login',{'username':'test2','password':'test2'}).data['token']

        # Apply the Auth Token to the Client
        self.client.credentials(HTTP_AUTHORIZATION='Token ' +self.token)

        self.review_data_InvalidRatingLower={
            'title':"Test",
            'author':self.user.id,
            'file':self.csvFile.id,
            'text':"The Description",
            'active':"True",
            'rating':"-1"
        }

        self.review_data_InvalidRatingUpper={
            'title':"Test",
            'author':self.user.id,
            'file':self.csvFile.id,
            'text':"The Description",
            'active':"True",
            'rating':"6"
        }

        self.review_data_ValidRating={
            'title':"Test",
            'author':self.user.id,
            'file':self.csvFile.id,
            'text':"The Description",
            'active':"True",
            'rating':"4"
        }

        self.review_data_BlankTitle={
            'title':"",
            'author':self.user.id,
            'file':self.csvFile.id,
            'text':"The Description",
            'active':"True",
            'rating':"4"
        }

        self.review_data_InvalidTitle={
            'title':" This is a sentence that is 101 characters long, it has to be exactly 101 characters to meet the requirement. 101 ",
            'author':self.user.id,
            'file':self.csvFile.id,
            'text':"The Description",
            'active':"True",
            'rating':"4"
        }

        self.review_data_NoText={
            'title':" This is a sentence that is 101 characters long, it has to be exactly 101 characters to meet the requirement. 101 ",
            'author':self.user.id,
            'file':self.csvFile.id,
            'text':"",
            'active':"True",
            'rating':"4"
        }

        return super().setUp()

    def tearDown(self):

        return super().tearDown()