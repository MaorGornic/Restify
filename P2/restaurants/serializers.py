from rest_framework import serializers

from restaurants.models import Restaurant, MenuItem

class RestaurantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Restaurant
        fields = ['id', 'owner', 'followers', 'name', 'address', 'email', 'phone_num', 'views', 'likes', 'comment', 'blog', 'logo']


class MenuItemSerializer(serializers.ModelSerializer):
    restaurant = serializers.ReadOnlyField()

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep.pop('restaurant')
        rep.update({'restaurant_id': 1})
        return rep

    class Meta:
        model = MenuItem
        fields = ['id', 'name', 'description', 'price', 'picture', 'restaurant']