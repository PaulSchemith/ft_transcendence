from django.db import models
from account.models import UserProfile

class Friend_management(models.Model):
	friend1 = models.ForeignKey(UserProfile, on_delete=models.CASCADE, default=None , related_name='friend1')
	friend2 = models.ForeignKey(UserProfile, on_delete=models.CASCADE, default=None , related_name='friend2')
	requester = models.ForeignKey(UserProfile, on_delete=models.CASCADE, default=None , related_name='requester')
	is_accepted = models.BooleanField(default=False)
	chat = models.ForeignKey('chat.Chat', on_delete=models.CASCADE, blank=True, null=True)