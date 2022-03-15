from django.urls import re_path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import RegisterView, APILogoutView, APIUpdateView, APIUserView, NotificationView

app_name = 'accounts'

urlpatterns = [
    re_path(r'api/token/?$', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    re_path(r'api/token/refresh/?$', TokenRefreshView.as_view(), name='token_refresh'),
    re_path(r'register/?$', RegisterView.as_view(), name='register'),
    re_path(r'logout_token/?$', APILogoutView.as_view(), name='logout_token'),
    re_path(r'update/?$', APIUpdateView.as_view(), name='update'),
    re_path(r'view/?$', APIUserView.as_view(), name='update'),
    re_path(r'notifications/?$', NotificationView.as_view(), name='view-notification')
]