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
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Permission Required", "Permission to access media library is required!");
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    console.log("Picker Result:", pickerResult);

    if (!pickerResult.canceled && pickerResult.assets && pickerResult.assets.length > 0) {

      const imageUri = pickerResult.assets[0].uri;
      console.log("Image URI:", imageUri);
      setImage(imageUri);
    } else if (pickerResult.canceled) {
      console.log("Image selection was cancelled");
    } else {
      console.log("No image selected or undefined URI");
    }
  };

  const createPost = async (formData, accessToken) => {
    try {
      const response = await axios.post(
        'http://192.168.21.32:8000/api/user/userposts/',
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
      setImage(null);
      navigation.navigate('Main');
    } catch (err) {
      console.error("Error creating post:", err);
      const errorMessage = err.response?.data?.message || 'An error occurred while creating the post.';
      setError(errorMessage);
      Alert.alert("Error", errorMessage);
    }
  };
 
  const onRefresh = async () => {
    setRefreshing(true);
    
    try {
      const token = await AsyncStorage.getItem('accessToken');
      // Example API call to fetch posts
      const response = await axios.get('http://192.168.21.32:8000/api/user/userposts/', {
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

      <View style={styles.imagePickerContainer}>
        <Button title="Select an Image" onPress={handleImagePicker}/>
        {!image && <Text>No image selected</Text>}
      </View>

      <TextInput
        style={styles.textInput}
        placeholder="Write something here..."
        value={content}
        onChangeText={setContent}
        multiline
      />


      <TouchableOpacity onPress={handleSubmit} style={{
        backgroundColor: 'black',
        borderRadius: 99,
        padding:10,
        margin:10
      }}><Text style={{
        color: 'white',
        fontSize: 20,
        fontWeight: 800,
        textAlign:'center'
      }}>
          Upload</Text></TouchableOpacity>
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
  image: {
    width: '100%',
    height: 300,
    marginTop: 10,
    resizeMode: 'contain'
  },
  textInput: {
    height: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    marginBottom: 20,
    textAlignVertical: 'top',
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
});

export default PostForm;
