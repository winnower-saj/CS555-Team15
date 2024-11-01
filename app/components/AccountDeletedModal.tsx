import React from 'react';
import { View, Text, Modal, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';

const AccountDeletedModal = ({ showAccountDeletedModal, handleClose }) => {
    return (
        <Modal
            animationType='slide'
            transparent={true}
            visible={showAccountDeletedModal}
            onRequestClose={handleClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalSuccess}>Success</Text>
                    <Text style={styles.modalTitle} >Successfully!</Text>
                    <Text style={styles.modalConfirmationText}>Your account has been successfully deleted. We're sorry to see you go.</Text>
                    <View style={styles.buttonContainer}>
                        <Button title='Close' buttonStyle={styles.button} titleStyle={styles.buttonText} onPress={handleClose} />
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
    modalSuccess: {
        backgroundColor: '#00FF00',
        borderRadius: 50,
        color: '#000000',
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
        width: '100%'
    },
    button: {
        backgroundColor: '#0077B6',
        width: '100%',
        height: 60,
        borderRadius: 50
    },
    buttonText: {
        fontWeight: '600',
        fontSize: 20
    }
});

export default AccountDeletedModal;