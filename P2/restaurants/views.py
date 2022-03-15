from typing import OrderedDict
from django.http import Http404, JsonResponse
from rest_framework.generics import get_object_or_404, CreateAPIView, UpdateAPIView, ListAPIView, DestroyAPIView, RetrieveAPIView
from accounts.serializers import ModifiedUserSerializer

from accounts.models import ModifiedUser
from restaurants.permissions import IsRestaurantOwner
from restaurants.models import Blog, Comment, MenuItem, Notification, Restaurant
from restaurants.serializers import BlogSerializer, CommentSerializer, \
    MenuItemSerializer, \
    RestaurantSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.http import HttpResponseRedirect
from django.urls import reverse

# ==================== MenuItem Views ========================
class CreateMenuItem(CreateAPIView):
    serializer_class = MenuItemSerializer
    permission_classes = [IsAuthenticated, IsRestaurantOwner]

    def dispatch(self, request, *args, **kwargs):
        try:
            self.restaurant = get_object_or_404(Restaurant, id=self.kwargs['restaurant_id'])
        except Http404:
            return JsonResponse({"detail": "Restaurant not found"}, status=404)

        return super().dispatch(request, *args, **kwargs)

    def perform_create(self, serializer):
        return serializer.save(restaurant=self.restaurant)

class UpdateMenuItem(UpdateAPIView):
    queryset = MenuItem.objects.all()
    serializer_class = MenuItemSerializer
    permission_classes = [IsAuthenticated, IsRestaurantOwner]

    def dispatch(self, request, *args, **kwargs):
        try:
            self.restaurant = get_object_or_404(Restaurant, id=self.kwargs['restaurant_id'])
        except Http404:
            return JsonResponse({"detail": "Restaurant not found"}, status=404)

        try:
            get_object_or_404(MenuItem, id=self.kwargs['pk'])
        except Http404:
            return JsonResponse({"detail": "Menu item not found"}, status=404)

        return super().dispatch(request, *args, **kwargs)

class FetchAllMenuItems(ListAPIView):
    queryset = MenuItem.objects.all()
    serializer_class = MenuItemSerializer
    permission_classes = [AllowAny]

    def dispatch(self, request, *args, **kwargs):
        if not Restaurant.objects.filter(id=self.kwargs['restaurant_id']):
            return JsonResponse({"detail": "Restaurant not found"}, status=404)

        return super().dispatch(request, *args, **kwargs)

class DeleteMenuItem(DestroyAPIView):
    queryset = MenuItem.objects.all()
    serializer_class = MenuItemSerializer
    permission_classes = [IsAuthenticated, IsRestaurantOwner]

    def dispatch(self, request, *args, **kwargs):
        try:
            self.restaurant = get_object_or_404(Restaurant, id=self.kwargs['restaurant_id'])
        except Http404:
            return JsonResponse({"detail": "Restaurant not found"}, status=404)

        try:
            get_object_or_404(MenuItem, id=self.kwargs['pk'])
        except Http404:
            return JsonResponse({"detail": "Menu item not found"}, status=404)

        return super().dispatch(request, *args, **kwargs)

    def finalize_response(self, request, response, *args, **kwargs):
        response = super().finalize_response(request, response, *args, **kwargs)
        if response.status_code not in [401, 403]:
            return HttpResponseRedirect(reverse('restaurants:menuitems', kwargs={'restaurant_id': self.restaurant.id}))
        return response

# ==================== Restaurant Views ========================
class CreateRestaurant(CreateAPIView):
    serializer_class = RestaurantSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        self.owner = ModifiedUser.objects.get(id=request.user.id)
        if Restaurant.objects.filter(owner=self.owner):
            return JsonResponse({"detail": "Same user cannot own more than one restaurant"}, status=400)
        return super().create(request, *args, **kwargs)

    def perform_create(self, serializer):
        return serializer.save(owner=self.owner)

class FetchAllRestaurants(ListAPIView):
    queryset = Restaurant.objects.all()
    serializer_class = RestaurantSerializer
    permission_classes = [AllowAny]

class FetchRestaurantByName(RetrieveAPIView):
    serializer_class = RestaurantSerializer
    permission_classes = [AllowAny]

    def dispatch(self, request, *args, **kwargs):
        try:
            self.restaurant = get_object_or_404(Restaurant, name=self.kwargs['name'])
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
        ret =super().retrieve(request, *args, **kwargs)
        if 'id' not in ret.data:
            return JsonResponse({"detail": "Restaurant with the given id was not found"}, status=404)
        ret.data = OrderedDict({'followers': ret.data['followers']})
        return ret

class UpdateRestaurantInfo(UpdateAPIView):
    queryset = Restaurant.objects.all()
    serializer_class = RestaurantSerializer
    permission_classes = [IsAuthenticated, IsRestaurantOwner]

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
            return JsonResponse({"detail": "User already follows this restaurant"}, status=400)
        self.kwargs['pk'] = self.kwargs['restaurant_id']
        return super().update(request, *args, **kwargs)

    def perform_update(self, serializer):
        serializer.validated_data.update({'followers': [ModifiedUser.objects.get(id=self.request.user.id)]})
        return super().perform_update(serializer)

class UnfollowRestaurant(UpdateAPIView):
    queryset = Restaurant.objects.all()
    serializer_class = RestaurantSerializer
    permission_classes = [IsAuthenticated]

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
            return JsonResponse({"detail": "User does not follow this restaurant"}, status=400)
        self.kwargs['pk'] = self.kwargs['restaurant_id']
        return super().update(request, *args, **kwargs)

    def perform_update(self, serializer):
        self.restaurant.followers.remove(ModifiedUser.objects.get(id=self.request.user.id))
        return super().perform_update(serializer)

class LikeRestaurant(UpdateAPIView):
    queryset = Restaurant.objects.all()
    serializer_class = RestaurantSerializer
    permission_classes = [IsAuthenticated]

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
            return JsonResponse({"detail": "User already likes this restaurant"}, status=400)
        self.kwargs['pk'] = self.kwargs['restaurant_id']
        return super().update(request, *args, **kwargs)

    def perform_update(self, serializer):
        serializer.validated_data.update({'likes': [ModifiedUser.objects.get(id=self.request.user.id)]})
        return super().perform_update(serializer)

class UnlikeRestaurant(UpdateAPIView):
    queryset = Restaurant.objects.all()
    serializer_class = RestaurantSerializer
    permission_classes = [IsAuthenticated]

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
            return JsonResponse({"detail": "User does not like this restaurant"}, status=400)
        self.kwargs['pk'] = self.kwargs['restaurant_id']
        return super().update(request, *args, **kwargs)

    def perform_update(self, serializer):
        self.restaurant.likes.remove(ModifiedUser.objects.get(id=self.request.user.id))
        return super().perform_update(serializer)

# ==================== Comment Views ========================
# For comments model, User comments under restaurant, get comments from a restaurant
class FetchComments(ListAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [AllowAny]

    def dispatch(self, request, *args, **kwargs):
        if not Restaurant.objects.filter(id=self.kwargs['restaurant_id']):
            return JsonResponse({"detail": "Restaurant ID for Comments is not found"}, status=404)
        return super().dispatch(request, *args, **kwargs)


class CreateComments(CreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated] # Must be authenticated

    def dispatch(self, request, *args, **kwargs):
        try:
            self.restaurant = get_object_or_404(Restaurant, id=self.kwargs['restaurant_id'])
        except Http404:
            return JsonResponse({"detail": "Restaurant not found"}, status=404)

        return super().dispatch(request, *args, **kwargs)

    def perform_create(self, serializer):
        return serializer.save(restaurant=self.restaurant, user=ModifiedUser.objects.get(id=self.request.user.id))


# ==================== Blog Views ========================
# For Blog model
class GetBlog(RetrieveAPIView):
    serializer_class = BlogSerializer
    permission_classes = [AllowAny]

    def dispatch(self, request, *args, **kwargs):
        if not Blog.objects.filter(id=self.kwargs['blog_id']):
            return JsonResponse({"detail": "Blog ID is not found"}, status=404)
        self.blog = get_object_or_404(Blog, id=self.kwargs['blog_id'])
        return super().dispatch(request, *args, **kwargs)

    def get_object(self):
        return self.blog

    def retrieve(self, request, *args, **kwargs):
        ret = super().retrieve(request, *args, **kwargs)
        if 'id' not in ret.data:
            return JsonResponse({"detail": "Blog ID is not found"}, status=404)
        return ret


class GetAllBlog(ListAPIView):
    queryset = Blog.objects.all()
    serializer_class = BlogSerializer
    permission_classes = [AllowAny]


class DeleteBlog(DestroyAPIView):
    queryset = Blog.objects.all()
    serializer_class = BlogSerializer
    permission_classes = [IsAuthenticated, IsRestaurantOwner]

    def dispatch(self, request, *args, **kwargs):
        if not Blog.objects.filter(id=self.kwargs['pk']):
            return JsonResponse({"detail": "Blog ID is not found"}, status=404)
        self.restaurant = get_object_or_404(Blog, id=self.kwargs['pk']).restaurant
        return super().dispatch(request, *args, **kwargs)

    # Redirect to my restaurant after remove a blog?
    def finalize_response(self, request, response, *args, **kwargs):
        response = super().finalize_response(request, response, *args, **kwargs)
        if response.status_code not in [401, 403]:
            return HttpResponseRedirect(reverse('restaurants:restaurant', kwargs={'name': self.restaurant.name}))
        return response


class CreateBlog(CreateAPIView):
    serializer_class = BlogSerializer
    permission_classes = [IsAuthenticated, IsRestaurantOwner] # Must be authenticated

    def dispatch(self, request, *args, **kwargs):
        try:
            self.restaurant = get_object_or_404(Restaurant, id=self.kwargs['restaurant_id'])
        except Http404:
            return JsonResponse({"detail": "Restaurant not found"}, status=404)

        return super().dispatch(request, *args, **kwargs)

    def perform_create(self, serializer):
        return serializer.save(restaurant=self.restaurant, user=ModifiedUser.objects.get(id=self.request.user.id))


class LikeBlog(UpdateAPIView):
    queryset = Blog.objects.all()
    serializer_class = BlogSerializer
    permission_classes = [IsAuthenticated]

    def dispatch(self, request, *args, **kwargs):
        if not Blog.objects.filter(id=self.kwargs['blog_id']):
            return JsonResponse({"detail": "Blog ID is not found"}, status=404)
        self.blog = get_object_or_404(Blog, id=self.kwargs['blog_id'])
        return super().dispatch(request, *args, **kwargs)

    def get_serializer(self, *args, **kwargs):
        serializer = super().get_serializer(*args, **kwargs)
        # Making this endpoint ignore the given body
        for field in serializer.fields:
            serializer.fields[field].read_only = True
        return serializer

    def update(self, request, *args, **kwargs):
        # Check if the current blog is already followed by this user
        if self.blog.likes.filter(id=self.request.user.id).exists():
            return JsonResponse({"detail": "User already liked this blog"}, status=400)
        self.kwargs['pk'] = self.kwargs['blog_id']
        return super().update(request, *args, **kwargs)

    def perform_update(self, serializer):
        serializer.validated_data.update({'likes': [ModifiedUser.objects.get(id=self.request.user.id)]})
        return super().perform_update(serializer)


