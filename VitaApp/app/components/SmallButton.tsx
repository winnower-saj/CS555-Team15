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
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 1,
        shadowRadius: 10,
        elevation: 15,
        backgroundColor: '#ffffff',
        borderRadius: 50,
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
