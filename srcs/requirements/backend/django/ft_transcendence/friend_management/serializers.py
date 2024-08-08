from rest_framework import serializers
from .models import Friend_management


class Friend_managementSerializer(serializers.ModelSerializer):
	class Meta:
		model = Friend_management
		fields = ['id', 'friend1', 'friend2','requester', 'is_accepted', 'chat']