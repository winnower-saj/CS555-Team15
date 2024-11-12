import React from 'react';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import { Colors } from '../../constants/Colors'

const MediumButton = ({ btnTitle, btnBackgroundColor = Colors.blue.primary, marginTop = 0, handlePress }) => {
    return (
        <Button
            title={btnTitle}
            buttonStyle={[styles.button, { backgroundColor: btnBackgroundColor, marginTop: marginTop }]}
            titleStyle={styles.buttonText} 
            onPress={handlePress}>
        </Button>
    );
};

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        borderRadius: 50,
        paddingTop: '4%',
        paddingBottom: '4%',
        width: 260,
    },
    buttonText: {
        fontWeight: '600',
        fontSize: 25,
    },
});

export default MediumButton;
