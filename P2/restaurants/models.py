from django.db import models
from django.core.validators import MinValueValidator 
from accounts.models import ModifiedUser

# Create your models here.
"""
(user id, date, restaurant id)
"""


class Comment(models.Model):
    user = models.OneToOneField(to=ModifiedUser, related_name='comment', on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_created=True)
    restaurant = models.ForeignKey(to=ModifiedUser, related_name='restaurant', on_delete=models.CASCADE)


"""
Blog (Title, Image, Contents, publish date, restaurant id foreign key, likes (many to many field to User))
"""


class Blog(models.Model):
    title = models.CharField(max_length=200)
    # TODO: Fix upload_to
    banner = models.ImageField(upload_to='store_avatars/', null=True, blank=True)

    contents = models.CharField(max_length=5000)
    publish_timestamp = models.DateTimeField(auto_created=True)
    likes = models.ManyToManyField(to=ModifiedUser, related_name="blog_likes")


"""
Restaurant (name, address, Contact information, logo, views, likes (many to many field to User)) 
"""


class Restaurant(models.Model):
    owner = models.OneToOneField(to=ModifiedUser, related_name='restaurant_owner', on_delete=models.CASCADE)

    # Many-to-many relationship: A restaurant can have _many_ followers and many users can follow _many_ restaurants
    followers = models.ManyToManyField(to=ModifiedUser, related_name="restaurant_followers", null=True, blank=True)

    name = models.CharField(max_length=200)
    address = models.CharField(max_length=200)
    email = models.CharField(max_length=100)
    phone_num = models.CharField(max_length=10)
    views = models.IntegerField(validators=[MinValueValidator(0)])
    likes = models.ManyToManyField(to=ModifiedUser, related_name="restaurant_likes", null=True, blank=True)

    # One-to-many relationship: A restaurant can have many comments. A comment can be attributed to only one restaurant
    comment = models.ForeignKey(to=ModifiedUser, on_delete=models.CASCADE, related_name='comments', null=True,
                                blank=True)
    blog = models.ForeignKey(to=Blog, on_delete=models.CASCADE, related_name='blogs', null=True, blank=True)

    # TODO: Fix upload_to
    logo = models.ImageField(upload_to='store_avatars/', null=True, blank=True)


"""
Notification (message, user id)
"""


class Notification(models.Model):
    message = models.CharField(max_length=200)
    # Enum
    NOTIFICATION_TYPE = (
        ("GENERAL", "general"),
        ("RESTAURANT", "restaurant"),
    )
    type = models.CharField(max_length=10, choices=NOTIFICATION_TYPE, default="GENERAL")
    user = models.ForeignKey(to=ModifiedUser, on_delete=models.CASCADE, related_name='users')

class MenuItem(models.Model):
    name = models.CharField(max_length=100)
    description = models.CharField(max_length=200)
    price = models.DecimalField(max_digits=8, decimal_places=2, validators=[MinValueValidator(0)])
    picture = models.ImageField(upload_to='menu/', null=True, blank=True)
    restaurant = models.ForeignKey(to=Restaurant, on_delete=models.CASCADE, related_name='menuitems')
