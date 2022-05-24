from django.contrib.auth.models import User
from django.db import models
from phonenumber_field.modelfields import PhoneNumberField

"""
User (extends user model) (first name, last name, phone number, email,
avatar, owned restaurant id), following (many to many field to Restaurant)
"""


class ModifiedUser(User):
    phone_num = PhoneNumberField(null=True, blank=True, unique=False)
    avatar = models.ImageField(upload_to='user_avatar/', null=True, blank=True)
