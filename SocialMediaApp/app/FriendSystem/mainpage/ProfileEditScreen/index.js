import { View, Text, TextInput, Button, Image, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';

const EditProfile = () => {
    const [userData, setUserData] = useState({
        name: '',
        bio: '',
        profile_pic: '',
        cover_pic: '',
        location: '',
        work: '',
        study: '',
        date_of_birth: '',
        relationship_status: ''
    });
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const accessToken = await AsyncStorage.getItem('accessToken');
                const response = await axios.get('http://192.168.21.32:8000/api/user/profile/', {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                setUserData(response.data);
            } catch (error) {
                handleAxiosError(error);
            } finally {
                setLoading(false);
            }
        };
        fetchUserProfile();
    }, []);

    const handleUpdateProfile = async () => {
        try {
            setUpdating(true);
            const accessToken = await AsyncStorage.getItem('accessToken');
            const formData = new FormData();

            // Log the current userData for debugging
            console.log('UserData before sending:', userData);

            // Append fields only if they have values
            if (userData.name) formData.append('name', userData.name);
            if (userData.bio) formData.append('bio', userData.bio);
            if (userData.location) formData.append('location', userData.location);
            if (userData.work) formData.append('work', userData.work);
            if (userData.study) formData.append('study', userData.study);
            if (userData.date_of_birth) formData.append('date_of_birth', userData.date_of_birth);
            if (userData.relationship_status) formData.append('relationship_status', userData.relationship_status);

            // Check for image uploads
            if (userData.profile_pic) {
                formData.append('profile_pic', {
                    uri: userData.profile_pic,
                    type: 'image/jpeg', // Ensure the correct type
                    name: 'profile.jpg',
                });
            }

            if (userData.cover_pic) {
                formData.append('cover_pic', {
                    uri: userData.cover_pic,
                    type: 'image/jpeg',
                    name: 'cover.jpg',
                });
            }

            const response = await axios.put(
                'http://192.168.21.32:8000/api/user/profile/update/',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            console.log('Profile updated:', response.data);
            alert('Profile updated successfully!');
            setErrorMessage(''); // Clear error message on success
        } catch (error) {
            handleAxiosError(error);
        } finally {
            setUpdating(false);
        }
    };

    const handleAxiosError = (error) => {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                setErrorMessage(`Error: ${error.response.data.detail || error.response.statusText}`);
            } else if (error.request) {
                setErrorMessage('Error: No response received from the server.');
            } else {
                setErrorMessage(`Error: ${error.message}`);
            }
        } else {
            setErrorMessage('An unexpected error occurred.');
        }
        console.error('Error updating profile:', error);
    };

    const pickImage = async (isCoverPic) => {
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
            if (isCoverPic) {
                setUserData({ ...userData, cover_pic: selectedImage });
            } else {
                setUserData({ ...userData, profile_pic: selectedImage });
            }
        }
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    const RELATIONSHIP_STATUS_CHOICES = [
        { label: 'Single', value: 'single' },
        { label: 'Married', value: 'married' },
        { label: 'Engaged', value: 'engaged' },
        { label: 'In a Relationship', value: 'in_relationship' },
        { label: 'Divorced', value: 'divorced' },
        { label: 'Separated', value: 'separated' },
    ];

    return (
        <ScrollView style={styles.container}>
            {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

            <Text>Profile Picture</Text>
            <Image
                source={{ uri: userData.profile_pic || 'https://via.placeholder.com/100' }}
                style={styles.profilePic}
            />
            <TouchableOpacity onPress={() => pickImage(false)} style={styles.imagePicker}>
                <Text style={{ color: 'white', fontWeight: 'bold' }}>Select Profile Picture</Text>
            </TouchableOpacity>

            <Text>Cover Picture</Text>
            <Image
                source={{ uri: userData.cover_pic || 'https://via.placeholder.com/200' }}
                style={styles.coverPic}
            />
            <TouchableOpacity onPress={() => pickImage(true)} style={styles.imagePicker}>
                <Text style={{ color: 'white', fontWeight: 'bold' }}>Select Cover Picture</Text>
            </TouchableOpacity>

            <TextInput
                placeholder="Name"
                value={userData.name}
                onChangeText={(text) => setUserData({ ...userData, name: text })}
                style={styles.input}
            />
            <TextInput
                placeholder="Bio"
                value={userData.bio}
                onChangeText={(text) => setUserData({ ...userData, bio: text })}
                style={styles.input}
            />
            <TextInput
                placeholder="Location"
                value={userData.location}
                onChangeText={(text) => setUserData({ ...userData, location: text })}
                style={styles.input}
            />
            <TextInput
                placeholder="Work"
                value={userData.work}
                onChangeText={(text) => setUserData({ ...userData, work: text })}
                style={styles.input}
            />
            <TextInput
                placeholder="Study"
                value={userData.study}
                onChangeText={(text) => setUserData({ ...userData, study: text })}
                style={styles.input}
            />
            <TextInput
                placeholder="Date of Birth (YYYY-MM-DD)"
                value={userData.date_of_birth}
                onChangeText={(text) => setUserData({ ...userData, date_of_birth: text })}
                style={styles.input}
            />

            <Text>Relationship Status</Text>
            <Picker
                selectedValue={userData.relationship_status}
                onValueChange={(itemValue) => setUserData({ ...userData, relationship_status: itemValue })}
                style={styles.picker}
            >
                {RELATIONSHIP_STATUS_CHOICES.map((choice) => (
                    <Picker.Item key={choice.value} label={choice.label} value={choice.value} />
                ))}
            </Picker>

            <TouchableOpacity
                onPress={handleUpdateProfile}
                disabled={updating}
                style={{
                    opacity: updating ? 0.5 : 1,
                    padding: 15,
                    backgroundColor: 'black',
                    borderRadius: 99,
                    margin:'15%'
                }}
            >
                {updating ? (
                    <ActivityIndicator size="small" color="#fff" />
                ) : (
                    <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>Update Profile</Text>
                )}
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        flex: 1,
        backgroundColor: '#fff',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 15,
        borderRadius: 5,
    },
    profilePic: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 10,
    },
    coverPic: {
        width: '100%',
        height: 200,
        marginBottom: 10,
    },
    imagePicker: {
        backgroundColor: 'black',
        padding: 10,
        borderRadius: 5,
        marginBottom: 20,
        alignItems: 'center',
    },
    picker: {
        height: 50,
        width: '100%',
        marginBottom: 20,
    },
    error: {
        color: 'red',
        marginBottom: 10,
    },
});

export default EditProfile;
