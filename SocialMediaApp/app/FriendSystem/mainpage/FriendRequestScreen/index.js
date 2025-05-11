import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FriendRequestList = ({ token }) => {
  const [friendRequests, setFriendRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFriendRequests = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = await AsyncStorage.getItem('accessToken');
        const response = await axios.get('http://192.168.1.49:8000/api/user/friend-requests/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFriendRequests(response.data);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          setError('Unauthorized. Please login again.');
        } else {
          setError('Error fetching friend requests');
        }
      }
      setLoading(false);
    };
    fetchFriendRequests();
  }, [token]);

  const handleAccept = async (friendRequestId) => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      await axios.post('http://192.168.1.49:8000/api/user/accept-friend-request/',
        { friend_request_id: friendRequestId },
        { headers: { Authorization: `Bearer ${token}` } });
      setFriendRequests((prevRequests) => prevRequests.filter((request) => request.id !== friendRequestId));
      Alert.alert('Friend request accepted');
    } catch (error) {
      console.error('Error accepting friend request', error);
      Alert.alert('Error', 'Unable to accept friend request');
    }
  };

  const handleReject = async (friendRequestId) => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      await axios.post('http://192.168.1.49:8000/api/user/reject-friend-request/',
        { friend_request_id: friendRequestId },
        { headers: { Authorization: `Bearer ${token}` } });
      setFriendRequests((prevRequests) => prevRequests.filter((request) => request.id !== friendRequestId));
      Alert.alert('Friend request rejected');
    } catch (error) {
      console.error('Error rejecting friend request', error);
      Alert.alert('Error', 'Unable to reject friend request');
    }
  };

  if (loading) return <ActivityIndicator size="large" color="#0000ff" style={styles.loading} />;
  if (error) return <Text style={styles.error}>{error}</Text>;

  return (
    <View style={styles.container}>
      <FlatList
        data={friendRequests}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.friendRequestItem}>
            <Text style={styles.requestInfo}>
              Request from {item.from_user.name} 
            </Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.acceptButton} onPress={() => handleAccept(item.id)}>
                <Text style={styles.buttonText}>Accept</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.rejectButton} onPress={() => handleReject(item.id)}>
                <Text style={styles.buttonText}>Reject</Text>
              </TouchableOpacity>
            </View>
          </View>

        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container:{
    backgroundColor:'white',
    height:900
  },
  friendRequestItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginTop:10,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 2,
  },
  requestInfo: {
    fontSize: 12,
    flex: 2,  // Allows the text area to take more space
    paddingRight: 8,
  
  },
  buttonContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'flex-end',
  },
  acceptButton: {
    backgroundColor: 'black',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginRight: 8,
  },
  rejectButton: {
    backgroundColor: '#F44336',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});


export default FriendRequestList;
