# socket/socket_server.py
import eventlet
import socketio

# Create a Socket.IO server instance
sio = socketio.Server(cors_allowed_origins='*')  # Allow CORS for all origins

# Define event handlers
@sio.event
def connect(sid, environ):
    print(f'User connected: {sid}')

@sio.event
def disconnect(sid):
    print(f'User disconnected: {sid}')

@sio.event
def join_room(data):
    room = data['room']
    socketio.join_room(room)
    print(f'User {sid} joined room: {room}')

@sio.event
def chat_message(data):
    room = data['room']
    message = data['message']
    sio.emit('message', {'user': sid, 'message': message}, room=room)

# Create a WSGI application
app = socketio.WSGIApp(sio)

if __name__ == '__main__':
    eventlet.wsgi.server(eventlet.listen(('127.0.0.1', 8001)), app)
