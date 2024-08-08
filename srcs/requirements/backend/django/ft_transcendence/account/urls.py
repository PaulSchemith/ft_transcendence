from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView , TokenVerifyView
from . import views

app_name = 'account'

urlpatterns = [
	path('login/', views.LoginView.as_view(), name='login'),
	path('logout/', views.LogoutView.as_view(), name='logout'),
	path('register/', views.UserRegisterView.as_view(), name='register'),
	path('profile/', views.ProfileView.as_view(), name='profile'),
	path('profile/<str:username>/', views.getProfileView.as_view(), name='user-profile'),
	path('', views.AllUserView.as_view(), name='account'),
	path('<int:pk>/', views.UserView.as_view(), name='account-numero'),
	path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
	path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
	path('avatar/<str:username>/', views.AvatarView.as_view(), name='get-avatar'),
	path('avatar/', views.UpdateAvatarView.as_view(), name='avatar'),
	path('otp/', views.SendOTPView.as_view(), name='otp'),
	path('email/verify/', views.VerifyEmailView.as_view() , name='email_verify'),
	path('mobile/verify/', views.VerifyMobileView.as_view() , name='mobile_verify'),
	path('o/token/', views.oauth_login.as_view() , name='oauth_callback'),
	path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
	# path('update_activity/', views.ActivityCheckView.as_view(), name='activity'),
]