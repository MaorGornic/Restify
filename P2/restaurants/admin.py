from django.contrib import admin
from restaurants.models import ModifiedUser, Restaurant, MenuItem

# Register your models here.
admin.site.register(Restaurant)
admin.site.register(ModifiedUser)
admin.site.register(MenuItem)
from accounts.models import ModifiedUser
