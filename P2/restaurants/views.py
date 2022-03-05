from django.shortcuts import render
from rest_framework.generics import get_object_or_404, CreateAPIView
from restaurants.models import MenuItem, Restaurant
from restaurants.serializers import MenuItemSerializer
from rest_framework.permissions import IsAuthenticated


# Create your views here.
class CreateMenuItem(CreateAPIView):
    serializer_class = MenuItemSerializer
    permission_classes = [IsAuthenticated]

    # queryset = MenuItem.objects.all()

    # def dispatch(self, request, *args, **kwargs):
    #     if 
    #     return super().dispatch(request, *args, **kwargs)

    def dispatch(self, request, *args, **kwargs):
        # self.restaurant = get_object_or_404(Restaurant, id=self.kwargs['restaurant_id'])
        return super().dispatch(request, *args, **kwargs)

    def perform_create(self, serializer):
        return serializer.save()



class UpdateMenuItem:
    pass


class DeleteMenuItem:
    pass
