from django.contrib import admin

# Register your models here.
from accounts.models import ModifiedUser

admin.site.register(ModifiedUser)