# from background_task import background
# from django.utils import timezone
# from datetime import timedelta
# from .models import UserProfile

# @background(schedule=60)
# def check_user_activity():
#     time_threshold = timezone.now() - timedelta(seconds=60)
#     inactive_users = UserProfile.objects.filter(last_activity__lt=time_threshold, is_connected=True)
#     for user in inactive_users:
#         user.is_connected = False
#         user.save()
