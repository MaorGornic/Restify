from rest_framework import serializers

from restaurants.models import MenuItem


class MenuItemSerializer(serializers.ModelSerializer):
    restaurant = serializers.ReadOnlyField()

    class Meta:
        model = MenuItem
        fields = ['id', 'name', 'description', 'price', 'picture', 'restaurant']