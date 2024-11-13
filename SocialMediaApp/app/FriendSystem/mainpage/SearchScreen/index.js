import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Image, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const UserSearchAndFriendRequest = () => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [friends, setFriends] = useState([]);
  const [friendRequestCount, setFriendRequestCount] = useState(0);
  const [lastRequestTime, setLastRequestTime] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [sentRequests, setSentRequests] = useState(new Set()); // Track sent friend requests

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        if (!token) {
          return;
        }

        const response = await axios.get('http://192.168.86.32:8000/api/user/friends/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFriends(response.data);
      } catch (error) {
        console.error('Error fetching friends:', error);
      }
    };

    fetchFriends();

    const interval = setInterval(() => {
      if (lastRequestTime && (Date.now() - lastRequestTime) > 60000) {
        setFriendRequestCount(0);
        setLastRequestTime(null);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lastRequestTime]);

  const handleSearch = async () => {
    if (!searchKeyword.trim()) {
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(null);
    try {
      const response = await axios.get(`http://192.168.86.32:8000/api/user/search/?q=${searchKeyword}`);
      setUsers(response.data);
    } catch (err) {
      setError('Error fetching users');
      Alert.alert('Error', 'Error fetching users');
    }
    setLoading(false);
  };

  const handleSendRequest = async (userId) => {
    if (friendRequestCount >= 3) {
      setError('You cannot send more than 3 friend requests within a minute.');
      Alert.alert('Error', 'You cannot send more than 3 friend requests within a minute.');
      return;
    }

    setIsSending(true);
    setError('');

    if (friends.some((friend) => friend.id === userId)) {
      setError('User is already a friend');
      Alert.alert('Error', 'User is already a friend');
      setIsSending(false);
      return;
    }

    setSuccess(null);
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        setError('Token not found');
        Alert.alert('Error', 'Token not found');
        setIsSending(false);
        return;
      }

      const response = await axios.post(
        'http://192.168.86.32:8000/api/user/send-friend-request/',
        { to_user_id: userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // setSuccess(response.data.msg);
      Alert.alert('Success', response.data.msg);
      setFriendRequestCount((prevCount) => prevCount + 1);
      setLastRequestTime(Date.now());
      setSentRequests((prev) => new Set(prev).add(userId));
    } catch (error) {
      if (error.response) {
        // setError(error.response.data.detail || 'You cannot send multiple requests to the same user');
        Alert.alert('Error', error.response.data.detail || 'You cannot send multiple requests to the same user');
      } else if (error.request) {
        // setError('No response received from server');
        Alert.alert('Error', 'No response received from server');
      } else {
        // setError(error.message);
        Alert.alert('Error', error.message);
      }
    }
    setIsSending(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setSearchKeyword('');  
    setUsers([]);  
    await handleSearch();  
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          value={searchKeyword}
          onChangeText={setSearchKeyword}
          placeholder="Search for users by name or email"
          style={styles.searchInput}
          accessibilityLabel="Search for users"
        />
        <TouchableOpacity
          onPress={handleSearch}
          style={styles.searchButton}
          accessibilityLabel="Search"
        >
          <Ionicons name="search" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {loading && <ActivityIndicator size="small" color="#0000ff" style={styles.loadingIndicator} />}
      {error && <Text style={styles.errorText}>{error}</Text>}
      {success && <Text style={styles.successText}>{success}</Text>}

      <FlatList
        data={users}
        keyExtractor={(user) => user.id.toString()}
        renderItem={({ item }) => {
          const isRequestSent = sentRequests.has(item.id); // Check if request is sent
          const isFriend = friends.some((friend) => friend.id === item.id); // Check if user is already a friend
          return (
            <View style={styles.userItem}>
              <Image
                source={item.profile_pic ? { uri: `http://192.168.86.32:8000${item.profile_pic}` } : require('./../../../../assets/images/profile.png')}
                style={styles.profileImage}
              />
              <Text style={styles.userName}>{item.name}</Text>
              {isFriend ? (
                <Text style={styles.buttonText}>Friend</Text>
              ) : (
                <TouchableOpacity
                  onPress={() => handleSendRequest(item.id)}
                  disabled={isSending}
                  style={[styles.requestButton, { backgroundColor: isSending ? 'gray' : 'black' }]} >
                  <Text style={styles.buttonText}>{isRequestSent ? 'Request Sent' : 'Send Request'}</Text>
                </TouchableOpacity>
              )}
            </View>
          );
        }}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginRight: 10,
  },
  searchButton: {
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingIndicator: {
    marginVertical: 10,
  },
  errorText: {
    color: 'red',
    marginVertical: 10,
  },
  successText: {
    color: 'green',
    marginVertical: 10,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userName: {
    flex: 1,
    flexWrap: 'wrap', // Allows text to wrap
  },
  requestButton: {
    padding: 8,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
  },
});

export default UserSearchAndFriendRequest;
