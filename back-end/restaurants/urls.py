from django.urls import path

from restaurants.views.blog_views import *
from restaurants.views.comment_views import *
from restaurants.views.menuitem_views import *
from restaurants.views.restaurant_views import *
app_name = 'restaurants'

urlpatterns = [
    # Menu endpoints
    path('<int:restaurant_id>/menu/new/',
         CreateMenuItem.as_view(), name='create-menuitem'),
    path('<int:restaurant_id>/menu/<int:pk>/edit/',
         UpdateMenuItem.as_view(), name='update-menuitem'),
    path('<int:restaurant_id>/menu/items/',
         FetchMenuItems.as_view(), name='menuitems'),
    path('<int:restaurant_id>/menu/<int:pk>/remove/',
         DeleteMenuItem.as_view(), name='delete-menuitems'),

    # Restaurant endpoints
    path('new/', CreateRestaurant.as_view(), name='restaurant-create'),
    path('all/', FetchAllRestaurants.as_view(), name='restaurants'),
    path('owned/', FetchMyRestaurant.as_view(), name='get-owned-restaurant'),
    path('doesfollow/<int:restaurant_id>/',
         FetchIfFollowsRestaurant.as_view(), name='restaurant-doesfollow'),
    path('doeslike/<int:restaurant_id>/',
         FetchIfLikedRestaurant.as_view(), name='restaurant-doeslike'),
    path('info/<int:restaurant_id>/',
         FetchRestaurantById.as_view(), name='restaurant-byid'),
    path('search/', FetchRestaurantByArg.as_view(), name='restaurant-byarg'),
    path('<int:restaurant_id>/followers/',
         FetchFollowersRestaurants.as_view(), name='restaurant-followers'),
    path('<int:restaurant_id>/edit/',
         UpdateRestaurantInfo.as_view(), name='restaurant-edit'),
    path('<int:restaurant_id>/follow/',
         FollowRestaurant.as_view(), name='restaurant-follow'),
    path('<int:restaurant_id>/unfollow/',
         UnfollowRestaurant.as_view(), name='restaurant-unfollow'),
    path('<int:restaurant_id>/like/',
         LikeRestaurant.as_view(), name='restaurant-like'),
    path('<int:restaurant_id>/unlike/',
         UnlikeRestaurant.as_view(), name='restaurant-unlike'),
    path('<int:restaurant_id>/images/upload/',
         UploadRestaurantImage.as_view(), name='upload-restaurant-img'),
    path('<int:restaurant_id>/images/<int:image_id>/remove/',
         RemoveRestaurantImage.as_view(), name='remove-restaurant-img'),
    path('<int:restaurant_id>/images/',
         FetchImagesRestaurant.as_view(), name='get-restaurant-imgs'),

    # Comment endpoints
    path('<int:restaurant_id>/comments/all/',
         FetchComments.as_view(), name='fetch-comments'),
    path('<int:restaurant_id>/comments/new/',
         CreateComments.as_view(), name='create-comments'),
    path('<int:restaurant_id>/comments/<int:pk>/remove/',
         DeleteComment.as_view(), name='delete-comment'),

    # Blog endpoints
    path('blog/<int:blog_id>/', GetBlogs.as_view(), name='get-blog'),
    path('blog/<int:pk>/delete/', DeleteBlog.as_view(), name='delete-blog'),
    path('<int:restaurant_id>/blog/new/',
         CreateBlog.as_view(), name='create-blog'),
    path('blog/<int:blog_id>/like/', LikeBlog.as_view(), name='like-blog'),
    path('blog/<int:blog_id>/unlike/', UnlikeBlog.as_view(), name='unlike-blog'),
    path('blog/all/', GetAllBlogs.as_view(), name='get-all-blog'),
    path('blog/feed/', GetBlogFeed.as_view(), name='get-blog-feed'),
    path('<int:restaurant_id>/blog/', GetBlogRest.as_view(), name='get-rest-blog'),
    path('blog/doeslike/<int:blog_id>/',
         FetchIfLikedBlog.as_view(), name='doeslike-blog'),
]
