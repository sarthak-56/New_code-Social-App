import React from 'react';
import { Modal, View, Image, TouchableOpacity, StyleSheet } from 'react-native';

const ImageModal = ({ isOpen, imageUrl, onClose }) => {
    return (
        <Modal
            visible={isOpen}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <TouchableOpacity style={styles.overlay} onPress={onClose}>
                    <Image
                        source={{ uri: imageUrl }}
                        style={styles.modalImage}
                        resizeMode="contain"
                    />
                </TouchableOpacity>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.8)', // Semi-transparent background
        justifyContent: 'center',
        alignItems: 'center',
    },
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalImage: {
        width: '100%',
        height: '100%',
        maxHeight: '80%', // Limit the height to avoid overflow
        maxWidth: '80%',  // Limit the width to avoid overflow
    },
});

export default ImageModal;
