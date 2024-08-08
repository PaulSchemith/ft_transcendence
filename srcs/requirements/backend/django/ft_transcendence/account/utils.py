import pyotp, os, random, requests, json
from django.core.mail import send_mail
from twilio.rest import Client
from django.conf import settings
from django.template.loader import render_to_string
from django.utils.safestring import mark_safe
from django.core.signing import TimestampSigner

def enable_2fa_authenticator(user_profile):
    user_profile.totp_secret = pyotp.random_base32()
    user_profile.save()
    return user_profile.totp_secret

def get_totp_uri(user_profile):
    totp = pyotp.TOTP(user_profile.totp_secret)
    return totp.provisioning_uri(user_profile.user.email, issuer_name="Pong_42")

def send_otp(string, user_profile):
    if string == 'email':
        verification_code = "".join([str(random.randint(0, 9)) for i in range(6)])
        send_mail(
            'OTP',
            'Your OTP is ' + verification_code,
            'Pong OTP Verification <' + settings.EMAIL_HOST_USER + '>',
            [user_profile.user.email],
            fail_silently=False,
        )
        return verification_code
    elif string == 'sms':
        api_key = settings.HTTPSMS_KEY
        url = 'https://api.httpsms.com/v1/messages/send'
        headers = {
            'x-api-key': api_key,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
        code = str(random.randint(1000, 9999))
        Content = "Your OTP is " + code
        payload = {
            "content": Content,
            "from": "+33622423694",
            "to": user_profile.mobile_number
        }
        requests.post(url, headers=headers, data=json.dumps(payload))
        return code
    elif string == 'application':
        return '0'

def send_email(user_profile, email):
    signer = TimestampSigner()
    token = signer.sign(user_profile.user.username)
    user_profile.otp = token
    user_profile.save()
    html_content = render_to_string('mailVerif.html', {'token': token, 'url': settings.SITE_URL})
    html_content_safe = mark_safe(html_content)
    send_mail(
        subject='NO-REPLY:Verify your mail address',
        message=f'Click to verify: {settings.SITE_URL + "/?token=" + user_profile.otp + "#verify-email"}',
        from_email='Pong Email Verification <' + settings.EMAIL_HOST_USER + '>' ,
        recipient_list=[email],
        fail_silently=False,
        html_message=html_content_safe
    )