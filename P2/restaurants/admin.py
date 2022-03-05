from django.contrib import admin
from restaurants.models import ModifiedUser, Restaurant

# Register your models here.
admin.site.register(Restaurant)
admin.site.register(ModifiedUser)