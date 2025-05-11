import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation, useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import CheckBox from 'expo-checkbox';
import axios from 'axios'; // Import axios

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
        name: '',
        password: '',
        password2: '',
        tc: false,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isChecked, setIsChecked] = useState(false); 

    const handleChange = (name, value) => {
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleRegister = async () => {
        const { email, name, password, password2, tc } = formData;

        if (password !== password2) {
            Alert.alert("Error", "Passwords do not match");
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.post('http://192.168.1.49:8000/api/user/register/', {
                email,
                name,
                password,
                password2,
                tc,
            });
            console.log(response.data);
            Alert.alert("Success", "Account created successfully");
            router.push('auth/signin'); 
        } catch (error) {
            console.error(error);
            Alert.alert("Error", error.response?.data?.detail || "Registration failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ScrollView style={{
            padding: 25,
            backgroundColor: 'white',
            height: '100%',
        }}>
            <View style={{
                marginTop: 60
            }}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back-circle" size={24} color="black" />
                </TouchableOpacity>
                <Text style={{
                    fontSize: 30,
                    fontWeight: '500',
                }}>Create Your Account</Text>

                <View style={{
                    marginTop: 50
                }}>
                    <Text>Email</Text>
                    <TextInput
                        style={styles.input}
                        placeholder='Enter Email'
                        value={formData.email}
                        onChangeText={(value) => handleChange('email', value)}
                    />
                </View>

                <View style={{
                    marginTop: 30
                }}>
                    <Text>Name</Text>
                    <TextInput
                        style={styles.input}
                        placeholder='Enter Your Name'
                        value={formData.name}
                        onChangeText={(value) => handleChange('name', value)}
                    />
                </View>

                <View style={{
                    marginTop: 30
                }}>
                    <Text>Password</Text>
                    <TextInput
                        style={styles.input}
                        secureTextEntry={true}
                        placeholder='Enter Password'
                        value={formData.password}
                        onChangeText={(value) => handleChange('password', value)}
                    />
                </View>

                <View style={{
                    marginTop: 30
                }}>
                    <Text>Confirm Password</Text>
                    <TextInput
                        style={styles.input}
                        secureTextEntry={true}
                        placeholder='Confirm Your Password'
                        value={formData.password2}
                        onChangeText={(value) => handleChange('password2', value)}
                    />
                </View>

                {/* Checkbox for Terms and Conditions */}
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 30
                }}>
                    <CheckBox
                        value={isChecked}
                        onValueChange={(newValue) => {
                            setIsChecked(newValue);
                            handleChange('tc', newValue);
                        }}
                    />
                    <Text style={{ marginLeft: 10 }}>
                        I agree to the terms and conditions
                    </Text>
                </View>

                <TouchableOpacity style={{
                    padding: 15,
                    backgroundColor: "black",
                    borderRadius: 99,
                    marginTop: 40
                }} onPress={handleRegister}>
                    <Text style={{
                        color: 'white',
                        textAlign: 'center',
                        fontWeight: '600'
                    }}>Sign Up</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.replace('auth/signin')} style={{
                    padding: 15,
                    backgroundColor: "white",
                    borderRadius: 99,
                    marginTop: 40,
                    borderWidth: 1
                }}>
                    <Text style={{
                        color: 'black',
                        textAlign: 'center',
                        fontWeight: '600'
                    }}>Go to Sign In</Text>
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
