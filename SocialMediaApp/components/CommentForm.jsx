import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Modal, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CommentForm = ({ postId }) => {
  const [content, setContent] = useState('');
  const [comments, setComments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch comments when the component mounts
    const fetchComments = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        const response = await fetch(`http://192.168.86.32:8000/api/user/posts/${postId}/comment/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch comments');
        }

        const data = await response.json();
        setComments(data);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    if (showModal) {
      fetchComments();
    }
  }, [postId, showModal]);

  const handleSubmit = async () => {
    setError(null);

    try {
      const token = await AsyncStorage.getItem('accessToken');
      const response = await fetch(`http://192.168.86.32:8000/api/user/posts/${postId}/comment/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData);
        throw new Error('Network response was not ok');
      }

      const newComment = await response.json();
      setComments([newComment, ...comments]);
      setContent('');
    } catch (error) {
      console.error('Error commenting on post:', error);
    }
  };

  return (
    <>
      <TouchableOpacity onPress={() => setShowModal(true)} style={styles.commentButton}>
        <AntDesign name="message1" size={24} color="black" /> 
      </TouchableOpacity>

      <Modal visible={showModal} animationType="slide">
        <View style={styles.modalContent}>
          <TouchableOpacity onPress={() => setShowModal(false)} style={styles.closeButton}>
            <Text style={styles.closeText}>×</Text>
          </TouchableOpacity>

          <ScrollView style={styles.commentList}>
            {comments.map((comment) => (
              <View key={comment.id} style={styles.comment}>
                <Text style={styles.commentUser}>{comment.user}:</Text>
                <Text>{comment.content}</Text>
              </View>
            ))}
          </ScrollView>

          <TextInput
            style={styles.textarea}
            value={content}
            onChangeText={setContent}
            placeholder="Write a comment..."
            multiline
          />
          <Button title="Submit" onPress={handleSubmit} color="black" />
          {error && <Text style={styles.error}>Error: {JSON.stringify(error)}</Text>}
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  commentButton: {
    padding: 10,
  },
  modalContent: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  closeText: {
    fontSize: 24,
    color: 'black',
  },
  commentList: {
    maxHeight: '60%',
  },
  comment: {
    marginVertical: 5,
  },
  commentUser: {
    fontWeight: 'bold',
  },
  textarea: {
    height: 100,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
});

export default CommentForm;
