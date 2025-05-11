import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, Alert, ScrollView, RefreshControl } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchUserProfile = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      const response = await axios.get('http://192.168.1.49:8000/api/user/profile/', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      setUserData(response.data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      Alert.alert('Error', 'Failed to fetch user profile. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchUserProfile();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (!userData) {
    return <Text>No user data found.</Text>;
  }

  const formatBirthday = (dateString) => {
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };


  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Image
        source={{
          uri: userData.cover_pic
            ? `http://192.168.1.49:8000${userData.cover_pic}`
            : Image.resolveAssetSource(require('./../../../../assets/images/cover.jpg')).uri,
        }}
        style={styles.coverPic}
        resizeMode="cover"
      />
      <Image
        source={{
          uri: userData.profile_pic
            ? `http://192.168.1.49:8000${userData.profile_pic}`
            : Image.resolveAssetSource(require('./../../../../assets/images/profile.png')).uri,
        }}
        style={styles.profilePic}
      />

      <Text style={styles.name}>{userData.name}</Text>
      <Text style={styles.email}>{userData.email}</Text>
      <Text style={styles.bio}>{userData.bio}</Text>


      <View style={{ marginTop: 40, marginLeft: -10 }}>
        {/* Lives in */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
          <Ionicons name="location" size={24} color="gray" />
          <Text style={{ color: 'gray', fontSize: 18, marginLeft: 8 }}>
            Lives in <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 18 }}>{userData.location ? userData.location : "N/A -----------------------------"}</Text>
          </Text>
        </View>

        {/* Works at */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
          <Ionicons name="briefcase" size={24} color="gray" />
          <Text style={{ color: 'gray', fontSize: 18, marginLeft: 8 }}>
            Works at <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 18 }}>{userData.work ? userData.work :"N/A -----------------------------"}</Text>
          </Text>
        </View>

        {/* Studied at */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
          <Ionicons name="school" size={24} color="gray" />
          <Text style={{ color: 'gray', fontSize: 18, marginLeft: 8 }}>
            Studied at <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 18 }}>{userData.study ? userData.study : "N/A ----------------------------"}</Text>
          </Text>
        </View>

        {/* Relationship status */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
          <Ionicons name="heart" size={24} color="gray" />
          <Text style={{ color: 'gray', fontSize: 18, marginLeft: 8 }}>
            Relationship <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 18 }}>{userData.relationship_status}</Text>
          </Text>
        </View>

        {/* Birthday */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
          <Ionicons name="calendar" size={24} color="gray" />
          <Text style={{ color: 'gray', fontSize: 18, marginLeft: 8 }}>
            Birthday <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 18 }}>{formatBirthday(userData.date_of_birth ? userData.date_of_birth : "N/A -------------------------------")}</Text>
          </Text>
        </View>

        {/* Joined */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
          <Ionicons name="time" size={24} color="gray" />
          <Text style={{ color: 'gray', fontSize: 18, marginLeft: 8 }}>
            Joined <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 18 }}>{formatDate(userData.created_at)}</Text>
          </Text>
        </View>

      </View>

      <Text style={{
        fontStyle: 'italic',
        fontSize: 16,
        fontWeight: '300',
        marginTop: 20,
        marginLeft: -10
      }}>
        Go to edit profile and update your profile
      </Text>
    </ScrollView >
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
  },
  coverPic: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  profilePic: {
    width: 130,
    height: 130,
    borderRadius: 99,
    borderWidth: 1,
    borderColor: 'white',
    marginTop: -80,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
  },
  email: {
    fontSize: 16,
    color: 'gray',
  },
  bio: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
  },
});

export default Profile;
