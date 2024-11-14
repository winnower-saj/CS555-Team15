// screens/PasswordManager.tsx

import React, { useEffect,useState } from 'react';
import {  View, Text, TextInput, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { getUserSession } from '../services/authService';
import { updatePassword } from '../services/dbService';


//const navigation = useNavigation();
const PasswordManager= ({ navigation }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(true);
    

    const changePassword = async () => {
        if (newPassword !== confirmPassword) {
            Alert.alert('Error', 'New passwords do not match.');
            return;}
        try {
            const userSession = await getUserSession();
            const userId=userSession.userId
            //console.log(userSession.firstName)
            const response = await updatePassword(
                userId,
                currentPassword,
                newPassword,
			);

            if (response) {
                Alert.alert('Success', response);
            }
        } catch (e) {
            if (e.response && e.response.data && e.response.data.message) {
                Alert.alert('Error', e.response.data.message); // Backend error message
            } else {
                Alert.alert('Error', 'Failed to update password.'); // General error
            }
        }
    }; 
    return (
        <View style={styles.container}>
            <View style={styles.header}>
					  <Text style={styles.headerTitle}>Password Manager</Text>
				  </View>
                <View>
                    <Text style={styles.label}>Current Password</Text>
                    <TextInput style={styles.inputContainer}
                        secureTextEntry={showPassword}
                        value={currentPassword}
                        onChangeText={setCurrentPassword}
                    />
                </View>
                    <Text style={styles.label}>New Password</Text>
                    <TextInput style={styles.inputContainer}
                        secureTextEntry={showPassword}
                        value={newPassword}
                        onChangeText={setNewPassword}
                    />                 
                <View>
                    <Text style={styles.label}>Confirm New Password</Text>
                    <TextInput style={styles.inputContainer}
                        secureTextEntry={showPassword}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                    />                    
                </View>
                <View>
                <TouchableOpacity style={styles.updateButton} onPress={changePassword}>
                    <Text style={styles.UpdateText}>Update Password</Text>
                </TouchableOpacity>
                </View>
                <View>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('settings')}>
                    <Text style={styles.UpdateText}>Back</Text>
                </TouchableOpacity>
                </View>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    header: {
		position: 'relative',
		paddingVertical: 36,
		flexDirection: 'row',
		alignItems: 'center'
	},
	headerTitle: {
		flex: 1,
		color: '#0077B6',
		fontSize: 25,
		fontWeight: 'bold',
		textAlign: 'center',
	},
    input: {
        borderWidth: 1,
        marginBottom: 10,
        padding: 10,
    },
      label: {
        fontSize: 18,
        color: 'black',
      },
      inputContainer:{
        height: 50,
		borderColor: '#0077B6', // Custom border color
		borderWidth: 3,
		borderRadius: 10, // Rounded edges
		paddingHorizontal: 15,
		marginBottom: 15,
		fontSize: 16,
		backgroundColor: '#ffffff'
      },
      updateButton:{
        position: 'absolute',
        alignSelf: 'center',
        backgroundColor: '#0077B6',
        borderRadius: 50,
        width: '90%',
        height: 70,
        justifyContent: 'center',
        alignItems: 'center', 
        top: 30
    },
    UpdateText: {
        color: 'white',
        fontSize: 25,
      },
        backButton: {
            position: 'absolute',
            alignSelf: 'center',
            backgroundColor: '#0077B6',
            borderRadius: 50,
            width: '90%',
            height: 70,
            justifyContent: 'center',
            alignItems: 'center',
            top: 130
          },
          iconone: {
            position: 'absolute',
            right: 20, 
            top: 40
        },
        icontwo: {
            position: 'absolute',
            right:40,
            top:245 
        },
        iconthree: {
            position: 'absolute',
            right: 20,
            top:40 
        },
});

export default PasswordManager;
