from rest_framework import serializers

from restaurants.models import Comment, Notification, Restaurant, MenuItem

class RestaurantSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField()
    followers = serializers.ReadOnlyField()
    views = serializers.ReadOnlyField()
    likes = serializers.ReadOnlyField()

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        self.owner = rep.get("owner", None)
        rep.pop('owner')
        rep.update({'owner_id': self.owner.id})

        followers = []
        likes = []

        if "followers" in rep:
            for follower in rep["followers"].all().iterator():
                followers.append(follower.id)

        if "likes" in rep:
            for like in rep["likes"].all().iterator():
                likes.append(like.id)

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
            Notification.objects.create(message=f"{self.restaurant.name} has added a new item to their menu",
                                        type="GENERAL", user=follower)
        return super().create(validated_data)

    class Meta:
        model = MenuItem
        fields = ['id', 'name', 'description', 'price', 'picture', 'restaurant']



# Comments Serializer
class CommentSerializer(serializers.ModelSerializer):
    restaurant = serializers.ReadOnlyField()

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        if not hasattr(self, "restaurant"):
            self.restaurant = rep.get("restaurant", None)
        rep.pop('restaurant')
        rep.update({'restaurant_id': self.restaurant.id})
        return rep

    class Meta:
        model = Comment
        fields = ['id', 'user', 'timestamp', 'restaurant']
