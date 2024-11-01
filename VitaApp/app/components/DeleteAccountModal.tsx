import React from 'react';
import { View, Text, Modal, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';

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
                        <Button title='Cancel' buttonStyle={styles.button} titleStyle={styles.buttonText} onPress={handleCancel} />
                        <Button title='Delete' buttonStyle={styles.button} titleStyle={styles.buttonText} onPress={handleDeleteAccount} />
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
        backgroundColor: 'rgba(0, 119, 182, 0.3)'
    },
    modalContent: {
        justifyContent: 'space-evenly',
        width: '100%',
        height: '40%',
        padding: 20,
        backgroundColor: 'white',
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        alignItems: 'center'
    },
    modalWarning: {
        backgroundColor: '#FF0000',
        borderRadius: 50,
        color: '#FFFFFF',
        width: 120,
        paddingTop: 5,
        paddingBottom: 5,
        textAlign: 'center',
        fontWeight: '600'
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: '600',
        color: '#0077B6'
    },
    modalConfirmationText: {
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center'
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%'
    },
    button: {
        backgroundColor: '#0077B6',
        width: 140,
        height: 60,
        borderRadius: 50
    },
    buttonText: {
        fontWeight: '600',
        fontSize: 20
    }
});

export default DeleteAccountModal;