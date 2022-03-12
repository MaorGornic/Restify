from django.shortcuts import render
from rest_framework import generics
from django.contrib.auth.models import User
from rest_framework.generics import RetrieveAPIView, get_object_or_404
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from django.http import Http404, JsonResponse
from rest_framework_simplejwt.token_blacklist.models import OutstandingToken, BlacklistedToken
from rest_framework_simplejwt.tokens import RefreshToken

from .models import ModifiedUser
from .serializers import RegisterSerializer, ModifiedUserSerializer


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


class APIUpdateView(generics.UpdateAPIView):
    queryset = ModifiedUser.objects.all()
    permission_classes = (IsAuthenticated,)
    serializer_class = ModifiedUserSerializer

    def update(self, request, *args, **kwargs):
        self.kwargs["pk"] = self.request.user.id
        return super().update(request, *args, **kwargs)
