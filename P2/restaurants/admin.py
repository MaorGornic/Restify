from django.contrib import admin
from restaurants.models import ModifiedUser, Restaurant, MenuItem, Notification

# Register your models here.
admin.site.register(Restaurant)
admin.site.register(ModifiedUser)
admin.site.register(MenuItem)
admin.site.register(Notification)
