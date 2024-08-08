from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.models import User
from rest_framework import serializers
from .models import UserProfile
from game.serializers import GameSerializer

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'password', 'email', 'is_staff', 'is_active', 'date_joined', 'last_login']


class UserProfileSerializer(serializers.ModelSerializer):

    user = UserSerializer()
    games_id = GameSerializer(many=True)

    class Meta:
        model = UserProfile
        fields = ['user', 'avatar', 'bio', 'games_id', 'win', 'lose', 'mobile_number', 'mobile_number_verified', 'is_connected', 'last_activity',  'is_ingame', 'friend', 'two_fa', ]

    

class PublicUserProfileSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField()

    class Meta:
        model = UserProfile
        fields = ['id', 'username']

    def get_username(self, obj):
        return obj.user.username

class UpdateAvatarSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['avatar']


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        attrs['username'] = attrs['username'].lower()
        return super().validate(attrs)
