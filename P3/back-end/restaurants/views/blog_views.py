from typing import OrderedDict
from django.http import Http404, JsonResponse
from rest_framework.generics import get_object_or_404, CreateAPIView, UpdateAPIView, ListAPIView, \
    DestroyAPIView, RetrieveAPIView
from rest_framework.pagination import PageNumberPagination

from accounts.models import ModifiedUser
from restaurants.permissions import IsRestaurantOwner
from restaurants.models import Blog, Notification, Restaurant
from restaurants.serializers import BlogSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.http import HttpResponseRedirect
from django.urls import reverse

class GetBlogs(RetrieveAPIView):
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

class GetAllBlogs(ListAPIView):
    queryset = Blog.objects.all()
    serializer_class = BlogSerializer
    permission_classes = [AllowAny]

class GetBlogFeed(ListAPIView):
    serializer_class = BlogSerializer
    permission_classes = [IsAuthenticated]

    # def dispatch(self, request, *args, **kwargs):
    #     print(request.user.id)
    #     curr_user = ModifiedUser.objects.get(id=request.user.id)
    #     try:
    #         self.followed_rest = Restaurant.objects.get(followers=curr_user)
    #     except:
    #         return JsonResponse({"detail": "No Followed Restaurants."}, status=204)
    #     return super().dispatch(request, *args, **kwargs)

    def get_queryset(self):
        curr_user = ModifiedUser.objects.get(id=self.request.user.id)
        try:
            followed_rest = Restaurant.objects.filter(followers=curr_user)
        except Restaurant.DoesNotExist:
            followed_rest = None
        print(followed_rest)
        # return Blog.objects.filter(likes=curr_user) # Method to get all liked blogs
        return Blog.objects.filter(restaurant__in=followed_rest).order_by('id')

class GetBlogRest(ListAPIView):
    queryset = Blog.objects.all()
    serializer_class = BlogSerializer
    permission_classes = [AllowAny]

    def dispatch(self, request, *args, **kwargs):
        try:
            self.restaurant = get_object_or_404(Restaurant, id=self.kwargs['restaurant_id'])
        except Http404:
            return JsonResponse({"detail": "Restaurant not found"}, status=404)
        return super().dispatch(request, *args, **kwargs)

    def get_queryset(self):
        # 君が見た夢の物語
        # Reference: https://stackoverflow.com/questions/44033670/python-django-rest-framework-unorderedobjectlistwarning
        return Blog.objects.filter(restaurant=self.restaurant).order_by('id')

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
        if response.status_code not in [401, 403, 404]:
            return HttpResponseRedirect(reverse('restaurants:get-all-blog'))
        return response


class CreateBlog(CreateAPIView):
    serializer_class = BlogSerializer
    permission_classes = [IsAuthenticated, IsRestaurantOwner]  # Must be authenticated

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
    http_method_names = ["patch"]

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
            return JsonResponse({"detail": "User already liked this blog"}, status=409)
        self.kwargs['pk'] = self.kwargs['blog_id']
        return super().update(request, *args, **kwargs)

    def perform_update(self, serializer):
        self.restaurant = self.blog.restaurant
        current_user = ModifiedUser.objects.get(id=self.request.user.id)
        Notification.objects.create(type="LIKEDBLOG", user=self.restaurant.owner,
                                    restaurant=self.restaurant, actor_user=current_user)
        serializer.validated_data.update({'likes': [current_user]})
        return super().perform_update(serializer)

class FetchIfLikedBlog(RetrieveAPIView):
    queryset = Blog.objects.all()
    serializer_class = BlogSerializer
    permission_classes = [IsAuthenticated]

    def dispatch(self, request, *args, **kwargs):
        if not Blog.objects.filter(id=self.kwargs['blog_id']):
            return JsonResponse({"detail": "Blog ID is not found"}, status=404)
        self.blog = get_object_or_404(Blog, id=self.kwargs['blog_id'])
        return super().dispatch(request, *args, **kwargs)

    def finalize_response(self, request, response, *args, **kwargs):
        if response.status_code not in [401, 403, 404]:
            response.data = {'is_liked': self.blog.likes.filter(id=self.request.user.id).exists()}
        return super().finalize_response(request, response, *args, **kwargs)

    def retrieve(self, request, *args, **kwargs):
        self.kwargs['pk'] = self.kwargs['blog_id']
        ret = super().retrieve(request, *args, **kwargs)
        if 'id' not in ret.data:
            return JsonResponse({"detail": "Restaurant with the given name was not found"}, status=404)
        return ret
