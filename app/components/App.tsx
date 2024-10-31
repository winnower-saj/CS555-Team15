import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import ProfileMenuScreen from "./ProfileMenuScreen";
import ProfileEditScreen from "./ProfileEditScreen";
import PrivacyPolicyScreen from "./PrivacyPolicyScreen";
import SettingsScreen from "./SettingsScreen";

export type RootStackParamList = {
  ProfileMenu: undefined;
  Profile: undefined;
  PrivacyPolicy: undefined;
  Settings: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: "#fff" },
        }}
      >
        <Stack.Screen name="ProfileMenu" component={ProfileMenuScreen} />
        <Stack.Screen name="Profile" component={ProfileEditScreen} />
        <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
