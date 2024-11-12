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
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 1,
        shadowRadius: 10,
        elevation: 15,
        backgroundColor: '#ffffff',
        borderRadius: 50,
    },
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
