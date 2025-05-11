import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, Modal, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; // Added missing import for Ionicons

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

        const response = await axios.get('http://192.168.1.49:8000/api/user/friends/', {
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

  // const unfriend = async (friendId) => {
  //   try {
  //     const token = await AsyncStorage.getItem('accessToken');
  //     await axios.delete(`http://192.168.227.32:8000/api/user/friends/${friendId}/`, {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });
  //     setFriends((prevFriends) => prevFriends.filter((friend) => friend.id !== friendId));
  //     closeModal();
  //   } catch (error) {
  //     Alert.alert('Error', 'Error unfriending');
  //     console.error('Error unfriending:', error);
  //   }
  // };
  
  const formatBirthday = (date) => {
    if (!date) return ''; 
    const formattedDate = new Date(date);
    return `${formattedDate.getDate()}/${formattedDate.getMonth() + 1}/${formattedDate.getFullYear()}`;
  };

  const formatDate = (date) => {
    const formattedDate = new Date(date);
    return `${formattedDate.getDate()}/${formattedDate.getMonth() + 1}/${formattedDate.getFullYear()}`;
  };

  const renderFriend = ({ item }) => (
    <View style={styles.friendItem}>
      <Image
        style={styles.profilePicture}
        source={item.profile_pic ? { uri: `http://192.168.1.49:8000${item.profile_pic}` } : require('./../../../../assets/images/profile.png')}
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

              {/* Cover Picture */}
              <Image
                style={styles.coverPicture}
                source={selectedFriend.cover_pic ? { uri: `http://192.168.1.49:8000${selectedFriend.cover_pic}` } : require('./../../../../assets/images/cover.jpg')}
                onError={(error) => console.error('Cover image load error:', error)}
              />

              {/* Profile Picture */}
              <Image
                style={styles.ModalprofilePicture}
                source={selectedFriend.profile_pic ? { uri: `http://192.168.1.49:8000${selectedFriend.profile_pic}` } : require('./../../../../assets/images/profile.png')}
                onError={(error) => console.error('Profile image load error:', error)}
              />

              {/* Name and Email */}
              <Text style={styles.friendName}>{selectedFriend.name}</Text>
              <Text style={styles.email}>{selectedFriend.email}</Text>
              <Text style={styles.bio}>{selectedFriend.bio}</Text>

              {/* Unfriend Button */}
              {/* <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={() => unfriend(selectedFriend.id)}>
                  <Text style={styles.buttonText}>Unfriend</Text>
                </TouchableOpacity>
              </View> */}

              {/* Additional Info */}
              <View style={{ marginTop: 40, marginLeft: -10 }}>
                {/* Lives in */}
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                  <Ionicons name="location" size={24} color="gray" />
                  <Text style={{ color: 'gray', fontSize: 18, marginLeft: 8 }}>
                    Lives in <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 18 }}> {selectedFriend.location ? selectedFriend.location : "N/A ----------------------------"}</Text>
                  </Text>
                </View>

                {/* Works at */}
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                  <Ionicons name="briefcase" size={24} color="gray" />
                  <Text style={{ color: 'gray', fontSize: 18, marginLeft: 8 }}>
                    Works at <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 18 }}>{selectedFriend.work ? selectedFriend.work : "N/A ----------------------------"}</Text>
                  </Text>
                </View>

                {/* Studied at */}
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                  <Ionicons name="school" size={24} color="gray" />
                  <Text style={{ color: 'gray', fontSize: 18, marginLeft: 8 }}>
                    Studied at <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 18 }}>{selectedFriend.study ? selectedFriend.study : "N/A ----------------------------"}</Text>
                  </Text>
                </View>

                {/* Relationship Status */}
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                  <Ionicons name="heart" size={24} color="gray" />
                  <Text style={{ color: 'gray', fontSize: 18, marginLeft: 8 }}>
                    Relationship <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 18 }}>{selectedFriend.relationship_status}</Text>
                  </Text>
                </View>

                {/* Birthday */}
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                  <Ionicons name="calendar" size={24} color="gray" />
                  <Text style={{ color: 'gray', fontSize: 18, marginLeft: 8 }}>
                    Birthday <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 18 }}>{formatBirthday(selectedFriend.date_of_birth ? selectedFriend.date_of_birth : "_________________")}</Text>
                  </Text>
                </View>

                {/* Joined */}
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                  <Ionicons name="time" size={24} color="gray" />
                  <Text style={{ color: 'gray', fontSize: 18, marginLeft: 8 }}>
                    Joined <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 18 }}>{formatDate(selectedFriend.created_at)}</Text>
                  </Text>
                </View>
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
  ModalprofilePicture: {
    width: 130,
    height: 130,
    borderRadius: 99,
    borderWidth: 1,
    borderColor: 'white',
    marginTop: -80,

  },
  friendName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 16,
    color: 'gray',
  },
  bio: {
    fontSize: 14,
    color: 'gray',
    marginVertical: 5,
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#ff5c5c',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    height: '99%',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 10,
  },
  closeButtonText: {
    fontSize: 30,
    color: '#888',
  },
  coverPicture: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
});

export default FriendList;
