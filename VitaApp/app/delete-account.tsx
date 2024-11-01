import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { View, Text, StyleSheet, Alert, Image, FlatList, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import { getUserSession } from '../services/authService';
import { deleteUser } from '../services/dbService';
import { useAuth } from '../context/authContext';
import ProtectedRoute from './components/ProtectedRoute';
import DeleteAccountModal from './components/DeleteAccountModal';
import AccountDeletedModal from './components/AccountDeletedModal';

const DeleteAccount = () => {
    const router = useRouter();
    const { logout } = useAuth();
    const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
    const [showAccountDeletedModal, setShowAccountDeletedModal] = useState(false);
    const [userData, setUserData] = useState({ firstName: '', lastName: '' });

    // Get the user data from session
    useEffect(() => {
        const loadUserData = async () => {
            const userSession = await getUserSession();
            if (userSession?.firstName && userSession?.lastName) {
                setUserData({ firstName: userSession.firstName, lastName: userSession.lastName });
            } else {
                Alert.alert('No active session found.');
            }
        };

        loadUserData();
    }, []);

    // Go to previous screen
    const handleBackPress = () => {
        router.back();
    };

    // Show the DeleteAccountModal
    const handleLDeleteAccountPress = () => {
        setShowDeleteAccountModal(true);
    };

    // Hide the DeleteAccountModal
    const handleCancel = () => {
        setShowDeleteAccountModal(false);
    };

    // Hide the AccountDeletedModal
    const handleClose = async () => {
        setShowAccountDeletedModal(false);

        // Clear local session
        await logout();

        // Redirect to signup page
        router.replace('/signup');
    }

    const handleDeleteAccount = async () => {
        // Retrive current user session
        const userSession = await getUserSession();

        if (userSession?.refreshToken) {
            try {
                // Delete the user account
                await deleteUser(userSession.userId, userSession.refreshToken);

                // Show the AccountDeletedModal
                setShowAccountDeletedModal(true);

            } catch (error) {
                Alert.alert(error.message || 'An unexpected error occured during deleting the account.');
                console.error('Account deletion error:', error);
            }
        } else {
            Alert.alert('No active session found.');
        }

        // Hide the DeleteAccountModal
        setShowDeleteAccountModal(false);
    };

    return (
        <ProtectedRoute>
            <View style={styles.conatiner}>
                <Text style={styles.title}>Delete Account</Text>
                <View style={styles.userContainer}>
                    <Image source={require('../assets/images/person.png')} style={styles.profileIcon} />
                    <Text style={styles.userName}>{`${userData.firstName} ${userData.lastName}`}</Text>
                </View>
                <View style={styles.deleteInfoContainer}>
                    <Text style={styles.deleteInfoTitle}>Things to check when deleting your account:</Text>
                    <FlatList
                        data={[
                            { key: 'Deleting your account is permanent.' },
                            { key: 'You will not be able to recover any data associated with it.' },
                            { key: 'You will no longer have access to any features, services, or data linked to this account.' },
                            { key: 'Any personalized voice profiles or settings will be permanently deleted.' }
                        ]}
                        renderItem={({ item }) => (
                            <View style={styles.listItem}>
                                <Text style={styles.listItemBullet}>{`\u2022`}</Text>
                                <Text style={styles.listItemText}>{`${item.key}`}</Text>
                            </View>
                        )}
                    >
                    </FlatList>
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={handleLDeleteAccountPress}>
                        <Text style={styles.deleteAccount}>Delete My Account</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={handleBackPress}>
                        <Icon name='chevron-left' type='material' color='#FFFFFF' size={40} />
                        <Text style={styles.buttonText}>Back</Text>
                    </TouchableOpacity>
                </View>

                <DeleteAccountModal showDeleteAccountModal={showDeleteAccountModal} handleCancel={handleCancel} handleDeleteAccount={handleDeleteAccount} />
                <AccountDeletedModal showAccountDeletedModal={showAccountDeletedModal} handleClose={handleClose} />
            </View>
        </ProtectedRoute>
    );
};

const styles = StyleSheet.create({
    conatiner: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 20
    },
    title: {
        fontSize: 32,
        paddingTop: 20,
        color: '#0077B6',
        fontWeight: '600'
    },
    userContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    profileIcon: {
        width: 150,
        height: 150,
        borderRadius: 100,
        backgroundColor: 'black'
    },
    userName: {
        fontSize: 32,
        marginTop: 10,
        fontWeight: '600'
    },
    deleteInfoContainer: {
        flex: 1.2,
        justifyContent: 'center',
        alignItems: 'center',
        width: '90%'
    },
    deleteInfoTitle: {
        alignSelf: 'flex-start',
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 10
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: 5,
        paddingLeft: 20
    },
    listItemBullet: {
        fontSize: 16,
        marginRight: 10
    },
    listItemText: {
        fontSize: 16
    },
    buttonContainer: {
        alignItems: 'center'
    },
    deleteAccount: {
        fontSize: 20,
        fontWeight: '600',
        color: '#FF0000',
        marginBottom: 50
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: '#0077B6',
        borderRadius: 50,
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 20,
        width: 250
    },
    buttonText: {
        fontWeight: '600',
        fontSize: 24,
        color: '#FFFFFF',
        marginLeft: 35
    }
});

export default DeleteAccount;