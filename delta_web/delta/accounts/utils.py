from django.core.mail import EmailMessage
from django.core.mail import get_connection
from django.conf import settings

# Used to help create email
# As of 06/25/2024 this does not do anything!
class Util:
    @staticmethod
    def send_email(data):
        try:
            email = EmailMessage(
                subject=data['email_subject'],
                body=data['email_body'],
                to=[data['to_email']]
            )
            connection = get_connection(
                host=settings.EMAIL_HOST,
                port=settings.EMAIL_PORT,
                username=settings.EMAIL_HOST_USER,
                password=settings.EMAIL_HOST_PASSWORD,
                use_tls=settings.EMAIL_USE_TLS
            )
            email.connection = connection
            email.send()
            print(f'Email sent successfully to: {data["to_email"]}')
        except Exception as e:
            print(f'Error sending email: {e}')