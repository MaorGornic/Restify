from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import RegisterView, APILogoutView, APIUpdateView, APIUserView, NotificationView

app_name = 'accounts'

urlpatterns = [
    path(r'api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path(r'api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path(r'register/', RegisterView.as_view(), name='register'),
    path(r'logout_token/', APILogoutView.as_view(), name='logout_token'),
    path(r'update/', APIUpdateView.as_view(), name='update'),
    path(r'view/', APIUserView.as_view(), name='update'),
    path(r'notifications/', NotificationView.as_view(), name='view-notification')
]
