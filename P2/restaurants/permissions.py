from rest_framework import permissions
from rest_framework.generics import get_object_or_404
from rest_framework.exceptions import APIException
from restaurants.models import Restaurant
from rest_framework import status

class IsRestaurantOwner(permissions.BasePermission):
    def has_permission(self, request, view):
        if hasattr(view, 'restaurant'):
            restaurant = get_object_or_404(Restaurant, id=view.restaurant.id)
            if restaurant.owner_id != request.user.id:
                raise NotRestaurantOwner()
        return super().has_permission(request, view)

class NotRestaurantOwner(APIException):
    status_code = status.HTTP_403_FORBIDDEN
    default_detail = {'detail': 'Not restaurant owner'}