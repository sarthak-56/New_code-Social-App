# chatapp/models.py
from django.db import models
from django.conf import settings 
from django.utils import timezone


class ChatRoom(models.Model):
    users = models.ManyToManyField(settings.AUTH_USER_MODEL)  # Use AUTH_USER_MODEL
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"ChatRoom {self.id} - Users: {', '.join(user.username for user in self.users.all())}"

class Message(models.Model):
    chatroom = models.ForeignKey(ChatRoom, related_name="messages", on_delete=models.CASCADE)
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, related_name="sent_messages", on_delete=models.CASCADE)  # Use AUTH_USER_MODEL
    content = models.TextField()
    timestamp = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Message from {self.sender} in ChatRoom {self.chatroom.id} - {self.timestamp}"
