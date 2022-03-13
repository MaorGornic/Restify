from django.utils import timezone
from rest_framework import serializers
from accounts.models import ModifiedUser
from restaurants.models import Notification
from restaurants.models import Restaurant, Comment, MenuItem
from accounts.serializers import ModifiedUserSerializer


class RestaurantSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField()
    followers = serializers.ReadOnlyField()
    views = serializers.ReadOnlyField()
    likes = serializers.ReadOnlyField()

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        self.owner = rep.get("owner", None)
        if self.owner:
            rep.pop('owner')
            rep.update({'owner_id': self.owner.id})

            followers = []
            likes = []

            if "followers" in rep:
                for follower in rep["followers"].all().iterator():
                    followers.append(ModifiedUserSerializer(follower).data)

            if "likes" in rep:
                for like in rep["likes"].all().iterator():
                    likes.append(ModifiedUserSerializer(like).data)

            rep.update({"followers": followers, "likes": likes})
        return rep

    class Meta:
        model = Restaurant
        fields = ['id', 'owner', 'followers', 'name', 'address', 'email', 'phone_num', 'views', 'likes', 'logo']


class MenuItemSerializer(serializers.ModelSerializer):
    restaurant = serializers.ReadOnlyField()

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        if not hasattr(self, "restaurant"):
            self.restaurant = rep.get("restaurant", None)
        rep.pop('restaurant')
        rep.update({'restaurant_id': self.restaurant.id})
        return rep

    def create(self, validated_data):
        self.restaurant = validated_data.get("restaurant", None)
        for follower in self.restaurant.followers.all().iterator():
            Notification.objects.create(type="MENUUPDATE", user=follower, 
            restaurant=self.restaurant)
        return super().create(validated_data)

    class Meta:
        model = MenuItem
        fields = ['id', 'name', 'description', 'price', 'picture', 'restaurant']


# Comments Serializer
class CommentSerializer(serializers.ModelSerializer):
    restaurant = serializers.ReadOnlyField()
    user = serializers.ReadOnlyField()
    timestamp = serializers.DateTimeField()
    # curr_user = serializers.SerializerMethodField('_user')

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        if not hasattr(self, "restaurant"):
            self.restaurant = rep.get("restaurant", None)
        rep.pop('restaurant')
        rep.update({'restaurant_id': self.restaurant.id})
        return rep

    def create(self, validated_data):
        self.restaurant = validated_data.get("restaurant", None)
        comment = Comment.objects.create(
            user=validated_data['user'],
            # timestamp=timezone.now(),
            restaurant=validated_data['restaurant'],
        )
        Notification.objects.create(type="COMMENTED", user=self.restaurant.owner)  # Owner gets the notification
        # return super().create(validated_data)
        return comment

    class Meta:
        model = Comment
        fields = ['id', 'user', 'timestamp', 'restaurant']

