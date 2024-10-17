import React from 'react';
import styles from './ImageModal.module.css';

const ImageModal = ({ isOpen, imageUrl, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <span className={styles.close} onClick={onClose}>&times;</span>
                <img src={imageUrl} alt="Full Post" className={styles.fullImage} />
            </div>
        </div>
    );
};

export default ImageModal;
