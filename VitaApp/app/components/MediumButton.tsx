import React from 'react';
import { View, StyleSheet, TouchableNativeFeedback } from 'react-native';
import { Button } from 'react-native-elements';
import { Colors } from '../../constants/Colors'

const MediumButton = ({ btnTitle, btnBackgroundColor = Colors.blue.primary, marginTop = 0, handlePress }) => {
    return (
        <TouchableNativeFeedback
            background={TouchableNativeFeedback.SelectableBackground()}>
            <View style={[styles.buttonWrapper, { marginTop }]}>
                <Button
                    title={btnTitle}
                    buttonStyle={[styles.button, { backgroundColor: btnBackgroundColor }]}
                    titleStyle={styles.buttonText}
                    onPress={handlePress}>
                </Button>
            </View>
        </TouchableNativeFeedback >
    );
};

const styles = StyleSheet.create({
    buttonWrapper: {
        overflow: 'hidden',
        backgroundColor: '#ffffff',
        borderRadius: 50,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 1,
        shadowRadius: 10,
        elevation: 15,
    },
    button: {
        width: 260,
        alignItems: 'center',
        borderRadius: 50,
        paddingVertical: '4%',
    },
    buttonText: {
        fontSize: 24,
        fontWeight: '600',
    },
});

export default MediumButton;
