import React, { useState, useEffect } from 'react';
import styles from './SavedPost.module.css';
import LikeButton from '../LikeButton/LikeButton';
import CommentForm from '../Comments/CommentForm';
import ShareButton from '../Share/ShareButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark } from '@fortawesome/free-solid-svg-icons';
import ImageModal from '../FeedPage/ImageModal'; 

const SavedPost = () => {
    const [savedPosts, setSavedPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentImage, setCurrentImage] = useState('');

    useEffect(() => {
        const fetchSavedPosts = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/api/user/saved-posts/', {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                const data = await response.json();
                setSavedPosts(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching saved posts:', error);
                setError(error);
                setLoading(false);
            }
        };

        fetchSavedPosts();
    }, []);

    const handleRemovePost = async (postId) => {
        try {
            await fetch(`http://127.0.0.1:8000/api/user/posts/${postId}/save/`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setSavedPosts((prevPosts) => prevPosts.filter(post => post.id !== postId));
        } catch (error) {
            console.error('Error unsaving post:', error);
        }
    };

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

    if (loading) {
        return <div className={styles.loading}>Loading saved posts...</div>;
    }

    if (error) {
        return <div className={styles.error}>Error: {error.message}</div>;
    }

    return (
        <div className={styles.feed}>
            {savedPosts.length > 0 ? (
                savedPosts.map(post => (
                    post.content && (
                        <div key={post.id} className={styles.post}>
                            <h2 className={styles['user-name']}>{post.user}</h2>
                            {post.image && (
                                <img
                                    src={`http://127.0.0.1:8000${post.image}`}
                                    alt="Post"
                                    className={styles['post-image']}
                                    onClick={() => openModal(`http://127.0.0.1:8000${post.image}`)} // Open modal on click
                                />
                            )}
                            <p className={styles['post-content']}>{post.user}{post.content}</p>
                            <div className={styles['button-container']}>
                                <div className={styles['button-group-left']}>
                                    <LikeButton postId={post.id} />
                                    <CommentForm postId={post.id} />
                                    <ShareButton postId={post.id} />
                                </div>
                                <div className={styles['button-group-right']}>
                                    <button onClick={() => handleRemovePost(post.id)} className={styles['remove-button']}>
                                        <FontAwesomeIcon icon={faBookmark} style={{ color: 'rgb(2, 117, 142)' }} size="2x" />
                                    </button>
                                </div>
                            </div>
                            {post.created_at && <p className={styles.timestamp}>{formatDate(post.created_at)}</p>}
                        </div>
                    )
                ))
            ) : (
                <div className={styles['no-posts']}>No saved posts to display</div>
            )}

         <ImageModal isOpen={isModalOpen} imageUrl={currentImage} onClose={closeModal} />
        </div>
    );
};

export default SavedPost;
