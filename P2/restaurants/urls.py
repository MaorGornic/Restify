from django.urls import path

from restaurants.views import CreateBlog, CreateComments, CreateMenuItem, \
    DeleteBlog, FollowRestaurant, GetAllBlogs, GetAllBlogs, GetBlogs, LikeBlog, UpdateMenuItem, \
    CreateRestaurant, FetchMyRestaurant, FetchAllMenuItems, DeleteMenuItem, FetchComments, \
    UpdateRestaurantInfo, FetchAllRestaurants, FetchRestaurantByName, FetchFollowersRestaurants, \
    UnfollowRestaurant, LikeRestaurant, UnlikeRestaurant, UploadRestaurantImage, RemoveRestaurantLogo
app_name = 'restaurants'

urlpatterns = [
    # Menu endpoints
    path(r'<int:restaurant_id>/menu/new/', CreateMenuItem.as_view(), name='create-menuitem'),
    path(r'<int:restaurant_id>/menu/<int:pk>/edit/', UpdateMenuItem.as_view(), name='update-menuitem'),
    path(r'<int:restaurant_id>/menu/items/', FetchAllMenuItems.as_view(), name='menuitems'),
    path(r'<int:restaurant_id>/menu/<int:pk>/remove/', DeleteMenuItem.as_view(), name='delete-menuitems'),

    # Restaurant endpoints
    path(r'new/', CreateRestaurant.as_view(), name='restaurant-create'),
    path(r'all/', FetchAllRestaurants.as_view(), name='restaurants'),
    path(r'owned/', FetchMyRestaurant.as_view(), name='get-owned-restaurant'),
    path(r'name/<str:name>/', FetchRestaurantByName.as_view(), name='restaurant'),
    path(r'<int:restaurant_id>/followers/', FetchFollowersRestaurants.as_view(), name='restaurant-followers'),
    path(r'<int:restaurant_id>/edit/', UpdateRestaurantInfo.as_view(), name='restaurant-edit'),
    path(r'<int:restaurant_id>/follow/', FollowRestaurant.as_view(), name='restaurant-follow'),
    path(r'<int:restaurant_id>/unfollow/', UnfollowRestaurant.as_view(), name='restaurant-unfollow'),
    path(r'<int:restaurant_id>/like/', LikeRestaurant.as_view(), name='restaurant-like'),
    path(r'<int:restaurant_id>/unlike/', UnlikeRestaurant.as_view(), name='restaurant-unlike'),
    path(r'<int:restaurant_id>/images/upload/', UploadRestaurantImage.as_view(), name='upload-restaurant-img'),
    path(r'<int:restaurant_id>/logo/remove/', RemoveRestaurantLogo.as_view(), name='remove-restaurant-img'),

    # Comment endpoints
    path(r'<int:restaurant_id>/comments/all/', FetchComments.as_view(), name='fetch-comments'),
    path(r'<int:restaurant_id>/comments/new/', CreateComments.as_view(), name='create-comments'),

    # Blog endpoints
    path('blog/<int:blog_id>/', GetBlogs.as_view(), name='get-blog'),
    path(r'blog/<int:pk>/delete/', DeleteBlog.as_view(), name='delete-blog'),
    path(r'<int:restaurant_id>/blog/new/', CreateBlog.as_view(), name='create-blog'),
    path(r'blog/<int:blog_id>/like/', LikeBlog.as_view(), name='like-blog'),
    path(r'blog/all/', GetAllBlogs.as_view(), name='get-all-blog'),
]
