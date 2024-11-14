import React from 'react';
import { View, Text, Modal, StyleSheet } from 'react-native';
import SmallButton from './SmallButton';
import { Colors } from '../../constants/Colors';

const DeleteAccountModal = ({ showDeleteAccountModal, handleCancel, handleDeleteAccount }) => {
    return (
        <Modal
            animationType='slide'
            transparent={true}
            visible={showDeleteAccountModal}
            onRequestClose={handleCancel}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalWarning}>Warning</Text>
                    <Text style={styles.modalTitle} >Delete your account?</Text>
                    <Text style={styles.modalConfirmationText}>By deleting your account you will lose all your data. This action cannot be undone.</Text>
                    <View style={styles.buttonContainer}>
                        <SmallButton btnTitle='Cancel' btnTextColor='#ffffff' handlePress={handleCancel}/>
                        <SmallButton btnTitle='Delete' btnTextColor='#ffffff' handlePress={handleDeleteAccount}/>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 119, 182, 0.3)',
    },
    modalContent: {
        width: '100%',
        height: '40%',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        paddingHorizontal: '5%',
    },
    modalWarning: {
        width: 120,
        textAlign: 'center',
        fontSize: 20,
        fontWeight: '600',
        color: '#ffffff',
        backgroundColor: '#ff0000',
        borderRadius: 50,
        paddingVertical: '1%',
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: '600',
        color: Colors.blue.primary,
    },
    modalConfirmationText: {
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '600',
        lineHeight: 25,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
    },
});

export default DeleteAccountModal;