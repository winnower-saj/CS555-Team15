import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';

const PageHeading = ({ title, handlePress }) => {
    return (
        <View style={styles.header}>
            <TouchableOpacity
                onPress={handlePress}
                style={styles.backButton}>
                <Ionicons name='arrow-back' size={30} color={Colors.blue.primary} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{title}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: '5%',
        paddingVertical: '8%',
    },
    headerTitle: {
        flex: 1,
        fontSize: 32,
        fontWeight: '600',
        textAlign: 'center',
        color: Colors.blue.primary,
        paddingRight: '10%',
    },
    backButton: {
        backgroundColor: Colors.blue.light,
        borderRadius: 50,
        padding: '2%',
    },
});

export default PageHeading;