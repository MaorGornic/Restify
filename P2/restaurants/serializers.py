from rest_framework import serializers
from restaurants.models import Blog, Notification
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

    def update(self, instance, validated_data):
        if 'followers' in validated_data:
            # add a follower to the many to many field of followers
            followers = validated_data.pop('followers')
            for follower in followers:
                instance.followers.add(follower)     

        if 'likes' in validated_data:
            # add a follower to the many to many field of followers
            likes = validated_data.pop('likes')
            for like in likes:
                instance.likes.add(like)             
        return super().update(instance, validated_data)

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
    timestamp = serializers.ReadOnlyField(required=False)
    # curr_user = serializers.SerializerMethodField('_user')

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        if not hasattr(self, "restaurant"):
            self.restaurant = rep.get("restaurant", None)
        rep.pop('restaurant')
        if "user" in rep:
            rep.update({'user': ModifiedUserSerializer(rep["user"]).data})
        rep.update({'restaurant_id': self.restaurant.id})
        return rep

    def create(self, validated_data):
        self.restaurant = validated_data.get("restaurant", None)
        comment = Comment.objects.create(
            # user=ModifiedUserSerializer(validated_data['user']).data,
            user=validated_data['user'],
            # timestamp=timezone.now(),
            restaurant=validated_data['restaurant'],
        )
        Notification.objects.create(type="COMMENTED", user=self.restaurant.owner,
                                    actor_user=validated_data['user'], restaurant=validated_data['restaurant']) # Owner gets the notification
        # return super().create(validated_data)
        return comment

    class Meta:
        model = Comment
        fields = ['id', 'user', 'timestamp', 'restaurant']


# Blog Serializer
class BlogSerializer(serializers.ModelSerializer):
    restaurant = serializers.ReadOnlyField()
    title = serializers.ReadOnlyField()
    banner = serializers.ReadOnlyField()
    contents = serializers.ReadOnlyField()
    publish_timestamp = serializers.ReadOnlyField(required=False)
    likes = serializers.ReadOnlyField()

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        if not hasattr(self, "restaurant"):
            self.restaurant = rep.get("restaurant", None)
        rep.pop('restaurant')
        rep.update({'restaurant_id': self.restaurant.id})
        return rep

    def create(self, validated_data):
        self.restaurant = validated_data.get("restaurant", None)
        blog = Blog.objects.create(
            restaurant=validated_data['restaurant'],
        )
        # Creating a notification for all followers regarding the new blog
        for follower in self.restaurant.followers.all().iterator():
            Notification.objects.create(type="NEWBLOG", user=follower,
                                        restaurant=self.restaurant) # Followers get the notification
        return blog

    class Meta:
        model = Blog
        fields = ['id', 'restaurant', 'title', 'banner', 'contents', 'publish_timestamp', 'likes']

