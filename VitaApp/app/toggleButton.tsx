// src/screens/ToggleButton.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface ToggleButtonProps {
  isOn: boolean;
  labelOn: string;
  labelOff: string;
  onToggle: () => void;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({ isOn, labelOn, labelOff, onToggle }) => (
  <TouchableOpacity
    accessibilityLabel={isOn ? labelOn : labelOff}
    style={[styles.toggleButton, isOn ? styles.toggleOn : styles.toggleOff]}
    onPress={onToggle}
  >
    <Text style={styles.toggleText}>{isOn ? 'ON' : 'OFF'}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  toggleButton: {
    width: 60,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
  },
  toggleOn: {
    backgroundColor: '#0077B6',
  },
  toggleOff: {
    backgroundColor: '#03045e',
  },
  toggleText: {
    color: 'white',
    fontWeight: '600',
  },
});

export default ToggleButton;
