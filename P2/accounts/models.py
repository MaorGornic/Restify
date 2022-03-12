from django.contrib.auth.models import User
from django.db import models

"""
User (extends user model) (first name, last name, phone number, email,
avatar, owned restaurant id), following (many to many field to Restaurant)
"""


class ModifiedUser(User):
    phone_num = models.CharField(max_length=10, blank=True, null=True)
    avatar = models.ImageField(upload_to='user_avatar/', null=True, blank=True)

