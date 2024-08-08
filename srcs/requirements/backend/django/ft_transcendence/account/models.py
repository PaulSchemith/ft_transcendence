from django.db import models
from django.conf import settings
from django.contrib.auth.models import User
import datetime

class UserProfile(models.Model):
	user = models.OneToOneField(User, null=True, on_delete=models.CASCADE)
	mobile_number = models.CharField(max_length=15, blank=True)
	mobile_number_verified = models.BooleanField(default=False)
	is_connected = models.BooleanField(default=False)
	last_activity = models.DateTimeField(auto_now=True)
	avatar = models.ImageField(upload_to='account/avatar/', default='/api/account/avatar/defaultPic.png')
	bio = models.TextField(max_length=420, default="write something about you...")
	is_ingame = models.BooleanField(default=False)
	games_id = models.ManyToManyField('game.Game', blank=True)
	win = models.IntegerField(default=0)
	lose = models.IntegerField(default=0)
	friend = models.ManyToManyField('self', blank=True)
	two_fa = models.BooleanField(default=False)
	otp = models.CharField(max_length=64, blank=True, null=True)
	opt_expiration = models.DateTimeField(blank=True, null=True)
	totp_secret = models.CharField(max_length=64, blank=True, null=True)

	def update_last_activity(self):
		self.last_activity = datetime.datetime.now()
		self.save()
	# def __str__(self):
	# 	return self.user.username
