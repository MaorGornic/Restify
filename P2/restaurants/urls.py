from django.urls import path

from restaurants.views import CreateMenuItem, UpdateMenuItem

app_name = 'restaurants'

urlpatterns = [
    path('<int:restaurant_id>/menu/new/', CreateMenuItem.as_view(), name='create-menuitem'),
    path('<int:restaurant_id>/menu/<int:menu_item>/edit/', UpdateMenuItem.as_view(), name='update-menuitem'),
]