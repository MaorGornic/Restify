from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from django.contrib.auth.password_validation import validate_password
from .models import ModifiedUser
from restaurants.models import Notification


class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=ModifiedUser.objects.all())]
    )

    password = serializers.CharField(
        write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = ModifiedUser
        fields = ('username', 'password', 'password2',
                  'email', 'first_name', 'last_name')
        extra_kwargs = {
            'first_name': {'required': True},
            'last_name': {'required': True}
        }

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError(
                {"password": "Password fields didn't match."})

        return attrs

    def create(self, validated_data):
        user = ModifiedUser.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name']
        )

        user.set_password(validated_data['password'])
        user.save()

        return user


class ModifiedUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = ModifiedUser
        fields = ['id', 'username', 'first_name',
                  'last_name', 'email', 'avatar', 'phone_num']


class NotificationRecordsSerializer(serializers.ModelSerializer):
    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep.update({"user": {"id": rep.get("user").get("id"),
                             "username": rep.get("user").get("username"),
                             "first_name": rep.get("user").get("first_name"),
                             "last_name": rep.get("user").get("last_name")}})
        if rep.get("actor_user"):
            rep.update({"actor_user": {"id": rep.get("actor_user").get("id"),
                                   "username": rep.get("actor_user").get("username"),
                                   "first_name": rep.get("actor_user").get("first_name"),
                                   "last_name": rep.get("actor_user").get("last_name")}})

        rep.update({"restaurant":
                    {"id": rep.get("restaurant").get("id"),
                     "name": rep.get("restaurant").get("name")}})
        return rep

    class Meta:
        model = Notification
        fields = ['id','user', 'type', 'viewed', 'blog', 'restaurant', 'actor_user']
        depth = 1
