from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView
from .views import RegisterView

app_name = 'accounts'

urlpatterns = [
    path('api/token', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('register/', RegisterView.as_view(), name='register'),
]