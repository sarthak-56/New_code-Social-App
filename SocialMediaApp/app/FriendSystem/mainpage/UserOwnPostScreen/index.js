import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, ActivityIndicator, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native';
import axios from 'axios';
import LikeButton from './../../../../components/LikeButton';
import CommentForm from './../../../../components/CommentForm';
import ShareButton from './../../../../components/ShareButton';
import SaveButton from './../../../../components/SaveButton';
import ImageModal from './../../../../components/ImageModal';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserOwnPostScreen = () => {
    const [userPosts, setUserPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [likedUsers, setLikedUsers] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentImage, setCurrentImage] = useState('');
    const [refreshing, setRefreshing] = useState(false); 

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('accessToken');
            const response = await axios.get('http://192.168.21.32:8000/api/user/userposts/', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            setUserPosts(response.data || []);
            setLoading(false);
            setRefreshing(false); 
        } catch (error) {
            console.error('Error fetching user posts:', error);
            setError(error);
            setLoading(false);
            setRefreshing(false); 
        }
    };

    const onRefresh = () => {
        setRefreshing(true); // Set refreshing state
        fetchPosts(); // Fetch posts again
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    if (error) {
        return <Text style={styles.error}>Error: {error.message}</Text>;
    }

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        const day = date.getDate();
        const month = date.toLocaleString('default', { month: 'long' });
        const year = date.getFullYear();
        return `${day} ${month} ${year}`;
    };

    const openModal = (imageUrl) => {
        setCurrentImage(imageUrl);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentImage('');
    };

    const renderPost = ({ item }) => (
        <View style={styles.post}>
            <Text style={styles.userName}>{item.user}</Text>
            {item.image && (
                <TouchableOpacity onPress={() => openModal(`http://192.168.21.32:8000${item.image}`)}>
                    <Image
                        source={{ uri: `http://192.168.21.32:8000${item.image}` }}
                        style={styles.postImage}
                    />
                </TouchableOpacity>
            )}
            <Text style={styles.postContent}>
                {item.user}: {item.content}
            </Text>

            <View style={styles.buttonContainer}>
                <LikeButton postId={item.id} setLikedUsers={setLikedUsers} />
                <CommentForm postId={item.id} />
                <ShareButton postId={item.id} />
                <SaveButton postId={item.id} />
            </View>
            {likedUsers[item.id] && Array.isArray(likedUsers[item.id]) && likedUsers[item.id].length > 0 && (
                <Text style={styles.likedBy}>
                    Liked by{' '}
                    {likedUsers[item.id].slice(0, 3).map((user, index) => (
                        <Text key={index} style={styles.likedUser}>
                            {user.email}{index < 2 ? ', ' : ''}
                        </Text>
                    ))}
                    {likedUsers[item.id].length > 3 && <Text> and others</Text>}
                </Text>
            )}
            {item.created_at && <Text style={styles.timestamp}>{formatDate(item.created_at)}</Text>}
        </View>
    );

    return (
        <FlatList
            data={userPosts}
            renderItem={renderPost}
            keyExtractor={post => post.id.toString()}
            contentContainerStyle={styles.feed}
            ListEmptyComponent={<Text style={styles.noPosts}>No posts to display</Text>}
            ListFooterComponent={<ImageModal isOpen={isModalOpen} imageUrl={currentImage} onClose={closeModal} />}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        />
    );
};

const styles = StyleSheet.create({
    feed: {
        padding: 15,
        backgroundColor: '#fff',
    },
    post: {
        marginBottom: 20,
        padding: 10,
        backgroundColor: '#f9f9f9',
        borderRadius: 5,
        elevation: 2,
    },
    userName: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    postImage: {
        width: '100%',
        height: 250,
        borderRadius: 5,
        marginVertical: 10,
    },
    postContent: {
        fontSize: 14,
        marginBottom: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    likedBy: {
        marginVertical: 5,
    },
    likedUser: {
        color: '#075ca1',
        fontWeight: 'bold',
        fontSize: 14,
    },
    timestamp: {
        color: '#777',
        fontSize: 12,
    },
    noPosts: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
        color: '#777',
    },
    error: {
        color: 'red',
        textAlign: 'center',
        marginTop: 20,
    },
});

export default UserOwnPostScreen;
