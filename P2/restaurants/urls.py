from django.urls import path

from restaurants.views import CreateComments, CreateMenuItem, UpdateMenuItem, \
    FetchAllMenuItems, DeleteMenuItem, FetchComments, \
    FetchAllRestaurants, FetchRestaurantByName, FetchFollowersRestaurants
app_name = 'restaurants'

urlpatterns = [
    path('<int:restaurant_id>/menu/new/', CreateMenuItem.as_view(), name='create-menuitem'),
    path('<int:restaurant_id>/menu/<int:pk>/edit/', UpdateMenuItem.as_view(), name='update-menuitem'),
    path('<int:restaurant_id>/menu/items/', FetchAllMenuItems.as_view(), name='menuitems'),
    path('<int:restaurant_id>/menu/<int:pk>/remove/', DeleteMenuItem.as_view(), name='delete-menuitems'),
    path('all/', FetchAllRestaurants.as_view(), name='restaurants'),
    path('name/<str:name>/', FetchRestaurantByName.as_view(), name='restaurant'),
    path('<int:restaurant_id>/followers/', FetchFollowersRestaurants.as_view(), name='restaurant-followers'),

    # Comments endpoints
    path('<int:restaurant_id>/comments/all/', FetchComments.as_view(), name='fetch-comments'),
    path('<int:restaurant_id>/comments/new/', CreateComments.as_view(), name='create-comments'),
]
