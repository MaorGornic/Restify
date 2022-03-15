from django.contrib import admin
from restaurants.models import Blog, Comment, ModifiedUser, Restaurant, \
    MenuItem, \
    Notification

# Register your models here.
admin.site.register(Restaurant)
admin.site.register(ModifiedUser)
admin.site.register(MenuItem)
admin.site.register(Notification)
admin.site.register(Comment)
admin.site.register(Blog)
