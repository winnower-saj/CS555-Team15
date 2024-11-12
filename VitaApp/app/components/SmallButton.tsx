import React from 'react';
import { View, StyleSheet, TouchableNativeFeedback } from 'react-native';
import { Button } from 'react-native-elements';
import { Colors } from '../../constants/Colors';

const SmallButton = ({ btnTitle, btnBackgroundColor = Colors.blue.primary, btnTextColor = '#000000', handlePress }) => {
    return (
        <TouchableNativeFeedback
            background={TouchableNativeFeedback.SelectableBackground()}>
            <View style={styles.buttonWrapper}>
                <Button
                    title={btnTitle} buttonStyle={[styles.button, { backgroundColor: btnBackgroundColor }]}
                    titleStyle={[styles.buttonText, { color: btnTextColor }]}
                    onPress={handlePress}>
                </Button>
            </View>
        </TouchableNativeFeedback>
    );
};

const styles = StyleSheet.create({
    buttonWrapper: {
        overflow: 'hidden',
        borderRadius: 50,
        backgroundColor: Colors.blue.primary,
    },
    button: {
        borderRadius: 50,
        paddingTop: '3%',
        paddingBottom: '3%',
        width: 160,
    },
    buttonText: {
        fontWeight: 'bold',
        fontSize: 25,
    },
});

export default SmallButton;
