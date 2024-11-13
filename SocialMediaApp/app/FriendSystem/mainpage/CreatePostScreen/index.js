import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, Alert, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';

const PostForm = () => {
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  const handleImagePicker = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
        alert('Permission to access camera roll is required!');
        return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
    });

    if (!result.canceled) {
        const selectedImage = result.assets ? result.assets[0].uri : result.uri;
        setImage(selectedImage); // Directly set the selected image here
    }
  };

  const createPost = async (formData, accessToken) => {
    try {
      const response = await axios.post(
        'http://192.168.86.32:8000/api/user/userposts/',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return response.data;
    } catch (err) {
      throw err;
    }
  };

  const handleSubmit = async () => {
    if (!content && !image) {
      Alert.alert("Error", "Please add content or an image to create a post.");
      return;
    }

    const formData = new FormData();
    formData.append('content', content);

    if (image) {
      const uriParts = image.split('.');
      const fileType = uriParts[uriParts.length - 1];
      formData.append('image', {
        uri: image,
        name: `photo.${fileType}`,
        type: `image/${fileType}`,
      });
    }

    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        Alert.alert("Error", "Authentication token not found. Please log in again.");
        navigation.navigate('Login');
        return;
      }

      const response = await createPost(formData, token);
      console.log('Post created:', response);
      Alert.alert("Success", "Post created successfully!");
      setContent('');
      setImage(null);  // Clear the image after submitting
    } catch (err) {
      console.error("Error creating post:", err);
      const errorMessage = err.response?.data?.message || 'An error occurred while creating the post.';
      setError(errorMessage);
      Alert.alert("Error", errorMessage);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setImage(null); // Clear the selected image during refresh

    try {
      const token = await AsyncStorage.getItem('accessToken');
      const response = await axios.get('http://192.168.86.32:8000/api/user/userposts/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Posts fetched:', response.data);
      // Handle the fetched data as needed
    } catch (err) {
      console.error("Error fetching posts:", err);
      Alert.alert("Error", "Failed to fetch posts.");
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {image && <Image source={{ uri: image }} style={styles.image} />}

      {!image && (
        <TouchableOpacity style={styles.imagePickerContainer} onPress={handleImagePicker}>
          <Image source={require('./../../../../assets/images/upload.jpg')} style={styles.uploadImage} />
          <Text>No image selected</Text>
        </TouchableOpacity>
      )}

      <TextInput
        style={styles.textInput}
        placeholder="Write something here..."
        value={content}
        onChangeText={setContent}
        multiline
      />

      <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
        <Text style={styles.submitButtonText}>
          Upload
        </Text>
      </TouchableOpacity>
      {error && <Text style={styles.errorText}>Error: {error}</Text>}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  imagePickerContainer: {
    alignItems: 'center',
    marginBottom: 50,
    marginTop: 20,
  },
  uploadImage: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
  image: {
    width: '100%',
    height: 300,
    marginTop: 10,
    resizeMode: 'contain',
  },
  textInput: {
    height: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    marginBottom: 20,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: 'black',
    borderRadius: 99,
    padding: 10,
    margin: 10,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
});

export default PostForm;
