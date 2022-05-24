from typing import OrderedDict
from django.http import Http404, JsonResponse
from rest_framework.generics import get_object_or_404, CreateAPIView, ListAPIView, DestroyAPIView
from accounts.models import ModifiedUser
from restaurants.models import Comment, Restaurant
from restaurants.permissions import IsRestaurantOwner
from restaurants.serializers import CommentSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny


class FetchComments(ListAPIView):
    """Fetch comments from a specific restaurant"""
    serializer_class = CommentSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return Comment.objects.filter(restaurant_id=self.kwargs['restaurant_id'])

    def dispatch(self, request, *args, **kwargs):
        if not Restaurant.objects.filter(id=self.kwargs['restaurant_id']):
            return JsonResponse({"detail": "Restaurant ID for Comments is not found"}, status=404)
        return super().dispatch(request, *args, **kwargs)


class CreateComments(CreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]  # Must be authenticated

    def dispatch(self, request, *args, **kwargs):
        try:
            self.restaurant = get_object_or_404(
                Restaurant, id=self.kwargs['restaurant_id'])
        except Http404:
            return JsonResponse({"detail": "Restaurant not found"}, status=404)

        return super().dispatch(request, *args, **kwargs)

    def perform_create(self, serializer):
        return serializer.save(restaurant=self.restaurant, user=ModifiedUser.objects.get(id=self.request.user.id))


class DeleteComment(DestroyAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated, IsRestaurantOwner]

    def dispatch(self, request, *args, **kwargs):
        try:
            self.restaurant = get_object_or_404(
                Restaurant, id=self.kwargs['restaurant_id'])
        except Http404:
            return JsonResponse({"detail": "Restaurant not found"}, status=404)

        try:
            get_object_or_404(Comment, id=self.kwargs['pk'])
        except Http404:
            return JsonResponse({"detail": "Comment not found"}, status=404)

        return super().dispatch(request, *args, **kwargs)
