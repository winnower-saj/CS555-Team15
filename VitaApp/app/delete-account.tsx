import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, Image, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { getUserSession } from '../services/authService';
import { deleteUser } from '../services/dbService';
import { useAuth } from '../context/authContext';
import DeleteAccountModal from './components/DeleteAccountModal';
import AccountDeletedModal from './components/AccountDeletedModal';
import PageHeading from './components/PageHeading';

const DeleteAccount = ({ navigation, route }) => {
    const router = useRouter();
    const { user } = route.params;
    const { logout } = useAuth();
    const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
    const [showAccountDeletedModal, setShowAccountDeletedModal] = useState(false);

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

        router.replace('/signup');
    }

    const handleDeleteAccount = async () => {
        const userSession = await getUserSession();

        try {
            if (userSession?.refreshToken) {
                await deleteUser(user.userId, userSession.refreshToken);
            }

            // Show the AccountDeletedModal
            setShowAccountDeletedModal(true);

        } catch (error) {
            Alert.alert(
                '⚠️ Account Delete Error',
                '\nFailed to delete the account. Please try again.',
                [
                    {
                        text: 'Close',
                        onPress: () => console.log('Account Delete Error: Alert Closed'),
                    },
                ]
            );

            console.error(
                'Account Delete Error:',
                error.response?.data || error.message
            );
        }

        // Hide the DeleteAccountModal
        setShowDeleteAccountModal(false);
    };

    return (
        <View style={styles.conatiner}>
            <PageHeading title='Delete Account' handlePress={() => navigation.navigate('settings')} />

            <View style={styles.userContainer}>
                <Image source={require('../assets/images/user.png')} style={styles.profileImage} />
                <Text style={styles.userName}>{`${user.firstName} ${user.lastName}`}</Text>
            </View>

            <View style={styles.deleteInfoContainer}>
                <Text style={styles.deleteInfoTitle}>Things to check when deleting your account:</Text>
                <FlatList
                    data={[
                        { key: 'Deleting your account is permanent.' },
                        { key: 'You will not be able to recover any data associated with it.' },
                        { key: 'You will no longer have access to any features, services, or data linked to this account.' },
                        { key: 'Any personalized voice profiles or\nsettings will be permanently deleted.' }
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

            <TouchableOpacity onPress={handleLDeleteAccountPress}>
                <Text style={styles.deleteAccount}>Delete My Account</Text>
            </TouchableOpacity>

            <DeleteAccountModal showDeleteAccountModal={showDeleteAccountModal} handleCancel={handleCancel} handleDeleteAccount={handleDeleteAccount} />
            <AccountDeletedModal showAccountDeletedModal={showAccountDeletedModal} handleClose={handleClose} />
        </View>
    );
};

const styles = StyleSheet.create({
    conatiner: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        paddingVertical: '5%',
    },
    userContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileImage: {
        width: 120,
        height: 120,
        marginBottom: '3%',
    },
    userName: {
        fontSize: 32,
        fontWeight: '600',
        color: '#000000',
    },
    deleteInfoContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: '5%',
        marginTop: '10%',
    },
    deleteInfoTitle: {
        fontSize: 16,
        fontWeight: '600',
        alignSelf: 'flex-start',
        marginBottom: '3%',
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: '2%',
        paddingLeft: '5%',
    },
    listItemBullet: {
        fontSize: 16,
        marginRight: '3%',
    },
    listItemText: {
        fontSize: 16,
    },
    deleteAccount: {
        fontSize: 20,
        fontWeight: '600',
        color: '#ff0000',
        marginBottom: '15%',
    },
});

export default DeleteAccount;