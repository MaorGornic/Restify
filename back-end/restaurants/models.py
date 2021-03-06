from django.db import models
from django.core.validators import MinValueValidator
from accounts.models import ModifiedUser
from phonenumber_field.modelfields import PhoneNumberField

# Models created

"""
Restaurant (name, address, Contact information, logo, views, likes (many to many field to User)) 
"""


class Restaurant(models.Model):
    owner = models.OneToOneField(to=ModifiedUser, related_name='restaurant_owner', on_delete=models.CASCADE)

    # Many-to-many relationship: A restaurant can have _many_ followers and many users can follow _many_ restaurants
    followers = models.ManyToManyField(to=ModifiedUser, related_name="restaurant_followers", blank=True)

    name = models.CharField(max_length=200)
    postal_code = models.CharField(max_length=10)
    address = models.CharField(max_length=200)
    email = models.CharField(max_length=100)
    phone_num = PhoneNumberField(null=False, blank=False, unique=False)
    views = models.IntegerField(default=0, validators=[MinValueValidator(0)])
    likes = models.ManyToManyField(to=ModifiedUser, related_name="restaurant_likes", blank=True)
    logo = models.ImageField(upload_to='restaurant_logo/', null=True, blank=True)

"""
ImageModel(referred image, restaurant fk)
"""

class ImageModel(models.Model):
    ref_img = models.ImageField(upload_to='restaurant_pics/', null=True, blank=True)
    restaurant = models.ForeignKey(to=Restaurant, related_name='restaurant_images', on_delete=models.CASCADE)

"""
(user id, date, restaurant id)
"""


class Comment(models.Model):
    user = models.ForeignKey(to=ModifiedUser, related_name='comment', on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_created=True, auto_now_add=True)
    restaurant = models.ForeignKey(to=Restaurant, related_name='restaurant_comment', on_delete=models.CASCADE)
    contents = models.CharField(max_length=250)


"""
Blog (Title, Image, Contents, publish date, restaurant id foreign key, likes (many to many field to User))
"""


class Blog(models.Model):
    restaurant = models.ForeignKey(to=Restaurant, related_name='restaurant', on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    banner = models.ImageField(upload_to='blogs/', null=True, blank=True)
    contents = models.CharField(max_length=5000)
    publish_timestamp = models.DateTimeField(auto_created=True, auto_now_add=True)
    likes = models.ManyToManyField(to=ModifiedUser, related_name="blog_likes")


class MenuItem(models.Model):
    name = models.CharField(max_length=100)
    description = models.CharField(max_length=200)
    price = models.DecimalField(max_digits=8, decimal_places=2, validators=[MinValueValidator(0)])
    picture = models.ImageField(upload_to='menu/', null=True, blank=True)
    restaurant = models.ForeignKey(to=Restaurant, on_delete=models.CASCADE, related_name='menuitems')


"""
Notification
"""


class Notification(models.Model):
    user = models.ForeignKey(to=ModifiedUser, on_delete=models.CASCADE, related_name='users')
    # Enum, all possible notification types
    NOTIFICATION_TYPE = (
        ("NEWBLOG", "newblog"),
        ("MENUUPDATE", "menuupdate"),
        ("FOLLOWED", "followed"),
        ("LIKEDRES", "likedres"),
        ("LIKEDBLOG", "likedblog"),
        ("COMMENTED", "commented")
    )
    type = models.CharField(max_length=10, choices=NOTIFICATION_TYPE, default="GENERAL")
    # Indicates whether the notification was viewed or not.
    viewed = models.BooleanField(default=False)
    # The user that receiver the notification
    blog = models.ForeignKey(to=Blog, on_delete=models.CASCADE, blank=True, null=True)
    restaurant = models.ForeignKey(to=Restaurant, on_delete=models.CASCADE, blank=True, null=True)
    # A user that triggered the notification. For example, a follower, liker or a commenter.
    actor_user = models.ForeignKey(to=ModifiedUser, on_delete=models.CASCADE, blank=True, null=True)
