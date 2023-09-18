from .test_setup import TestSetUp

class TestViews(TestSetUp):
    
    def test_user_make_review_with_no_data(self):
        res = self.client.post(self.reviews_url)
        self.assertEqual(res.status_code, 400)

    def test_make_review_invalid_rating_lower(self):
        res = self.client.post(self.reviews_url, self.review_data_InvalidRatingLower, format="json")
        self.assertEqual(res.status_code, 400)

    def test_make_review_invalid_rating_upper(self):
        res = self.client.post(self.reviews_url, self.review_data_InvalidRatingUpper, format="json")
        self.assertEqual(res.status_code, 400)

    def test_make_review_valid_input(self):
        res = self.client.post(self.reviews_url, self.review_data_ValidRating, format="json")
        self.assertEqual(res.status_code, 201)

    def test_make_review_invalid_title(self):
        res = self.client.post(self.reviews_url, self.review_data_InvalidTitle, format="json")
        self.assertEqual(res.status_code, 400)

    def test_make_review_no_text(self):
        res = self.client.post(self.reviews_url, self.review_data_NoText, format="json")
        self.assertEqual(res.status_code,400)

    