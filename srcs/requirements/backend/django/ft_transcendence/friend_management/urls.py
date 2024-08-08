from django.urls import path
from . import views

app_name = 'friend_management'

urlpatterns = [
	path('', views.Friend_managementView.as_view(), name='friend_management'),
]