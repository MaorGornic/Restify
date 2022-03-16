from typing import OrderedDict
from django.http import Http404, JsonResponse
from rest_framework.generics import get_object_or_404, CreateAPIView, UpdateAPIView, ListAPIView, \
    DestroyAPIView, RetrieveAPIView
from accounts.models import ModifiedUser
from restaurants.permissions import IsRestaurantOwner
from restaurants.models import ImageModel, MenuItem, Notification, Restaurant
from restaurants.serializers import ImageModelSerializer, RestaurantSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.http import HttpResponseRedirect
from django.urls import reverse

class CreateRestaurant(CreateAPIView):
    serializer_class = RestaurantSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        self.owner = ModifiedUser.objects.get(id=request.user.id)
        if Restaurant.objects.filter(owner=self.owner):
            return JsonResponse({"detail": "Same user cannot own more than one restaurant"}, status=409)
        return super().create(request, *args, **kwargs)

    def perform_create(self, serializer):
        return serializer.save(owner=self.owner)


class FetchAllRestaurants(ListAPIView):
    queryset = Restaurant.objects.all()
    serializer_class = RestaurantSerializer
    permission_classes = [AllowAny]


class FetchRestaurantById(RetrieveAPIView):
    serializer_class = RestaurantSerializer
    permission_classes = [AllowAny]

    def dispatch(self, request, *args, **kwargs):
        try:
            self.restaurant = get_object_or_404(Restaurant, id=self.kwargs['restaurant_id'])
        except Http404:
            return JsonResponse({"detail": "Restaurant not found"}, status=404)
        return super().dispatch(request, *args, **kwargs)

    def get_object(self):
        return self.restaurant

    def retrieve(self, request, *args, **kwargs):
        ret = super().retrieve(request, *args, **kwargs)
        if 'id' not in ret.data:
            return JsonResponse({"detail": "Restaurant with the given name was not found"}, status=404)
        return ret


class FetchMyRestaurant(RetrieveAPIView):
    serializer_class = RestaurantSerializer
    permission_classes = [IsAuthenticated]

    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def get_object(self):
        try:
            self.restaurant = Restaurant.objects.get(owner=ModifiedUser.objects.get(id=self.request.user.id))
        except Restaurant.DoesNotExist:
            self.restaurant = None
        return self.restaurant

    def retrieve(self, request, *args, **kwargs):
        ret = super().retrieve(request, *args, **kwargs)
        if 'id' not in ret.data:
            return JsonResponse({"detail": "Restaurant with the given name was not found"}, status=404)
        return ret


class FetchIfFollowsRestaurant(RetrieveAPIView):
    queryset = Restaurant.objects.all()
    serializer_class = RestaurantSerializer
    permission_classes = [IsAuthenticated]

    def dispatch(self, request, *args, **kwargs):
        try:
            self.restaurant = get_object_or_404(Restaurant, id=self.kwargs['restaurant_id'])
        except Http404:
            return JsonResponse({"detail": "Restaurant not found"}, status=404)
        return super().dispatch(request, *args, **kwargs)

    def finalize_response(self, request, response, *args, **kwargs):
        if response.status_code not in [401, 403, 404]:
            response.data = {'is_followed': self.restaurant.followers.filter(id=self.request.user.id).exists()}
        return super().finalize_response(request, response, *args, **kwargs)

    def retrieve(self, request, *args, **kwargs):
        self.kwargs['pk'] = self.kwargs['restaurant_id']
        ret = super().retrieve(request, *args, **kwargs)
        if 'id' not in ret.data:
            return JsonResponse({"detail": "Restaurant with the given name was not found"}, status=404)
        return ret

class FetchIfLikedRestaurant(RetrieveAPIView):
    queryset = Restaurant.objects.all()
    serializer_class = RestaurantSerializer
    permission_classes = [IsAuthenticated]

    def dispatch(self, request, *args, **kwargs):
        try:
            self.restaurant = get_object_or_404(Restaurant, id=self.kwargs['restaurant_id'])
        except Http404:
            return JsonResponse({"detail": "Restaurant not found"}, status=404)
        return super().dispatch(request, *args, **kwargs)

    def finalize_response(self, request, response, *args, **kwargs):
        if response.status_code not in [401, 403, 404]:
            response.data = {'is_liked': self.restaurant.likes.filter(id=self.request.user.id).exists()}
        return super().finalize_response(request, response, *args, **kwargs)

    def retrieve(self, request, *args, **kwargs):
        self.kwargs['pk'] = self.kwargs['restaurant_id']
        ret = super().retrieve(request, *args, **kwargs)
        if 'id' not in ret.data:
            return JsonResponse({"detail": "Restaurant with the given name was not found"}, status=404)
        return ret
        
class FetchFollowersRestaurants(RetrieveAPIView):
    serializer_class = RestaurantSerializer
    # [discuss] to we want to allow everyone to see who is following a particular restaurant?
    permission_classes = [IsAuthenticated, IsRestaurantOwner]

    def dispatch(self, request, *args, **kwargs):
        try:
            self.restaurant = get_object_or_404(Restaurant, id=self.kwargs['restaurant_id'])
        except Http404:
            return JsonResponse({"detail": "Restaurant not found"}, status=404)
        return super().dispatch(request, *args, **kwargs)

    def get_object(self):
        return self.restaurant

    def retrieve(self, request, *args, **kwargs):
        ret = super().retrieve(request, *args, **kwargs)
        if 'id' not in ret.data:
            return JsonResponse({"detail": "Restaurant with the given id was not found"}, status=404)
        ret.data = OrderedDict({'followers': ret.data['followers']})
        return ret


class UpdateRestaurantInfo(UpdateAPIView):
    queryset = Restaurant.objects.all()
    serializer_class = RestaurantSerializer
    permission_classes = [IsAuthenticated, IsRestaurantOwner]
    http_method_names = ["patch"]

    def dispatch(self, request, *args, **kwargs):
        try:
            self.restaurant = get_object_or_404(Restaurant, id=self.kwargs['restaurant_id'])
        except Http404:
            return JsonResponse({"detail": "Restaurant not found"}, status=404)

        return super().dispatch(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        self.kwargs['pk'] = self.kwargs['restaurant_id']
        return super().update(request, *args, **kwargs)


class FollowRestaurant(UpdateAPIView):
    queryset = Restaurant.objects.all()
    serializer_class = RestaurantSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ["patch"]

    def dispatch(self, request, *args, **kwargs):
        try:
            self.restaurant = get_object_or_404(Restaurant, id=self.kwargs['restaurant_id'])
        except Http404:
            return JsonResponse({"detail": "Restaurant not found"}, status=404)

        return super().dispatch(request, *args, **kwargs)

    def get_serializer(self, *args, **kwargs):
        serializer = super().get_serializer(*args, **kwargs)
        # Making this endpoint ignore the given body
        for field in serializer.fields:
            serializer.fields[field].read_only = True
        return serializer

    def update(self, request, *args, **kwargs):
        # Check if the current restaurant is already followed by this user
        if self.restaurant.followers.filter(id=self.request.user.id).exists():
            return JsonResponse({"detail": "User already follows this restaurant"}, status=409)
        self.kwargs['pk'] = self.kwargs['restaurant_id']
        return super().update(request, *args, **kwargs)

    def perform_update(self, serializer):
        current_user = ModifiedUser.objects.get(id=self.request.user.id)
        Notification.objects.create(type="FOLLOWED", user=self.restaurant.owner,
                                    restaurant=self.restaurant, actor_user=current_user)
        serializer.validated_data.update({'followers': [current_user]})
        return super().perform_update(serializer)


class UnfollowRestaurant(UpdateAPIView):
    queryset = Restaurant.objects.all()
    serializer_class = RestaurantSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ["patch"]

    def dispatch(self, request, *args, **kwargs):
        try:
            self.restaurant = get_object_or_404(Restaurant, id=self.kwargs['restaurant_id'])
        except Http404:
            return JsonResponse({"detail": "Restaurant not found"}, status=404)

        return super().dispatch(request, *args, **kwargs)

    def get_serializer(self, *args, **kwargs):
        serializer = super().get_serializer(*args, **kwargs)
        # Making this endpoint ignore the given body
        for field in serializer.fields:
            serializer.fields[field].read_only = True
        return serializer

    def update(self, request, *args, **kwargs):
        # Check if the current restaurant is followed by this user
        if not self.restaurant.followers.filter(id=self.request.user.id).exists():
            return JsonResponse({"detail": "User does not follow this restaurant"}, status=409)
        self.kwargs['pk'] = self.kwargs['restaurant_id']
        return super().update(request, *args, **kwargs)

    def perform_update(self, serializer):
        self.restaurant.followers.remove(ModifiedUser.objects.get(id=self.request.user.id))
        return super().perform_update(serializer)


class LikeRestaurant(UpdateAPIView):
    queryset = Restaurant.objects.all()
    serializer_class = RestaurantSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ["patch"]

    def dispatch(self, request, *args, **kwargs):
        try:
            self.restaurant = get_object_or_404(Restaurant, id=self.kwargs['restaurant_id'])
        except Http404:
            return JsonResponse({"detail": "Restaurant not found"}, status=404)

        return super().dispatch(request, *args, **kwargs)

    def get_serializer(self, *args, **kwargs):
        serializer = super().get_serializer(*args, **kwargs)
        # Making this endpoint ignore the given body
        for field in serializer.fields:
            serializer.fields[field].read_only = True
        return serializer

    def update(self, request, *args, **kwargs):
        # Check if the current restaurant is already followed by this user
        if self.restaurant.likes.filter(id=self.request.user.id).exists():
            return JsonResponse({"detail": "User already likes this restaurant"}, status=409)
        self.kwargs['pk'] = self.kwargs['restaurant_id']
        return super().update(request, *args, **kwargs)

    def perform_update(self, serializer):
        current_user = ModifiedUser.objects.get(id=self.request.user.id)
        Notification.objects.create(type="LIKEDRES", user=self.restaurant.owner,
                                    restaurant=self.restaurant, actor_user=current_user)
        serializer.validated_data.update({'likes': [current_user]})
        return super().perform_update(serializer)


class UnlikeRestaurant(UpdateAPIView):
    queryset = Restaurant.objects.all()
    serializer_class = RestaurantSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ["patch"]

    def dispatch(self, request, *args, **kwargs):
        try:
            self.restaurant = get_object_or_404(Restaurant, id=self.kwargs['restaurant_id'])
        except Http404:
            return JsonResponse({"detail": "Restaurant not found"}, status=404)

        return super().dispatch(request, *args, **kwargs)

    def get_serializer(self, *args, **kwargs):
        serializer = super().get_serializer(*args, **kwargs)
        # Making this endpoint ignore the given body
        for field in serializer.fields:
            serializer.fields[field].read_only = True
        return serializer

    def update(self, request, *args, **kwargs):
        # Check if the current restaurant is followed by this user
        if not self.restaurant.likes.filter(id=self.request.user.id).exists():
            return JsonResponse({"detail": "User does not like this restaurant"}, status=409)
        self.kwargs['pk'] = self.kwargs['restaurant_id']
        return super().update(request, *args, **kwargs)

    def perform_update(self, serializer):
        self.restaurant.likes.remove(ModifiedUser.objects.get(id=self.request.user.id))
        return super().perform_update(serializer)

class FetchImagesRestaurant(ListAPIView):
    queryset = ImageModel.objects.all()
    serializer_class = ImageModelSerializer
    permission_classes = [AllowAny]

    def dispatch(self, request, *args, **kwargs):
        if not Restaurant.objects.filter(id=self.kwargs['restaurant_id']):
            return JsonResponse({"detail": "Specified restaurant was not found"}, status=404)
        return super().dispatch(request, *args, **kwargs)

class FetchRestaurantByArg(ListAPIView):
    serializer_class = RestaurantSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = Restaurant.objects.all()
        res_name = self.request.GET.get('name', None)
        res_food = self.request.GET.get('food', None)
        res_postal_code = self.request.GET.get('postal_code', None)
        if res_name:
            if res_postal_code:
                queryset = queryset.filter(name=res_name, postal_code=res_postal_code)
            else:
                queryset = queryset.filter(name=res_name)
        elif res_food:
            desired_restaurants = set()
            for menu_item in MenuItem.objects.all().iterator():
                if res_food in menu_item.name:
                    desired_restaurants.add(menu_item.restaurant.id)
            if res_postal_code and res_name:
                queryset = queryset.filter(id__in=desired_restaurants, name=res_name, postal_code=res_postal_code)
            elif res_name:
                queryset = queryset.filter(id__in=desired_restaurants, name=res_name)
            elif res_postal_code:
                queryset = queryset.filter(id__in=desired_restaurants, postal_code=res_postal_code)
            else:
                queryset = queryset.filter(id__in=desired_restaurants)

        elif res_postal_code:
            queryset = queryset.filter(postal_code=res_postal_code)
        return queryset

class UploadRestaurantImage(CreateAPIView):
    queryset = Restaurant.objects.all()
    serializer_class = ImageModelSerializer
    permission_classes = [IsAuthenticated, IsRestaurantOwner]

    def dispatch(self, request, *args, **kwargs):
        try:
            self.restaurant = get_object_or_404(Restaurant, id=self.kwargs['restaurant_id'])
        except Http404:
            return JsonResponse({"detail": "Restaurant not found"}, status=404)
        return super().dispatch(request, *args, **kwargs)
    
    def perform_create(self, serializer):
        return serializer.save(restaurant=self.restaurant)

class RemoveRestaurantImage(DestroyAPIView):
    queryset = ImageModel.objects.all()
    serializer_class = ImageModel
    permission_classes = [IsAuthenticated, IsRestaurantOwner]

    def dispatch(self, request, *args, **kwargs):
        try:
            self.restaurant = get_object_or_404(Restaurant, id=self.kwargs['restaurant_id'])
        except Http404:
            return JsonResponse({"detail": "Restaurant not found"}, status=404)

        return super().dispatch(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        if not ImageModel.objects.filter(id=self.kwargs['image_id'], restaurant=self.restaurant).exists():
            return JsonResponse({"detail": "Image does not exist"}, status=404)
        self.kwargs['pk'] = self.kwargs['image_id']
        return super().destroy(request, *args, **kwargs)

    def finalize_response(self, request, response, *args, **kwargs):

        response = super().finalize_response(request, response, *args, **kwargs)
        if response.status_code not in [401, 403, 404]:
            return HttpResponseRedirect(reverse('restaurants:get-restaurant-imgs', kwargs={'restaurant_id': self.restaurant.id}))
        return response