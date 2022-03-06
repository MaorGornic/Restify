from django.http import Http404, JsonResponse
from django.shortcuts import render
from rest_framework.generics import get_object_or_404, CreateAPIView, UpdateAPIView
from restaurants.models import MenuItem, Restaurant
from restaurants.serializers import MenuItemSerializer
from rest_framework.permissions import IsAuthenticated

# Create your views here.
class CreateMenuItem(CreateAPIView):
    serializer_class = MenuItemSerializer
    permission_classes = [IsAuthenticated]

    def dispatch(self, request, *args, **kwargs):
        try:
            self.restaurant = get_object_or_404(Restaurant, id=self.kwargs['restaurant_id'])
        except Http404:
            return JsonResponse({"detail": "Restaurant not found"}, status=404)

        # Getting JWT token from user
        ret = super().dispatch(request, *args, **kwargs)

        if self.request.user.id != self.restaurant.owner_id:
            return JsonResponse({"detail": "Not owner of restaurant"}, status=403)
        return ret

    def perform_create(self, serializer):
        return serializer.save(restaurant=self.restaurant)



class UpdateMenuItem(UpdateAPIView):
    queryset = MenuItem.objects.all()
    serializer_class = MenuItemSerializer
    permission_classes = [IsAuthenticated]

    def dispatch(self, request, *args, **kwargs):
        try:
            self.restaurant = get_object_or_404(Restaurant, id=self.kwargs['restaurant_id'])
        except Http404:
            return JsonResponse({"detail": "Restaurant not found"}, status=404)

        # Getting JWT token from user
        ret = super().dispatch(request, *args, **kwargs)
        
        if self.request.user.id != self.restaurant.owner_id:
            return JsonResponse({"detail": "Not owner of restaurant"}, status=403)
        return ret


    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)


class DeleteMenuItem:
    pass
