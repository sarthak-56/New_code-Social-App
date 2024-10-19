from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from .models import ChatRoom, Message
from .serializers import ChatRoomSerializer, MessageSerializer

class ChatRoomView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        chatrooms = ChatRoom.objects.filter(users=request.user)
        serializer = ChatRoomSerializer(chatrooms, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        user_ids = request.data.get('users')
        if not user_ids:
            return Response({"error": "At least one user must be specified"}, status=status.HTTP_400_BAD_REQUEST)

        # Check if a chat room already exists with the specified users
        existing_chatroom = ChatRoom.objects.filter(users=request.user).filter(users__in=user_ids).distinct()
        
        if existing_chatroom.exists():
            # Return the ID of the existing chat room
            return Response({"msg": "Chat room already exists", "chatroom_id": existing_chatroom.first().id}, status=status.HTTP_200_OK)

        # Create a new chat room
        chatroom = ChatRoom.objects.create()
        chatroom.users.add(*user_ids)
        chatroom.users.add(request.user)  # Add the current user to the chatroom

        return Response({"msg": "Chat room created", "chatroom_id": chatroom.id}, status=status.HTTP_201_CREATED)

class MessageView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, chatroom_id):
        chatroom = get_object_or_404(ChatRoom, id=chatroom_id, users=request.user)
        messages = chatroom.messages.all()
        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, chatroom_id):
        chatroom = get_object_or_404(ChatRoom, id=chatroom_id, users=request.user)
        content = request.data.get('content')
        if not content:
            return Response({"error": "Message content cannot be empty"}, status=status.HTTP_400_BAD_REQUEST)

        message = Message.objects.create(chatroom=chatroom, sender=request.user, content=content)
        serializer = MessageSerializer(message)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
