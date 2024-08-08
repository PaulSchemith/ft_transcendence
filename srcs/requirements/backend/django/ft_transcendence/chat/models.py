from django.db import models

class Chat(models.Model):
	user1 = models.ForeignKey('account.UserProfile', on_delete=models.CASCADE, related_name='user1')
	user2 = models.ForeignKey('account.UserProfile', on_delete=models.CASCADE, related_name='user2')
	discussion = models.ManyToManyField('chat.Message', blank=True)
	def __str__(self):
		return self.discussion

class Message(models.Model):
	chat_id = models.ForeignKey('chat.Chat', on_delete=models.PROTECT)
	user = models.ForeignKey('account.UserProfile', on_delete=models.CASCADE)
	message = models.TextField(max_length=420, blank=True)
	date = models.DateTimeField(auto_now_add=True)
	class Meta:
		ordering = ['date']
	def __str__(self):
		return self.message
