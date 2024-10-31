import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";

type MenuItemProps = {
  icon: keyof typeof MaterialIcons.glyphMap;
  title: string;
  onPress: () => void;
};

const MenuItem: React.FC<MenuItemProps> = ({ icon, title, onPress }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <View style={styles.iconContainer}>
      <MaterialIcons name={icon} size={24} color="#fff" />
    </View>
    <Text style={styles.menuText}>{title}</Text>
    <MaterialIcons name="chevron-right" size={24} color="#0096FF" />
  </TouchableOpacity>
);

const ProfileMenuScreen: React.FC = () => {
  const navigation = useNavigation();

  const handleLogout = () => {
    // Implement logout logic here
    console.log("Logging out...");
  };

  const menuItems: Array<MenuItemProps> = [
    {
      icon: "person",
      title: "Profile",
      onPress: () => navigation.navigate("Profile" as never),
    },
    {
      icon: "lock",
      title: "Privacy Policy",
      onPress: () => navigation.navigate("PrivacyPolicy" as never),
    },
    {
      icon: "settings",
      title: "Settings",
      onPress: () => navigation.navigate("Settings" as never),
    },
    {
      icon: "logout",
      title: "Log Out",
      onPress: handleLogout,
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Profile</Text>

      <View style={styles.profileHeader}>
        <Image
          source={require("./assets/profile-avatar.png")} // Replace with your image path
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>Regina Cassandra</Text>
      </View>

      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <MenuItem
            key={index}
            icon={item.icon}
            title={item.title}
            onPress={item.onPress}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#0096FF",
    textAlign: "center",
    marginBottom: 20,
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: 40,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  profileName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 20,
  },
  menuContainer: {
    marginTop: 20,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    marginBottom: 15,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#0096FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  menuText: {
    flex: 1,
    fontSize: 18,
    color: "#000",
  },
});

export default ProfileMenuScreen;
