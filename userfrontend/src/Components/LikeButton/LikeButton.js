import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import styles from './Like.module.css';

const LikeButton = ({ postId, setLikedUsers }) => {
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [likedByUsers, setLikedByUsers] = useState([]);
    const [showLikedModal, setShowLikedModal] = useState(false);

    const token = localStorage.getItem('token');
    const decodedToken = token ? jwtDecode(token) : null;
    const currentUserId = decodedToken ? decodedToken.user_id : null; 

    useEffect(() => {
        const fetchLikeStatus = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/api/user/posts/${postId}/like/`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setLikedByUsers(data);
                    setLikeCount(data.length);

                    const userLiked = data.some(like => like.user === currentUserId);
                    setLiked(userLiked);
                    setLikedUsers(prevState => ({
                        ...prevState,
                        [postId]: data,
                    }));
                }
            } catch (error) {
                console.error('Error fetching like status:', error);
            }
        };

        fetchLikeStatus();
    }, [postId, currentUserId, token, setLikedUsers]);

    const handleLike = async () => {
        try {
            await fetch(`http://127.0.0.1:8000/api/user/posts/${postId}/like/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            setLiked(true);
            setLikeCount(likeCount + 1);
            setLikedUsers(prevState => ({
                ...prevState,
                [postId]: [...likedByUsers, { email: currentUserId }],
            }));
        } catch (error) {
            console.error('Error liking post:', error);
        }
    };

    const handleUnlike = async () => {
        try {
            await fetch(`http://127.0.0.1:8000/api/user/posts/${postId}/like/`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            setLiked(false);
            setLikeCount(likeCount - 1);
            setLikedUsers(prevState => ({
                ...prevState,
                [postId]: likedByUsers.filter(user => user.user !== currentUserId),
            }));
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
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ marginLeft: '5px', marginRight: '10px', color: 'rgb(2, 117, 142)', fontWeight: 'bold', cursor: 'pointer' }} onClick={openLikedModal}>
                {likeCount} likes
            </span>
            <button onClick={liked ? handleUnlike : handleLike} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <FontAwesomeIcon icon={faThumbsUp} style={{ color: liked ? 'rgb(2, 117, 142)' : 'rgb(109, 110, 110)' }} size="2x" />
            </button>

            {showLikedModal && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <span className={styles.close} onClick={closeLikedModal}>&times;</span>
                        <h2>Likes</h2>
                        <ul>
                            {likedByUsers.map((like, index) => (
                                <li key={index}>{like.email}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LikeButton;
