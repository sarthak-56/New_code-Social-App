import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import LikeButton from './../../../../components/LikeButton';
import CommentForm from './../../../../components/CommentForm';
import ShareButton from './../../../../components/ShareButton';
import ImageModal from './../../../../components/ImageModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const SavedPost = () => {
  const [savedPosts, setSavedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [likedUsers, setLikedUsers] = useState({});

  useEffect(() => {
    fetchSavedPosts();
  }, []);

  const fetchSavedPosts = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('accessToken');
      const response = await fetch('http://192.168.21.32:8000/api/user/saved-posts/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setSavedPosts(data);
    } catch (error) {
      console.error('Error fetching saved posts:', error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);  // Start the refreshing state
    await fetchSavedPosts();  // Fetch the saved posts again
    setRefreshing(false);  // End the refreshing state
  };

  const handleRemovePost = async (postId) => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      await fetch(`http://192.168.21.32:8000/api/user/posts/${postId}/save/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      // Update the local state immediately after unsaving
      setSavedPosts((prevPosts) => prevPosts.filter(post => post.id !== postId));
    } catch (error) {
      console.error('Error unsaving post:', error);
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const openModal = (imageUrl) => {
    setCurrentImage(imageUrl);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentImage('');
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  return (
    <View style={styles.container}>
      {savedPosts.length > 0 ? (
        <FlatList
          data={savedPosts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            item.content && (
              <View style={styles.post}>
                <Text style={styles.userName}>{item.user}</Text>
                {item.image && (
                  <TouchableOpacity onPress={() => openModal(`http://192.168.21.32:8000${item.image}`)}>
                    <Image
                      source={{ uri: `http://192.168.21.32:8000${item.image}` }}
                      style={styles.postImage}
                    />
                  </TouchableOpacity>
                )}
                <Text style={styles.postContent}>{item.content}</Text>
                <View style={styles.buttonContainer}>
                  <View style={styles.buttonGroupLeft}>
                    <LikeButton postId={item.id} setLikedUsers={setLikedUsers}/>
                    <CommentForm postId={item.id} />
                    <ShareButton postId={item.id} />
                  </View>
                  <TouchableOpacity onPress={() => handleRemovePost(item.id)} style={styles.removeButton}>
                    <Ionicons name="bookmark" size={24} color="black" />
                  </TouchableOpacity>
                </View>
                {item.created_at && <Text style={styles.timestamp}>{formatDate(item.created_at)}</Text>}
              </View>
            )
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
            />
          }
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <Text>No saved posts to display</Text>
      )}

      <ImageModal isOpen={isModalOpen} imageUrl={currentImage} onClose={closeModal} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  post: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 16,
    backgroundColor: '#fff',
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 8,
    resizeMode: 'cover',
  },
  postContent: {
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonGroupLeft: {
    flexDirection: 'row',
  },
  removeButton: {
    padding: 8,
  },
  timestamp: {
    marginTop: 8,
    color: '#666',
  },
});

export default SavedPost;
