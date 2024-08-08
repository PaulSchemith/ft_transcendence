from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Friend_management
from .serializers import Friend_managementSerializer
from account.models import UserProfile
from rest_framework.permissions import IsAuthenticated

class Friend_managementView(APIView):
	permission_classes = [IsAuthenticated]

	def get(self, request): # modifier juste pour les users connectés
		friend_management = Friend_management.objects.all()
		serializer = Friend_managementSerializer(friend_management, many=True)
		return Response(serializer.data)

	def post(self, request):
		user = request.user
		friend = str.lower(request.data['friend'])
		if user.username == friend:
			return Response({"friend is user"}, status=status.HTTP_400_BAD_REQUEST)
		try :
			user1 = UserProfile.objects.get(user=user)
			user2 = UserProfile.objects.get(user__username=friend)
		except UserProfile.DoesNotExist:
			return Response({"friend not exist"}, status=status.HTTP_400_BAD_REQUEST)
		try :
			Friend_management.objects.get(friend1=user1, friend2=user2)
		except Friend_management.DoesNotExist:
			try :
				Friend_management.objects.get(friend1=user2, friend2=user1)
			except Friend_management.DoesNotExist:
				Friend_management.objects.create(friend1=user1, friend2=user2, requester=user1)
				return Response({"message: ","friendship asked"}, status=status.HTTP_201_CREATED)
		return Response({"friendship already exist"}, status=status.HTTP_400_BAD_REQUEST)

	def patch(self, request):
		user = request.user
		friend = str.lower(request.data['friend'])
		try :
			user1 = UserProfile.objects.get(user=user)
			user2 = UserProfile.objects.get(user__username=friend)
			if user1 == user2:
				return Response({"friend is user"}, status=status.HTTP_400_BAD_REQUEST)
		except UserProfile.DoesNotExist:
			return Response({"friend not exist"}, status=status.HTTP_400_BAD_REQUEST)
		try :
			friendship = Friend_management.objects.get(friend1=user2, friend2=user1)
		except Friend_management.DoesNotExist:
			return Response({"friendship not exist"}, status=status.HTTP_400_BAD_REQUEST)
		if request.data['is_accepted']:
			if friendship.requester == user1:
				return Response({"you are the requester"}, status=status.HTTP_401_UNAUTHORIZED)
			if friendship.is_accepted:
				return Response({"friendship already accepted"}, status=status.HTTP_400_BAD_REQUEST)
			friendship.is_accepted = True
			friendship.save()
			user1.friend.add(user2)
			user2.friend.add(user1)
			return Response({"friendship accepted"}, status=status.HTTP_200_OK)
		friendship.delete()
		return Response({"friendship refused"}, status=status.HTTP_200_OK)

	def delete(self, request):
		user = request.user
		friend = str.lower(request.data['friend'])
		try :
			user1 = UserProfile.objects.get(user=user)
			user2 = UserProfile.objects.get(user__username=friend)
		except UserProfile.DoesNotExist:
			return Response({"friend not exist"}, status=status.HTTP_400_BAD_REQUEST)
		try :
			friendship = Friend_management.objects.get(friend1=user1, friend2=user2)
			friendship.delete()
			user1.friend.remove(user2)
			user2.friend.remove(user1)
			return Response({"friendship deleted"}, status=status.HTTP_200_OK)
		except Friend_management.DoesNotExist:
			try :
				friendship = Friend_management.objects.get(friend1=user2, friend2=user1)
				friendship.delete()
				user1.friend.remove(user2)
				user2.friend.remove(user1)
				return Response({"friendship deleted"}, status=status.HTTP_200_OK)
			except Friend_management.DoesNotExist:
				return Response({"friendship not exist"}, status=status.HTTP_400_BAD_REQUEST)