from django.urls import path

from restaurants.views import CreateMenuItem, UpdateMenuItem, FetchAllMenuItems, DeleteMenuItem

app_name = 'restaurants'

urlpatterns = [
    path('<int:restaurant_id>/menu/new/', CreateMenuItem.as_view(), name='create-menuitem'),
    path('<int:restaurant_id>/menu/<int:pk>/edit/', UpdateMenuItem.as_view(), name='update-menuitem'),
    path('<int:restaurant_id>/menu/items/', FetchAllMenuItems.as_view(), name='menuitems'),
    path('<int:restaurant_id>/menu/<int:pk>/remove/', DeleteMenuItem.as_view(), name='delete-menuitems'),
]