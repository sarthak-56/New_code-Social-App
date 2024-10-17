// src/components/ShareButton.js
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShare } from '@fortawesome/free-solid-svg-icons';

const ShareButton = ({ postId }) => {
  const handleShare = async () => {
    try {
    
      const response = await fetch(`http://127.0.0.1:8000/api/user/posts/${postId}/share/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();

        const message = encodeURIComponent(data.message);
        const url = encodeURIComponent(data.url);
        const whatsappUrl = `https://wa.me/?text=${message} ${url}`;

        // Open the WhatsApp share dialog
        window.open(whatsappUrl, '_blank');
      } else {
        alert('Error sharing post.');
      }
    } catch (error) {
      console.error('Error sharing post:', error);
    }
  };

  return (
    <div>
      <button onClick={handleShare}>
        <FontAwesomeIcon icon={faShare} style={{ color: 'rgb(2, 117, 142)' }} size="2x" />
      </button>
    </div>
  );
};

export default ShareButton;
