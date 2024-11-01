import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './FriendList.module.css';
import { Link } from 'react-router-dom';

const FriendList = () => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const fetchFriends = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://127.0.0.1:8000/api/user/friends/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFriends(response.data);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          setError('Unauthorized. Please login again.');
        } else {
          setError('Error fetching friends');
        }
      }
      setLoading(false);
    };
    fetchFriends();
  }, []);

  const openModal = (friend, event) => {
    setSelectedFriend(friend);
  };

  const closeModal = () => {
    setSelectedFriend(null);
    setModalPosition({ top: 0, left: 0 });
  };

  const unfriend = async (friendId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://127.0.0.1:8000/api/user/friends/${friendId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFriends((prevFriends) => prevFriends.filter((friend) => friend.id !== friendId));
      closeModal();
    } catch (error) {
      console.error('Error unfriending:', error);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles["section-title"]}>Your Friends</h2>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <h2 className={styles.num}>{friends.length} Friends</h2>
      <ul className={styles.friends}>
        {friends.map((friend) => (
          <li key={friend.id} className={styles.friendItem}>
            <div className={styles.friendInfo}>
              {friend.profile_pic ? (
                <img className={styles.profilePicture} src={`http://127.0.0.1:8000${friend.profile_pic}`} alt={friend.name} />
              ) : (
                <img className={styles.profilePicture} src="/profile.png" alt="Default Profile" />
              )}
              <Link className={styles.friendName}>{friend.name}</Link>
            </div>
            <div className={styles.view}>
              <h2 onClick={(event) => openModal(friend, event)}>View Profile</h2>
            </div>
          </li>
        ))}
      </ul>

      {selectedFriend && (
        <div className={styles.modal} style={{ top: modalPosition.top, left: modalPosition.left }}>
          <div className={styles["modal-content"]}>
            <span className={styles.close} onClick={closeModal}>&times;</span>
            <div className={styles["profile-header"]}>
              {selectedFriend.cover_pic ? (
                <img className={styles["cover-picture1"]} src={`http://127.0.0.1:8000${selectedFriend.cover_pic}`} alt={selectedFriend.name} />
              ) : (
                <img className={styles["cover-picture1"]} src="/cover.jpg" alt="Cover" />
              )}
            </div>
            <div className={styles["profile-details"]}>
              <h1>{selectedFriend.name}</h1>
              <button className={styles.opt} onClick={() => unfriend(selectedFriend.id)}>Unfriend</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FriendList;
