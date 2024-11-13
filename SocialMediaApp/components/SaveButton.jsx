// src/components/SaveButton.js
import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SaveButton = ({ postId }) => {
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      await fetch(`http://192.168.86.32:8000/api/user/posts/${postId}/save/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      setSaved(true);
    } catch (error) {
      console.error('Error saving post:', error);
    }
  };

  const handleUnsave = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      await fetch(`http://192.168.86.32:8000/api/user/posts/${postId}/save/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      setSaved(false);
    } catch (error) {
      console.error('Error unsaving post:', error);
    }
  };

  return (
    <TouchableOpacity onPress={saved ? handleUnsave : handleSave} style={styles.button}>
      <View style={styles.buttonContent}>
        <Ionicons 
          name={saved ? "bookmark" : "bookmark"} 
          size={30} 
          color={saved ? 'black' : 'gray'} 
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'transparent',
    padding: 10,
    flexDirection: 'row',  
    alignItems: 'center',  
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    marginLeft: 5, 
    fontSize: 16, 
  },
});

export default SaveButton;
