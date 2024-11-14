import React, { useState } from 'react';
import { View, Text, StyleSheet,TouchableOpacity } from 'react-native';
import ToggleButton from './toggleButton';
import { useNavigation } from '@react-navigation/native';

const SoundAndVibration= ({ navigation }) => {
  const [isSoundOn, setIsSoundOn] = useState(true);
  const [isVibrationOn, setIsVibrationOn] = useState(false);
  return (
    <View style={styles.container}>
      <View style={styles.header}>
					<Text style={styles.headerTitle}>Notification Settings</Text>
				</View>

      <View style={styles.settingContainer}>
        <Text style={styles.label}>Sound</Text>
        <ToggleButton
          isOn={isSoundOn}
          labelOn="Sound ON"
          labelOff="Sound OFF"
          onToggle={() => setIsSoundOn(!isSoundOn)}
        />
      </View>

      <View style={styles.settingContainer}>
        <Text style={styles.label}>Vibrate</Text>
        <ToggleButton
          isOn={isVibrationOn}
          labelOn="Vibration ON"
          labelOff="Vibration OFF"
          onToggle={() => setIsVibrationOn(!isVibrationOn)}
        />
      </View>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('settings')}>
        <Text style={styles.backButtonText}>&lt;   Back</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
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
  settingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  label: {
    fontSize: 18,
    color: 'black',
  },
  backButton: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    backgroundColor: '#0077B6',
    borderRadius: 50,
    width: '70%',
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    color: 'white',
    fontSize: 25,
  },
});

export default SoundAndVibration;