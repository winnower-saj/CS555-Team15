import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PageHeading from './components/PageHeading';
import { Colors } from '../constants/Colors';
import MediumButton from './components/MediumButton';
import { updateUserProfile } from '../services/dbService';
import { useAuth } from '../context/authContext';

const InfoFields = ({ isEditable, field, fieldValue, handleChangeText }) => {
    return (
        <View style={styles.userInfo}>
            <Text style={styles.inputLabel}>{field}</Text>
            {isEditable ? (
                <TextInput style={styles.input} value={fieldValue} onChangeText={handleChangeText} />
            ) : (
                <Text style={[styles.input, styles.inputValue]}>{fieldValue}</Text>
            )}
        </View>
    );
};

const MyProfile = ({ navigation }) => {
    const { user, setUser } = useAuth();
    const [firstName, setFirstName] = useState(user.firstName);
    const [lastName, setLastName] = useState(user.lastName);
    const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber);
    const [isEditable, setIsEditable] = useState(false);

    // Sync the date with user context whenever user data changes
    useEffect(() => {
        setFirstName(user.firstName);
        setLastName(user.lastName);
        setPhoneNumber(user.phoneNumber);
    }, [user]);

    const handleEditClick = () => {
        if (isEditable) {
            setFirstName(user.firstName);
            setLastName(user.lastName);
            setPhoneNumber(user.phoneNumber);
        }

        setIsEditable(!isEditable);
    };

    const handleUpdateProfile = async () => {
        try {
            if (firstName !== user.firstName || lastName !== user.lastName || phoneNumber !== user.phoneNumber) {
                const response = await updateUserProfile({
                    userId: user.userId,
                    firstName: firstName,
                    lastName: lastName,
                    phoneNumber: phoneNumber
                });

                if (response.status === 200) {
                    // Update user date in context and local storage
                    setUser((previousUser) => ({
                        ...previousUser,
                        firstName,
                        lastName,
                        phoneNumber
                    }));

                    Alert.alert('Profile Updated', '\nSuccessfully!');
                }
            }

        } catch (error) {
            Alert.alert('⚠️ Profile Update Error',
                'An unexpected error occured while updating the profile.',
                [
                    {
                        text: 'Close',
                        onPress: () => console.log('Profile Update Error: Alert Closed'),
                    }
                ]
            );

            console.error('Profile Update Error:', error.response?.data || error.message);
        }
        setIsEditable(false);
    };

    return (
        <View style={styles.container}>
            <PageHeading title='Profile' handlePress={() => navigation.navigate('profile')} />

            <Image source={require('../assets/images/user.png')} style={styles.profileImage} />

            <TouchableOpacity style={styles.editButton} onPress={handleEditClick}>
                <Text style={styles.editText}>{isEditable ? 'Cancel' : 'Edit'}</Text>
                {isEditable ?
                    <Ionicons name='close-outline' size={30} color='#ffffff' /> :
                    <Ionicons name='pencil' size={20} color='#ffffff' />}
            </TouchableOpacity>

            <View style={styles.userContainer}>
                <InfoFields isEditable={isEditable} field='First Name' fieldValue={firstName} handleChangeText={setFirstName} />
                <InfoFields isEditable={isEditable} field='Last Name' fieldValue={lastName} handleChangeText={setLastName} />
                <InfoFields isEditable={isEditable} field='Phone Number' fieldValue={phoneNumber} handleChangeText={setPhoneNumber} />
            </View>

            <View style={styles.updateButton}>
                {isEditable && <MediumButton btnTitle='Update Profile' handlePress={handleUpdateProfile} />}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#ffffff',
        paddingVertical: '5%',
    },
    profileImage: {
        width: 120,
        height: 120,
        alignSelf: 'center',
    },
    editButton: {
        width: 120,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'flex-end',
        backgroundColor: Colors.blue.dark,
        borderRadius: 10,
        padding: '1%',
        marginBottom: '5%',
        marginRight: '5%',
    },
    editText: {
        fontSize: 20,
        fontWeight: '600',
        color: '#ffffff',
        marginRight: '5%',
    },
    userContainer: {
        paddingHorizontal: '5%',
    },
    userInfo: {
        width: '100%',
        alignSelf: 'flex-start',
        marginBottom: '4%',
    },
    inputLabel: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: '2%',
    },
    input: {
        width: '100%',
        height: 65,
        fontSize: 20,
        fontWeight: '600',
        borderColor: Colors.blue.primary,
        borderWidth: 3,
        borderRadius: 10,
        paddingHorizontal: '5%',
    },
    inputValue: {
        paddingVertical: '5%',
    },
    updateButton: {
        alignItems: 'center',
        marginTop: '10%',
    },
});

export default MyProfile;