import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './User.module.css';
import LikeButton from '../LikeButton/LikeButton';
import CommentForm from '../Comments/CommentForm';
import ShareButton from '../Share/ShareButton';
import SaveButton from '../Save/SaveButton';
import ImageModal from '../FeedPage/ImageModal'; // Import ImageModal for full image view

const UserPostsPage = () => {
    const [userPosts, setUserPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [likedUsers, setLikedUsers] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false); // State for image modal
    const [currentImage, setCurrentImage] = useState(''); // State for current image URL

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://127.0.0.1:8000/api/user/userposts/', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                setUserPosts(response.data || []);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching user posts:', error);
                setError(error);
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    if (loading) {
        return <div className={styles.loading}>Loading user posts...</div>;
    }

    if (error) {
        return <div className={styles.error}>Error: {error.message}</div>;
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

    return (
        <div className={styles.feed}>
            {userPosts.length > 0 ? (
                userPosts.map((post) =>
                    post.content ? (
                        <div key={post.id} className={styles.post}>
                             <h2 className={styles['user-name']}>{post.user}</h2>
                            {post.image && (
                                <img
                                    src={`http://127.0.0.1:8000${post.image}`}
                                    alt="Post"
                                    className={styles['post-image']}
                                    onClick={() => openModal(`http://127.0.0.1:8000${post.image}`)} // Open modal on image click
                                />
                            )}
                   <p className={styles['post-content']}>{post.user}: {post.content}</p>
                            <div className={styles['button-container']}>
                                <div className={styles['button-group-left']}>
                                    <LikeButton postId={post.id} setLikedUsers={setLikedUsers} />
                                    <CommentForm postId={post.id} />
                                    <ShareButton postId={post.id} />
                                </div>
                                <div className={styles['button-group-right']}>
                                    <SaveButton postId={post.id} />
                                </div>
                            </div>
                            {likedUsers[post.id] && Array.isArray(likedUsers[post.id]) && likedUsers[post.id].length > 0 && (
                                <h1>
                                    Liked by {likedUsers[post.id].slice(0, 3).map((user, index) => (
                                        <span key={index} style={{ color: '#075ca1', fontWeight: 'bolder', fontSize: 'larger' }}>
                                            {user.email}{index < 2 ? ', ' : ''}
                                        </span>
                                    ))}
                                    {likedUsers[post.id].length > 3 && <span> and others</span>}
                                </h1>
                            )}
                            {post.created_at && <p className={styles.timestamp}>{formatDate(post.created_at)}</p>}
                        </div>
                    ) : null
                )
            ) : (
                <div className={styles['no-posts']}>No posts to display</div>
            )}
            {/* Modal for full image display */}
            <ImageModal isOpen={isModalOpen} imageUrl={currentImage} onClose={closeModal} />
        </div>
    );
};

export default UserPostsPage;
