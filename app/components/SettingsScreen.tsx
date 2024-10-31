import React, { useState } from "react";
import { View, Text, StyleSheet, Switch, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

interface SettingItemProps {
  icon: keyof typeof MaterialIcons.glyphMap;
  title: string;
  type: "toggle" | "action";
  value?: boolean;
  onPress?: () => void;
  onToggle?: (value: boolean) => void;
}

const SettingItem: React.FC<SettingItemProps> = ({
  icon,
  title,
  type,
  value,
  onPress,
  onToggle,
}) => (
  <View style={styles.settingItem}>
    <View style={styles.settingIcon}>
      <MaterialIcons name={icon} size={24} color="#fff" />
    </View>
    <Text style={styles.settingText}>{title}</Text>
    {type === "toggle" ? (
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: "#767577", true: "#0096FF" }}
        thumbColor={value ? "#fff" : "#f4f3f4"}
      />
    ) : (
      <MaterialIcons name="chevron-right" size={24} color="#0096FF" />
    )}
  </View>
);

const SettingsScreen: React.FC = () => {
  const navigation = useNavigation();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [locationServices, setLocationServices] = useState(true);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MaterialIcons
          name="arrow-back"
          size={24}
          color="#0096FF"
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.title}>Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <SettingItem
          icon="notifications"
          title="Notifications"
          type="toggle"
          value={notifications}
          onToggle={setNotifications}
        />

        <SettingItem
          icon="dark-mode"
          title="Dark Mode"
          type="toggle"
          value={darkMode}
          onToggle={setDarkMode}
        />

        <SettingItem
          icon="location-on"
          title="Location Services"
          type="toggle"
          value={locationServices}
          onToggle={setLocationServices}
        />

        <SettingItem
          icon="security"
          title="Change Password"
          type="action"
          onPress={() => {
            /* Implement password change */
          }}
        />

        <SettingItem
          icon="language"
          title="Language"
          type="action"
          onPress={() => {
            /* Implement language selection */
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  content: {
    padding: 20,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#0096FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  settingText: {
    flex: 1,
    fontSize: 16,
  },
});

export default SettingsScreen;
