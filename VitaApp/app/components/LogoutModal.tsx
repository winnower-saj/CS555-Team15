import React from 'react';
import { View, Text, Modal, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';

const LogoutModal = ({ showLogoutModal, handleCancel, handleLogout }) => {
    return (
        <Modal
            animationType='slide'
            transparent={true}
            visible={showLogoutModal}
            onRequestClose={handleCancel}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle} testID='logout-heading'>Logout</Text>
                    <Text style={styles.modalConfirmationText}>Are you sure you want to logout?</Text>
                    <View style={styles.buttonContainer}>
                        <Button title='Cancel' buttonStyle={styles.button} titleStyle={styles.buttonText} onPress={handleCancel} />
                        <Button title='Logout' buttonStyle={styles.button} titleStyle={styles.buttonText} onPress={handleLogout} />
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
        width: '100%',
        height: '30%',
        padding: 20,
        backgroundColor: 'white',
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        alignItems: 'center'
    },
    modalTitle: {
        fontSize: 32,
        fontWeight: '600',
        marginBottom: 20,
        color: '#0077B6'
    },
    modalConfirmationText: {
        fontSize: 18,
        fontWeight: '600'
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginTop: 40
    },
    button: {
        backgroundColor: '#0077B6',
        width: 140,
        height: 60,
        borderRadius: 50
    },
    buttonText: {
        fontWeight: '600',
        fontSize: 18
    }
});

export default LogoutModal;