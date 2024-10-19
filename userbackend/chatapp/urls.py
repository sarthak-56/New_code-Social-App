from django.urls import path
from .views import ChatRoomView, MessageView

urlpatterns = [
    path('chatrooms/', ChatRoomView.as_view(), name='chatroom-list-create'),
    path('chatrooms/<int:chatroom_id>/messages/', MessageView.as_view(), name='message-list-create'),
]
