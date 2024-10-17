from rest_framework import serializers
from app.models import User, FriendRequest, Friendship, UserPost, Like, Comment, Save
from django.utils.encoding import smart_str, force_bytes, DjangoUnicodeDecodeError
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from rest_framework import generics, permissions

class UserRegistrationSerializer(serializers.ModelSerializer):
  password2 = serializers.CharField(style={'input_type':'password'}, write_only=True)
  class Meta:
    model = User
    fields=['email', 'name', 'password', 'password2', 'tc']
    extra_kwargs={
      'password':{'write_only':True}
    }

  def validate(self, attrs):
    password = attrs.get('password')
    password2 = attrs.get('password2')
    if password != password2:
      raise serializers.ValidationError("Password and Confirm Password doesn't match")
    return attrs

  def create(self, validate_data):
    return User.objects.create_user(**validate_data)

class UserLoginSerializer(serializers.ModelSerializer):
  email = serializers.CharField(max_length=255)
  class Meta:
    model = User
    fields = ['email', 'password']

class UserProfileSerializer(serializers.ModelSerializer):
  class Meta:
    model = User
    fields = ['id', 'name', 'email', 'bio', 'profile_pic', 'cover_pic']

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'name', 'email', 'tc', 'profile_pic', 'cover_pic', 'bio']   # Include any other fields you need
        read_only_fields = ['email']

    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        instance.tc = validated_data.get('tc', instance.tc)
        if 'profile_pic' in validated_data:
            instance.profile_pic = validated_data['profile_pic']
        if 'cover_pic' in validated_data:
            instance.cover_pic = validated_data['cover_pic']
        instance.bio = validated_data.get('bio', instance.bio)
        instance.save()
        return instance 

class FriendRequestSerializer(serializers.ModelSerializer):
    from_user = UserSerializer()
    to_user = UserSerializer()

    class Meta:
        model = FriendRequest
        fields = ['id', 'from_user', 'to_user', 'timestamp', 'accepted', 'rejected']

class FriendshipSerializer(serializers.ModelSerializer):
    user1 = UserSerializer()
    user2 = UserSerializer()

    class Meta:
        model = Friendship
        fields = ['id', 'user1', 'user2', 'created']

class UserPostSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()

    class Meta:
        model = UserPost
        fields = ['id', 'user', 'content', 'image', 'created_at']

class GlobalFeedPostSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()

    class Meta:
        model = UserPost
        fields = ['id', 'user', 'content', 'image', 'created_at']

class LikeSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)  # Use primary key (user_id)
    email = serializers.StringRelatedField(source='user', read_only=True)  # Use string representation (username)

    class Meta:
        model = Like
        fields = ['id', 'user', 'email', 'post', 'created_at']  # Include both 'user' (id) and 'user_name'

class CommentSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()

    class Meta:
        model = Comment
        fields = ['content','user']

class SaveSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()
    class Meta:
        model = Save
        fields = ['id', 'user', 'post', 'created_at']