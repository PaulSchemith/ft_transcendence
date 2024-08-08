from .models import Chat, Message
from rest_framework import serializers

class MessageSerializer(serializers.ModelSerializer):
	class Meta:
		model = Message
		fields = ['id', 'chat_id', 'user', 'message', 'date']

class ChatSerializer(serializers.ModelSerializer):
	discussion = MessageSerializer(many=True)
	class Meta:
		model = Chat
		fields = ['id', 'user1', 'user2', 'discussion']