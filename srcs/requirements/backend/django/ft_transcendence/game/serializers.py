from rest_framework import serializers
from .models import Game
from account.models import UserProfile

class GameSerializer(serializers.ModelSerializer):
	player_one = serializers.SerializerMethodField()
	player_two = serializers.SerializerMethodField()
	winner = serializers.SerializerMethodField()

	class Meta:
		model = Game
		fields = ['id', 'player_one', 'player_two', 'final_score', 'game_type', 'difficulty', 'winner', 'created_at', 'updated_at']

	def validate_player(self, value):
		try:
			user = UserProfile.objects.get(username=value)
		except UserProfile.DoesNotExist:
			raise serializers.ValidationError("Player one does not exist")
		return value

	def get_player_username(self, obj, player_field):
		user = getattr(obj, player_field).user
		return user.username if user else None

	def get_player_one(self, obj):
		player_one = obj.player_one
		if player_one:
			user = getattr(player_one, 'user', None)
			if user:
				return user.username
		return None

	def get_player_two(self, obj):
		player_two = obj.player_two
		if player_two:
			user = getattr(player_two, 'user', None)
			if user:
				return user.username
		return None

	def get_winner(self, obj):
		winner = obj.winner
		if winner:
			user = getattr(winner, 'user', None)
			if user:
				return user.username
		return None