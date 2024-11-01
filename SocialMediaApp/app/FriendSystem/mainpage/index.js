// app/FriendSystem/mainpage/index.js
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { useEffect } from 'react';
import { useNavigation } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ProfileScreen from './ProfileScreen'; 
import CreatePostScreen from './CreatePostScreen'; 
import FriendRequestScreen from './FriendRequestScreen'; 
import SearchScreen from './SearchScreen'; 
import ProfileEditScreen from './ProfileEditScreen'; 
import UserOwnPostScreen from './UserOwnPostScreen'; 
import UserFriendListScreen from './UserFriendListScreen'; 
import UserSavedPostScreen from './UserSavedPostScreen'; 
import ExploreScreen from './ExploreScreen'

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

// Stack Navigator for Profile
const ProfileStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

// Stack Navigator for Create Post
const CreatePostStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="CreatePost" component={CreatePostScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

// Stack Navigator for Friend Requests
const FriendRequestStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="FriendRequest" component={FriendRequestScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

// Stack Navigator for Search
const SearchStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Search" component={SearchScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

const ExploreStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Explore" component={ExploreScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};



const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: 'black', // Change the active tab color
        tabBarInactiveTintColor: 'gray',  // Change the inactive tab color
        tabBarStyle: {
          backgroundColor: '#ffffff', // Set a background color for the tab bar
          borderTopColor: '#eeeeee',   // Set a border color for the top of the tab bar
          borderTopWidth: 1,           // Set the border width for the tab bar
          paddingBottom: 10,           // Add padding at the bottom of the tab bar
          height: 60,                  // Set the height of the tab bar
        },
        tabBarLabelStyle: {
          fontSize: 10,                // Set the font size for tab labels
          marginBottom: -1,             // Add margin to the bottom of labels
        },
        headerShown: false, 
      }}
    >
      <Tab.Screen 
        name="ProfileStack" 
        component={ProfileStack} 
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => <Ionicons name="person" size={24} color={color} />,
        }} 
      />
      <Tab.Screen 
        name="CreatePostStack" 
        component={CreatePostStack} 
        options={{
          tabBarLabel: 'Create Post',
          tabBarIcon: ({ color }) => <Ionicons name="create" size={24} color={color} />,
        }} 
      />
      <Tab.Screen 
        name="FriendRequestStack" 
        component={FriendRequestStack} 
        options={{
          tabBarLabel: 'Requests',
          tabBarIcon: ({ color }) => <Ionicons name="people" size={24} color={color} />,
        }} 
      />
      <Tab.Screen 
        name="SearchStack" 
        component={SearchStack} 
        options={{
          tabBarLabel: 'Search',
          tabBarIcon: ({ color }) => <Ionicons name="search" size={24} color={color} />,
        }} 
      />
      <Tab.Screen 
        name="ExploreStack" 
        component={ExploreStack} 
        options={{
          tabBarLabel: 'Explore',
          tabBarIcon: ({ color }) => <Ionicons name="compass" size={24} color={color} />,
        }} 
      />

    </Tab.Navigator>
  );
};

export default function Index() {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerShown: false 
    });
  }, [navigation]);

  return (
    <Drawer.Navigator
      initialRouteName="FriendSystem" 
      screenOptions={{
        drawerActiveTintColor: 'black',
        drawerInactiveTintColor: 'gray',
      }}
    >
      <Drawer.Screen 
        name="TabNavigator" 
        component={TabNavigator} 
        options={{ 
          title: 'Friend System'
        }} 
      />
      <Drawer.Screen 
        name="Edit profile" 
        component={ProfileEditScreen} 
        options={{
          drawerIcon: ({ color }) => <Ionicons name="person" size={24} color={color} />,
        }} 
      />
      <Drawer.Screen 
        name="Your post" 
        component={UserOwnPostScreen} 
        options={{
          drawerIcon: ({ color }) => <Ionicons name="document-text" size={24} color={color} />,
        }} 
      />
      <Drawer.Screen 
        name="Your friendList" 
        component={UserFriendListScreen} 
        options={{
          drawerIcon: ({ color }) => <Ionicons name="people" size={24} color={color} />,
        }} 
      />
      <Drawer.Screen 
        name="Your savedpost" 
        component={UserSavedPostScreen} 
        options={{
          drawerIcon: ({ color }) => <Ionicons name="bookmark" size={24} color={color} />,
        }} 
      />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  tabContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
