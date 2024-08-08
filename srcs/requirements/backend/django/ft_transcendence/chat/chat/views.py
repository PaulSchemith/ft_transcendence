from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Chat , Message
from .serializers import ChatSerializer, MessageSerializer
from rest_framework.permissions import IsAuthenticated
from account.models import UserProfile
from friend_management.models import Friend_management

class ChatView(APIView):
	permission_classes = [IsAuthenticated]

	def get(self, request, format=None):
		user1 = str.lower(request.GET.get('user1'))
		user2 = str.lower(request.GET.get('user2'))
		if user1 is None or user2 is None:
			return Response({ "error :", "specify user1 and user2" } , status=status.HTTP_400_BAD_REQUEST)
		user = UserProfile.objects.get(user=request.user)
		user1 = UserProfile.objects.get(user__username=user1)
		user2 = UserProfile.objects.get(user__username=user2)
		if user1 is None or user2 is None:
			return Response({ "error :", "user1 or user2 not exist" } , status=status.HTTP_400_BAD_REQUEST)
		if user != user1 and user != user2:
			return Response({ "error :", "you are not in this chat" } , status=status.HTTP_403_FORBIDDEN)
		try:
			chat = Chat.objects.get(user1=user1, user2=user2)
		except Chat.DoesNotExist:
			return Response({"error", "chat not exist"}, status=status.HTTP_404_NOT_FOUND)
		serializer = ChatSerializer(chat)
		return Response(serializer.data, status=status.HTTP_200_OK)


class MessageView(APIView):
	permission_classes = [IsAuthenticated]

	def put(self, request):
		user = UserProfile.objects.get(user=request.user)
		chat_id = request.data.get('chat_id')
		message = request.data.get('message')
		data =	{
			'user': user.id,
			'chat_id': chat_id,
			'message': message
			}
		serializer = MessageSerializer(data=data)
		if serializer.is_valid():
			try :
				chat = Chat.objects.get(id=chat_id)
				if chat.user1 == user or chat.user2 == user:
					new_message = Message.objects.create(user=user, chat_id=chat, message=message)
					new_message.save()
					chat.discussion.add(new_message)
				else:
					return Response({"error", "user are not in this chat"}, status=status.HTTP_403_FORBIDDEN)
			except Chat.DoesNotExist:
				return Response({"error", "chat not exist"}, status=status.HTTP_404_NOT_FOUND)
			return Response(serializer.data, status=status.HTTP_201_CREATED)
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ChatCreationView(APIView):
	permission_classes = [IsAuthenticated]

	def post(self, request, format=None):
		user1 = request.data.get('user1')
		user2 = request.data.get('user2')
		if user1 is None or user2 is None:
			return Response({ "error :", "specify users" } , status=status.HTTP_400_BAD_REQUEST)
		elif user1 == user2:
			return Response({ "error :", "user1 and user2 can't be the same" } , status=status.HTTP_400_BAD_REQUEST)
		try:
			user = UserProfile.objects.get(user=request.user)
			user1 = UserProfile.objects.get(user__username=user1)
			user2 = UserProfile.objects.get(user__username=user2)
			if user1 is None or user2 is None:
				return Response({ "error :", "user1 or user2 not exist" } , status=status.HTTP_400_BAD_REQUEST)
			if user != user1 and user != user2:
				return Response({ "error :", "you are not in this chat" } , status=status.HTTP_403_FORBIDDEN)
			Chat.objects.get(user1=user1, user2=user2)
		except Chat.DoesNotExist:
			try :
				Chat.objects.get(user1=user2, user2=user1)
			except Chat.DoesNotExist:
				try :
					friendship = Friend_management.objects.get(friend1=user1, friend2=user2)
				except Friend_management.DoesNotExist:
					try :
						friendship = Friend_management.objects.get(friend1=user2, friend2=user1)
					except Friend_management.DoesNotExist:
						return Response({"error:", "friendship not exist"}, status=status.HTTP_400_BAD_REQUEST)
				if friendship.is_accepted == False:
					return Response({"error:", "friendship not accepted"}, status=status.HTTP_400_BAD_REQUEST)
				newChat = Chat.objects.create(user1=user1, user2=user2)
				friendship.chat = newChat
				friendship.save()
				return Response({"message: ","chat created"}, status=status.HTTP_201_CREATED)
		return Response({"error:", "chat already exist"}, status=status.HTTP_400_BAD_REQUEST)