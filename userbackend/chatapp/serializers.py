from rest_framework import serializers
from .models import Message, ChatRoom

class MessageSerializer(serializers.ModelSerializer):
    sender = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Message
        fields = ['id', 'chatroom', 'sender', 'content', 'timestamp']

class ChatRoomSerializer(serializers.ModelSerializer):
    users = serializers.StringRelatedField(many=True)

    class Meta:
        model = ChatRoom
        fields = ['id', 'users', 'created_at', 'messages']
