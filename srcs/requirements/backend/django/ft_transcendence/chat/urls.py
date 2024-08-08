from django.urls import path
from . import views
app_name = 'chat'

urlpatterns = [
	path('', views.ChatView.as_view(), name='chat'),
	path('message/', views.MessageView.as_view(), name='message'),
	path('create/', views.ChatCreationView.as_view(), name='create'),
]