import React from 'react';
import { View, Text, Modal, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import { Colors } from '../../constants/Colors';

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
        padding: '5%',
    },
    modalSuccess: {
        width: 120,
        textAlign: 'center',
        fontSize: 20,
        fontWeight: '600',
        color: '#000000',
        backgroundColor: '#00ff00',
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
        width: '100%',
    },
    button: {
        width: '80%',
        alignSelf: 'center',
        backgroundColor: Colors.blue.primary,
        borderRadius: 50,
        paddingVertical: '3%',
    },
    buttonText: {
        fontSize: 24,
        fontWeight: '600',
    },
});

export default AccountDeletedModal;