from django.shortcuts import render
from rest_framework import generics
from restaurants.models import MenuItem
from restaurants.serializers import MenuItemSerializer

# Create your views here.
class CreateMenuItem(generics.CreateAPIView):
    serializer_class = MenuItemSerializer
    queryset = MenuItem.objects.all() 

    def perform_create(self, serializer):
        return serializer.save()

class UpdateMenuItem():
    pass

class DeleteMenuItem():
    pass