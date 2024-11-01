import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation, useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function index() {
    const navigation = useNavigation();
    const router = useRouter();


    useEffect(() => {
        navigation.setOptions({
            headerShown: false
        });
    }, []);


    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });



    // Function to handle changes in the input fields
    const handleChange = (name, value) => {
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleLogin = async () => {
        const { email, password } = formData; // Ensure formData has email and password


        try {
            const response = await axios.post('http://192.168.21.32:8000/api/user/login/', {
                email,
                password,
            });

            // console.log('Response:', response.data); // Log the entire response

            // Access the token from the response
            const accessToken = response.data.token.access; // Get the access token
            const refreshToken = response.data.token.refresh; // Get the refresh token

            // Save both tokens to AsyncStorage
            await AsyncStorage.setItem('accessToken', accessToken);
            await AsyncStorage.setItem('refreshToken', refreshToken);

            console.log('Access Token:', response.data.token.access); // Debugging log
            console.log('Refresh Token:', response.data.token.refresh);

            Alert.alert("Success", "Login successful!");
            router.push('FriendSystem/mainpage'); 
            
        } catch (error) {
            // Log the entire error object to see its structure
            console.error('Error:', error);

            // Provide a fallback message if error.response is undefined
            const errorMessage = error.response?.data?.msg || error.message || "Login failed. Please try again.";

            // Alert with the error message
            Alert.alert("Error", errorMessage);
        }
    };



    return (
        <ScrollView style={{ padding: 25, backgroundColor: 'white', height: '100%' }}>
            <View style={{ marginTop: 60 }}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back-circle" size={24} color="black" />
                </TouchableOpacity>

                <Text style={{ fontSize: 30, fontWeight: '500' }}>Let's Sign You In</Text>
                <Text style={{ fontSize: 30, fontWeight: '500', color: 'gray', marginTop: 20 }}>Welcome Back</Text>
                <Text style={{ fontSize: 30, fontWeight: '500', color: 'gray', marginTop: 20 }}>You've been missed</Text>

                <View style={{ marginTop: 50 }}>
                    <Text>Username</Text>
                    <TextInput
                        style={styles.input}
                        placeholder='Enter Username'
                        value={formData.email}
                        onChangeText={(text) => handleChange('email', text)} // Update username
                    />
                </View>

                <View style={{ marginTop: 30 }}>
                    <Text>Password</Text>
                    <TextInput
                        style={styles.input}
                        secureTextEntry={true}
                        placeholder='Enter Password'
                        value={formData.password}
                        onChangeText={(text) => handleChange('password', text)} // Update password
                    />
                </View>

                <TouchableOpacity
                    style={{ padding: 15, backgroundColor: "black", borderRadius: 99, marginTop: 40 }}
                    onPress={handleLogin} // Call the login function
                >
                    <Text style={{ color: 'white', textAlign: 'center', fontWeight: '600' }}>Sign In</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => router.replace('auth/signup')}
                    style={{ padding: 15, backgroundColor: "white", borderRadius: 99, marginTop: 40, borderWidth: 1 }}
                >
                    <Text style={{ color: 'black', textAlign: 'center', fontWeight: '600' }}>Create Account</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    input: {
        padding: 15,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: 'black',
    }
});
