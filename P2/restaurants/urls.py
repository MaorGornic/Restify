from django.urls import re_path

from restaurants.views import CreateBlog, CreateComments, CreateMenuItem, \
    DeleteBlog, FollowRestaurant, GetAllBlogs, GetAllBlogs, GetBlogs, LikeBlog, UpdateMenuItem, \
    CreateRestaurant, FetchMyRestaurant, FetchAllMenuItems, DeleteMenuItem, FetchComments, \
    UpdateRestaurantInfo, FetchAllRestaurants, FetchRestaurantByName, FetchFollowersRestaurants, \
    UnfollowRestaurant, LikeRestaurant, UnlikeRestaurant
app_name = 'restaurants'

urlpatterns = [
    # Menu endpoints
    re_path(r'<int:restaurant_id>/menu/new/?$', CreateMenuItem.as_view(), name='create-menuitem'),
    re_path(r'<int:restaurant_id>/menu/<int:pk>/edit/?$', UpdateMenuItem.as_view(), name='update-menuitem'),
    re_path(r'<int:restaurant_id>/menu/items/?$', FetchAllMenuItems.as_view(), name='menuitems'),
    re_path(r'<int:restaurant_id>/menu/<int:pk>/remove/?$', DeleteMenuItem.as_view(), name='delete-menuitems'),

    # Restaurant endpoints
    re_path(r'new/?$', CreateRestaurant.as_view(), name='restaurant-create'),
    re_path(r'all/?$', FetchAllRestaurants.as_view(), name='restaurants'),
    re_path(r'owned/?$', FetchMyRestaurant.as_view(), name='get-owned-restaurant'),
    re_path(r'name/<str:name>/?$', FetchRestaurantByName.as_view(), name='restaurant'),
    re_path(r'<int:restaurant_id>/followers/?$', FetchFollowersRestaurants.as_view(), name='restaurant-followers'),
    re_path(r'<int:restaurant_id>/edit/?$', UpdateRestaurantInfo.as_view(), name='restaurant-edit'),
    re_path(r'<int:restaurant_id>/follow/?$', FollowRestaurant.as_view(), name='restaurant-follow'),
    re_path(r'<int:restaurant_id>/unfollow/?$', UnfollowRestaurant.as_view(), name='restaurant-unfollow'),
    re_path(r'<int:restaurant_id>/like/?$', LikeRestaurant.as_view(), name='restaurant-like'),
    re_path(r'<int:restaurant_id>/unlike/?$', UnlikeRestaurant.as_view(), name='restaurant-unlike'),

    # Comment endpoints
    re_path(r'<int:restaurant_id>/comments/all/?$', FetchComments.as_view(), name='fetch-comments'),
    re_path(r'<int:restaurant_id>/comments/new/?$', CreateComments.as_view(), name='create-comments'),

    # Blog endpoints
    re_path(r'blog/<int:blog_id>/?$', GetBlogs.as_view(), name='get-blog'),
    re_path(r'blog/<int:pk>/delete/?$', DeleteBlog.as_view(), name='delete-blog'),
    re_path(r'<int:restaurant_id>/blog/new/?$', CreateBlog.as_view(), name='create-blog'),
    re_path(r'blog/<int:blog_id>/like/?$', LikeBlog.as_view(), name='like-blog'),
    re_path(r'blog/all/?$', GetAllBlogs.as_view(), name='get-all-blog'),
]
