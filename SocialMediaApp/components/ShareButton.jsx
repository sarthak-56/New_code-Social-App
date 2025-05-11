import React from 'react';
import { TouchableOpacity, StyleSheet, Alert, Linking } from 'react-native'; // Import Linking here
import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ShareButton = ({ postId }) => {
  const handleShare = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      const response = await fetch(`http://192.168.1.49:8000/api/user/posts/${postId}/share/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();

        const message = encodeURIComponent(data.message);
        const url = encodeURIComponent(data.url);
        const whatsappUrl = `https://wa.me/?text=${message} ${url}`;

        // Open the WhatsApp share dialog
        Linking.openURL(whatsappUrl); // Using Linking from React Native
      } else {
        Alert.alert('Error', 'Error sharing post.'); // Show alert on error
      }
    } catch (error) {
      console.error('Error sharing post:', error);
      Alert.alert('Error', 'An unexpected error occurred.');
    }
  };

  return (
    <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
      <AntDesign name="sharealt" size={24} color="black" />  
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  shareButton: {
    padding: 10,
  },
});

export default ShareButton;
