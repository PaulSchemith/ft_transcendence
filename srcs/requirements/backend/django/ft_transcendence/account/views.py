from django.contrib.auth.models import User
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework import status
from .serializers import *
from rest_framework.views import APIView
from django.contrib.auth import authenticate
from .models import UserProfile
from django.shortcuts import get_object_or_404
from rest_framework_simplejwt.views import TokenObtainPairView
from django.http import HttpResponse
from django.core.files.storage import default_storage
from rest_framework.parsers import MultiPartParser
from django.utils import timezone
from django.core.mail import send_mail
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .utils import *
from rest_framework_simplejwt.tokens import RefreshToken
from friend_management.models import Friend_management
from django.core.files.base import ContentFile
import pyotp, uuid, os, requests
from django.db.models import Q
from game.models import Game



class AllUserView(APIView):
    #permission_classes = [permissions.IsAdminUser]
    def get(self, request):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)

class UserView(APIView):
    def get(self, request, pk):
        user = UserProfile.objects.get(pk=pk)
        serializer = PublicUserProfileSerializer(user)
        return Response(serializer.data)

class oauth_login(APIView):
    permission_classes = [permissions.AllowAny]
    def get(self, request, *args, **kwargs):
        code = request.GET.get('code')
        # print('code', code)
        data = {
            'grant_type': 'authorization_code',
            'code': code,
            'redirect_uri': settings.OAUTH_REDIRECT_URI,
            'client_id': settings.OAUTH_CLIENT_ID,
            'client_secret': settings.OAUTH_CLIENT_SECRET,
        }
        # print('1', settings.OAUTH_REDIRECT_URI)
        # print('2', settings.OAUTH_CLIENT_ID)
        # print('3', settings.OAUTH_CLIENT_SECRET )
        response = requests.post('https://api.intra.42.fr/oauth/token', data=data)
        if response.status_code != 200:
            # print(response.json())
            return Response(response.json(), status=response.status_code)
        profile = requests.get('https://api.intra.42.fr/v2/me', headers={'Authorization': 'Bearer ' + response.json()['access_token']})
        if profile.status_code != 200:
            # print(profile.json())
            return Response(profile.json(), status=profile.status_code)
        profile = profile.json()
        try:
            user = User.objects.get(username=profile['login'])
            user_profile = UserProfile.objects.filter(user=user).first()
        except User.DoesNotExist:
            user = User.objects.create_user(
                username = profile['login'],
                password = settings.OAUTH_PASSWORD_42,
                first_name = profile['first_name'],
                last_name = profile['last_name'],
                email=profile['email'],
                is_active=True,
            )
            user_profile = UserProfile.objects.create(user=user)
            avatar_url = profile.get('image', {}).get('link')
            new_avatar = requests.get(avatar_url)
            if new_avatar.status_code == 200:
                user_profile.avatar = ContentFile(new_avatar.content)
                user_profile.avatar.save(user.username + '.jpg', ContentFile(new_avatar.content))
                user_profile.avatar.name = '/api/account/avatar/' + user.username + '.jpg'
            user_profile.save()
        # user_profile.is_connected = True
        user_profile.save()
        refresh = RefreshToken.for_user(user)
        return Response({'refresh':str(refresh), 'access': str(refresh.access_token)}, status=status.HTTP_200_OK)


class UserRegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            email = str.lower(serializer.validated_data.get('email'))
            username = str.lower(serializer.validated_data.get('username'))
            if User.objects.filter(email=email).exists():
                return Response({"error": "Email already exists"}, status=status.HTTP_400_BAD_REQUEST)
            elif User.objects.filter(username=username).exists():
                return Response({"error": "Username already exists"}, status=status.HTTP_400_BAD_REQUEST)
            elif email == None:
                return Response({"error": "Email needed"}, status=status.HTTP_400_BAD_REQUEST)
            user = User.objects.create_user(
                username = username,
                password = serializer.validated_data.get('password'),
                first_name = serializer.validated_data.get('first_name'),
                last_name = serializer.validated_data.get('last_name'),
                email=email,
                is_active=False,
            )
            user_profile = UserProfile.objects.create(user=user)
            try :
                send_email(user_profile, email)
            except Exception as e:
                user_profile.delete()
                user.delete()
                # print(e)
                return Response({"Email not sent"}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
            return Response("User created", status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class VerifyEmailView(APIView):
    permission_classes = [permissions.AllowAny]
    def get(self, request, *args, **kwargs):
        token = request.GET.get('token', None)
        user_profile = get_object_or_404(UserProfile, otp=token)
        user_profile.user.is_active = True
        user_profile.user.save()
        user_profile.otp = None
        user_profile.save()
        return Response("Email verified", status=status.HTTP_200_OK)

class VerifyMobileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        user_profile = UserProfile.objects.filter(user=user).first()
        if  user_profile.otp == request.GET.get('otp'):
            user_profile.mobile_number_verified = True
            user_profile.otp = None
            user_profile.save()
            return Response("Mobile number verified", status=status.HTTP_200_OK)
        return Response("Invalid OTP", status=status.HTTP_400_BAD_REQUEST)


class ProfileView(APIView):

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        user_profile = UserProfile.objects.filter(user=user).first()
        serializer = UserProfileSerializer(user_profile, context={'request': request})
        return Response(serializer.data)

    def patch(self, request):
        user = request.user
        request_copy = request.data.copy()
        # print(request_copy)
        # password = request_copy.get('password')
        # if password == "" or password is None:
        #     return Response({"password needed"}, status=status.HTTP_400_BAD_REQUEST)
        # elif not user.check_password(password):
        #     return Response({"wrong password"}, status=status.HTTP_400_BAD_REQUEST)
        # request_copy.pop('password')
        user_profile = UserProfile.objects.filter(user=user).first()
        serializer = UserProfileSerializer(user_profile, data=request_copy, partial=True, context={'request': request})
        if serializer.is_valid():
            if request_copy.get('username') and request_copy.get('first_name') and request_copy.get('last_name') and user.check_password(settings.OAUTH_PASSWORD_42):
                return Response({"42 user can't change this infos"}, status=status.HTTP_401_UNAUTHORIZED)
            if request_copy.get('friend'):
                friend = get_object_or_404(UserProfile, user__username=request_copy.get('friend'))
                Friend_management.objects.create(friend1=user_profile, friend2=friend, requester=user_profile)
                user_profile.save()
                friend.save()
                return Response("friend requested", status=status.HTTP_200_OK)
            if request_copy.get('email'):
                if user.check_password(settings.OAUTH_PASSWORD_42):
                    return Response({"42 user can't change email"}, status=status.HTTP_401_UNAUTHORIZED)
                email = str.lower(request_copy.get('email'))
                if User.objects.filter(email=email).exists():
                    return Response({"error": "Email already exists"}, status=status.HTTP_400_BAD_REQUEST)
                try :
                    send_email(user_profile, email)
                except:
                    return Response({"Email verification not sent, email update aborted"}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
                user.email = email
                user.is_active = False
                # user_profile.is_connected = False
                user_profile.save()
                user.save()
            if request_copy.get('new_password') and user.check_password(request_copy.get('password')):
                new_password = request_copy.get('new_password')
                if user.check_password(settings.OAUTH_PASSWORD_42):
                    return Response({"42 user can't change password"}, status=status.HTTP_401_UNAUTHORIZED)
                elif user.check_password(request_copy.get('password')) == False:
                    return Response({"wrong password"}, status=status.HTTP_400_BAD_REQUEST)
                elif new_password == "" or new_password is None:
                    return Response({"password needed"}, status=status.HTTP_400_BAD_REQUEST)
                elif user.check_password(new_password):
                    return Response({"password cannot be same as before"}, status=status.HTTP_400_BAD_REQUEST)
                user.set_password(new_password)
                user.save()
                return Response("password updated", status=status.HTTP_200_OK)
            if request_copy.get('two_fa_on'):
                if user.check_password(settings.OAUTH_PASSWORD_42):
                    return Response({"42 user can't enable 2fa"}, status=status.HTTP_401_UNAUTHORIZED)
                user_profile.totp_secret = enable_2fa_authenticator(user_profile)
                user_profile.two_fa = True
                user_profile.save() == ""
            elif request_copy.get('two_fa_off'):
                user_profile.totp_secret = None
                user_profile.two_fa = False
                user_profile.save()
            if request_copy.get('mobile_number'):
                mobile_number = request_copy.get('mobile_number')

                if mobile_number == "" or mobile_number is None:
                    return Response({"mobile number needed"}, status=status.HTTP_400_BAD_REQUEST)
                elif user_profile.mobile_number == mobile_number and user_profile.mobile_number_verified == True:
                    return Response({"mobile number already exists"}, status=status.HTTP_400_BAD_REQUEST)
                elif mobile_number[0] != '+' or not mobile_number[1:].isdigit():
                    return Response({"invalid mobile number"}, status=status.HTTP_400_BAD_REQUEST)
                if user_profile.mobile_number_verified == True:
                    user_profile.mobile_number_verified = False
                user_profile.mobile_number = mobile_number
                user_profile.otp = send_otp('sms', user_profile)
                if user_profile.otp == None:
                    return Response("otp not sent" , status=status.HTTP_503_SERVICE_UNAVAILABLE)
                user_profile.save()
            if request_copy.get('username'):
                request_copy['username'] = str.lower(request_copy['username'])
                if User.objects.filter(username=request_copy['username']).exists() and user.username != request_copy['username']:
                    return Response({"username already exists"}, status=status.HTTP_400_BAD_REQUEST)
            serializer.save()
            serializer = UserSerializer(user, data=request_copy, partial=True, context={'request': request})
            if serializer.is_valid():
                serializer.save()
            return Response("user updated", status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        user = request.user
        user_profile = UserProfile.objects.filter(user=user).first()
        if user_profile:
            user_profile.delete()
            user.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(status=status.HTTP_404_NOT_FOUND)


class getProfileView(APIView):
    def get(self, request, username):
        user_profile = get_object_or_404(UserProfile, user__username=str.lower(username))
        serializer = UserProfileSerializer(user_profile)
        return Response(serializer.data)


class LoginView(TokenObtainPairView):

    serializer_class = MyTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            username = str.lower(request.data.get('username'))
            password = request.data.get('password')
            otp = request.data.get('otp')
            totp = request.data.get('totp')
            user = authenticate(username=username, password=password)
            if user is None:
                return Response(status=status.HTTP_404_NOT_FOUND)
            elif user.is_staff:
                return Response({**response.data}, status=status.HTTP_200_OK)
            elif not user.is_active:
                return Response({"email not verified"}, status=status.HTTP_401_UNAUTHORIZED)
            try:
                user_profile = UserProfile.objects.filter(user=user).first()
            except UserProfile.DoesNotExist:
                return Response(status=status.HTTP_404_NOT_FOUND)
            if user_profile.two_fa:
                if totp:
                    totp_secret = pyotp.TOTP(user_profile.totp_secret)
                    if not totp_secret.verify(totp):
                        return Response({"totp not match"}, status=status.HTTP_401_UNAUTHORIZED)
                    # user_profile.is_connected = True
                    user_profile.save()
                    profile_serializer = UserProfileSerializer(user_profile, context={'request': request})
                    return Response({**response.data, **profile_serializer.data}, status=status.HTTP_200_OK)
                if not user_profile.otp and not otp:
                    return Response({"otp needed"}, status=status.HTTP_401_UNAUTHORIZED)
                if user_profile.opt_expiration < timezone.now():
                    return Response({"otp expired"}, status=status.HTTP_401_UNAUTHORIZED)
                if user_profile.otp == otp:
                    user_profile.otp = None
                else:
                    return Response({"otp not match"}, status=status.HTTP_401_UNAUTHORIZED)
            # user_profile.is_connected = True
            user_profile.save()
            profile_serializer = UserProfileSerializer(user_profile, context={'request': request})
        return Response({**response.data, **profile_serializer.data}, status=status.HTTP_200_OK)

class LogoutView(APIView):
    def get(self, request):
        user = request.user
        try:
            user_profile = UserProfile.objects.filter(user=user).first()
        except UserProfile.DoesNotExist:
            return Response("no user connected", status=status.HTTP_404_NOT_FOUND)
        # user_profile.is_connected = False
        user_profile.save()
        return Response("user logout", status=status.HTTP_204_NO_CONTENT)

class isIngame(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def put(self, request):
        user = request.user
        try :
            user_profile = UserProfile.objects.filter(user=user).first()
        except UserProfile.DoesNotExist:
            return Response({"user not found"},status=status.HTTP_404_NOT_FOUND)
        if user_profile.is_ingame:
            user_profile.is_ingame = False
        else:
            user_profile.is_ingame = True
        user_profile.save()
        return Response(status=status.HTTP_204_NO_CONTENT)

class AvatarView(APIView):
    permission_classes = [permissions.AllowAny]

    def get (self, request, username):
        try:
            user_profile = UserProfile.objects.filter(user__username=username).first()
            if user_profile.avatar:
                image_path = 'account/avatar/' + user_profile.avatar.name.split('/')[-1]
                with default_storage.open(image_path, 'rb') as image_file:
                    image_data = image_file.read()
                image_extension = image_path.split('.')[-1]
                return HttpResponse(image_data, content_type='image/' + image_extension)
            else:
                return HttpResponse(status=404)
        except UserProfile.DoesNotExist:
            return HttpResponse(status=404)

class UpdateAvatarView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser]

    def post(self, request):
        user = request.user
        user_profile = UserProfile.objects.get(user=user)
        avatar_file = request.FILES.get('avatar')
        if avatar_file:
            file_name = avatar_file.name
            user_profile.avatar.save(file_name, ContentFile(avatar_file.read()))
            user_profile.avatar.name = "api/account/avatar/" + file_name.split('/')[-1]
            user_profile.save()
            return Response(status=status.HTTP_200_OK)
        return Response({"No avatar given"}, status=status.HTTP_400_BAD_REQUEST)


class SendOTPView(APIView):
    def post(self, request):
        username = str.lower(request.data.get('username'))
        password = request.data.get('password')
        send_method = request.data.get('send_method')
        if not username or not password or not send_method:
            return Response({"username, password and send_method needed"}, status=status.HTTP_400_BAD_REQUEST)
        user = authenticate(username=username, password=password)
        try :
            user_profile = UserProfile.objects.filter(user=user).first()
        except UserProfile.DoesNotExist:
            return Response({"user not found"}, status=status.HTTP_404_NOT_FOUND)
        if user_profile is None:
            return Response({"user not found"}, status=status.HTTP_404_NOT_FOUND)
        if send_method == "sms":
            if not user_profile.mobile_number:
                return Response({"mobile number is missing"}, status=status.HTTP_400_BAD_REQUEST)
            elif user_profile.mobile_number_verified == False:
                return Response({"mobile number not verified"}, status=status.HTTP_401_UNAUTHORIZED)
        user_profile.otp = str()
        user_profile.otp = send_otp(send_method, user_profile)
        if user_profile.otp == None:
            return Response({"send otp error"}, status=status.HTTP_400_BAD_REQUEST)
        elif user_profile.otp == '0':
            return Response(get_totp_uri(user_profile), status=status.HTTP_200_OK)
        user_profile.opt_expiration = timezone.now() + timezone.timedelta(minutes=5)
        user_profile.save()
        return Response({'Verification code sent successfully.'}, status=status.HTTP_204_NO_CONTENT)

# class ActivityCheckView(APIView):
#     permission_classes = [permissions.IsAuthenticated]

#     def post(self, request):
#         user = request.user
#         try:
#             user_profile = UserProfile.objects.get(user=user)
#             user_profile.update_last_activity()  # Met à jour la dernière activité
#             return Response({'status': 'Activity updated'})
#         except UserProfile.DoesNotExist:
#             return Response({'error': 'UserProfile not found'}, status=404)
