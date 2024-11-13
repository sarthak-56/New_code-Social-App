import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, Modal, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router'; 

const FriendList = () => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const router = useRouter(); 

  useEffect(() => {
    const fetchFriends = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = await AsyncStorage.getItem('accessToken');
        if (!token) {
          setError('No token found. Please login again.');
          return;
        }
        
        const response = await axios.get('http://192.168.86.32:8000/api/user/friends/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFriends(response.data);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          setError('Unauthorized. Please login again.');
        } else {
          setError('Error fetching friends');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchFriends();
  }, []);

  const openModal = (friend) => {
    setSelectedFriend(friend);
  };

  const closeModal = () => {
    setSelectedFriend(null);
  };

  const unfriend = async (friendId) => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      await axios.delete(`http://192.168.86.32:8000/api/user/friends/${friendId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFriends((prevFriends) => prevFriends.filter((friend) => friend.id !== friendId));
      closeModal();
    } catch (error) {
      Alert.alert('Error', 'Error unfriending');
      console.error('Error unfriending:', error);
    }
  };

  const renderFriend = ({ item }) => (
    <View style={styles.friendItem}>
      <Image
        style={styles.profilePicture}
        source={item.profile_pic ? { uri: `http://192.168.86.32:8000${item.profile_pic}` } : require('./../../../../assets/images/profile.png')}
        onError={(error) => console.error('Image load error:', error)}
      />
      <TouchableOpacity onPress={() => openModal(item)}>
        <Text style={styles.friendName}>{item.name}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : (
        <>
          {error && <Text>{error}</Text>}
          <Text style={styles.num}>{friends.length} Friends</Text>
          <FlatList
            data={friends}
            keyExtractor={(friend) => friend.id.toString()}
            renderItem={renderFriend}
          />
        </>
      )}

      <Modal visible={!!selectedFriend} transparent animationType="slide" onRequestClose={closeModal}>
        {selectedFriend && (
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                <Text style={styles.closeButtonText}>&times;</Text>
              </TouchableOpacity>
              <Image
                style={styles.coverPicture}
                source={selectedFriend.cover_pic ? { uri: `http://192.168.86.32:8000${selectedFriend.cover_pic}` } : require('./../../../../assets/images/cover.jpg')}
                onError={(error) => console.error('Cover image load error:', error)}
              />
              <Text style={styles.friendName}>{selectedFriend.name}</Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={() => unfriend(selectedFriend.id)}>
                  <Text style={styles.buttonText}>Unfriend</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  num: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  friendName: {
    fontSize: 18,
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#333',
  },
  coverPicture: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    backgroundColor: 'black',
    borderRadius: 99,
    padding: 10,
    marginHorizontal: 5,
    marginTop:10,
    flex: 1,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default FriendList;
