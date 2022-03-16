from django.http import Http404, JsonResponse
from rest_framework import generics
from django.contrib.auth.models import User
from rest_framework.generics import RetrieveAPIView, get_object_or_404, UpdateAPIView
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.token_blacklist.models import OutstandingToken, BlacklistedToken
from rest_framework_simplejwt.tokens import RefreshToken

from .models import ModifiedUser
from restaurants.models import Notification
from .serializers import RegisterSerializer, ModifiedUserSerializer, NotificationRecordsSerializer


# Create your views here.
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer


class APILogoutView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        if self.request.data.get('all'):
            for token in OutstandingToken.objects.filter(user=request.user):
                _, _ = BlacklistedToken.objects.get_or_create(token=token)
            return Response({"status": "OK, goodbye, all refresh tokens blacklisted"})
        refresh_token = self.request.data.get('refresh_token')
        token = RefreshToken(token=refresh_token)
        token.blacklist()
        return Response({"status": "OK, goodbye"})


class APIUserView(RetrieveAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = ModifiedUserSerializer

    def get_object(self):
        return get_object_or_404(ModifiedUser, id=self.request.user.id)


class MarkViewedNotification(UpdateAPIView):
    queryset = Notification.objects.all()
    serializer_class = NotificationRecordsSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ["patch"]

    def dispatch(self, request, *args, **kwargs):
        try:
            self.notification = get_object_or_404(Notification, id=self.kwargs['notification_id'])
        except Http404:
            return JsonResponse({"detail": "Notification not found"}, status=404)

        return super().dispatch(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        self.kwargs['pk'] = self.kwargs['notification_id']
        return super().update(request, *args, **kwargs)

    def perform_update(self, serializer):
        serializer.validated_data.update({'viewed': True})
        return super().perform_update(serializer)


class NotificationView(generics.ListAPIView):
    queryset = Notification.objects.all()
    serializer_class = NotificationRecordsSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = PageNumberPagination


class APIUpdateView(generics.UpdateAPIView):
    queryset = ModifiedUser.objects.all()
    permission_classes = (IsAuthenticated,)
    serializer_class = ModifiedUserSerializer
    http_method_names = ["patch"]

    def update(self, request, *args, **kwargs):
        self.kwargs["pk"] = self.request.user.id
        return super().update(request, *args, **kwargs)
