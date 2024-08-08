from django.urls import path
from .views import GameView , GameDetailView
from . import views

app_name = 'game'

urlpatterns = [
	path('', GameView.as_view(), name='game'),
	path('<int:id>/', GameDetailView.as_view(), name='game'),

	path('easy/model.json', views.modele_acces, name='modele_acces'),
    path('easy/model.weights.bin', views.get_weights, name='get_weights'),

    path('medium/model.json', views.modele_acces, name='modele_acces'),
    path('medium/model.weights.bin', views.get_weights, name='get_weights'),

    path('hard/model.json', views.modele_acces, name='modele_acces'),
    path('hard/model.weights.bin', views.get_weights, name='get_weights'),
]