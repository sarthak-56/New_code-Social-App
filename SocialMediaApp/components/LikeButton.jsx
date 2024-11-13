import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, FlatList } from 'react-native';
import { jwtDecode } from 'jwt-decode';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LikeButton = ({ postId, setLikedUsers }) => {
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [likedByUsers, setLikedByUsers] = useState([]);
    const [showLikedModal, setShowLikedModal] = useState(false);
    const [currentUserId, setCurrentUserId] = useState(null);

    useEffect(() => {
        const fetchLikeStatus = async () => {
            try {
                const token = await AsyncStorage.getItem('accessToken');
                if (!token) {
                    console.error('No token found');
                    return;
                }

                const decodedToken = jwtDecode(token);
                setCurrentUserId(decodedToken.user_id);

                const response = await fetch(`http://192.168.86.32:8000/api/user/posts/${postId}/like/`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setLikedByUsers(data);
                    setLikeCount(data.length);

                    const userLiked = data.some(like => like.user === decodedToken.user_id);
                    setLiked(userLiked);
                    setLikedUsers(prevState => ({
                        ...prevState,
                        [postId]: data,
                    }));
                } else {
                    console.error('Failed to fetch like status:', response.status);
                }
            } catch (error) {
                console.error('Error fetching like status:', error);
            }
        };

        fetchLikeStatus();
    }, [postId, setLikedUsers]);

    const handleLike = async () => {
        try {
            const token = await AsyncStorage.getItem('accessToken');
            if (!token) {
                console.error('No token found');
                return;
            }

            const response = await fetch(`http://192.168.86.32:8000/api/user/posts/${postId}/like/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                setLiked(true);
                setLikeCount(prevCount => prevCount + 1);
                setLikedUsers(prevState => ({
                    ...prevState,
                    [postId]: [...likedByUsers, { user: currentUserId }],
                }));
            } else {
                console.error('Failed to like post:', response.status);
            }
        } catch (error) {
            console.error('Error liking post:', error);
        }
    };

    const handleUnlike = async () => {
        try {
            const token = await AsyncStorage.getItem('accessToken');
            if (!token) {
                console.error('No token found');
                return;
            }

            const response = await fetch(`http://192.168.86.32:8000/api/user/posts/${postId}/like/`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                setLiked(false);
                setLikeCount(prevCount => prevCount - 1);
                setLikedUsers(prevState => ({
                    ...prevState,
                    [postId]: likedByUsers.filter(user => user.user !== currentUserId),
                }));
            } else {
                console.error('Failed to unlike post:', response.status);
            }
        } catch (error) {
            console.error('Error unliking post:', error);
        }
    };

    const openLikedModal = () => {
        setShowLikedModal(true);
    };

    const closeLikedModal = () => {
        setShowLikedModal(false);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={openLikedModal} style={styles.likeCount}>
                <Text style={styles.likeCountText}>{likeCount} likes</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={liked ? handleUnlike : handleLike} style={styles.likeButton}>
                <MaterialIcons name="thumb-up" size={24} color={liked ? 'black' : 'gray'} />
            </TouchableOpacity>

            <Modal visible={showLikedModal} transparent={true} animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <TouchableOpacity onPress={closeLikedModal} style={styles.closeButton}>
                            <Text style={styles.closeButtonText}>×</Text>
                        </TouchableOpacity>
                        <Text style={styles.modalTitle}>Likes</Text>
                        <FlatList
                            data={likedByUsers}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) => (
                                <Text style={styles.likedUser}>
                                    {item.email ? item.email : "Unknown User"}
                                </Text>
                            )}
                            ListEmptyComponent={<Text style={styles.emptyMessage}>No likes yet!</Text>}
                        />
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    likeCount: {
        marginLeft: 5,
        marginRight: 10,
    },
    likeCountText: {
        color: 'rgb(2, 117, 142)',
        fontWeight: 'bold',
    },
    likeButton: {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
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
    },
    closeButton: {
        alignSelf: 'flex-end',
    },
    closeButtonText: {
        fontSize: 24,
        color: 'black',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    likedUser: {
        color: '#000',
        fontSize: 16,
    },
    emptyMessage: {
        color: 'gray',
        textAlign: 'center',
        marginVertical: 20,
    },
});

export default LikeButton;
