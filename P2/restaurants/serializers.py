from rest_framework import serializers

from restaurants.models import Notification, Restaurant, MenuItem

class RestaurantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Restaurant
        fields = ['id', 'owner', 'followers', 'name', 'address', 'email', 'phone_num', 'views', 'likes', 'comment', 'blog', 'logo']


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