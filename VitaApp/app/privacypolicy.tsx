// src/screens/PrivacyPolicy.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

const PrivacyPolicy= ({ navigation }) => {
  //const navigation = useNavigation();

  return (
    <View style={styles.container}>
        <ScrollView>
          <View style={styles.header}>
					  <Text style={styles.headerTitle}>Privacy Policy</Text>
				  </View>
            <Text style={styles.heading}>Last Updated: 10/27/2024</Text>
            <Text style={styles.text}>Welcome to VitaVoice! We value your privacy and are committed to protecting your personal information. This Privacy Policy describes what information we collect, how we use it, and the choices you have concerning your data when using our app. By using VitaVoice, you agree to the terms of this Privacy Policy.</Text>
            <Text style={styles.heading}>1. Information We Collect</Text>
            <Text style={styles.subHeading}>a. Personal Information</Text>
            <Text style={styles.text}>{`We may collect personal information that you provide directly, such as:\n\nAccount Information: Name, email address, and any other data needed to create and manage your account.\nHealth-Related Information: Any symptoms, health status, or health goals you share with us.`}</Text>
            <Text style={styles.subHeading}>b. Voice Data</Text>
            <Text style={styles.text}>The app collects voice recordings when you interact with the voice assistant. This data is used to process your commands, respond to health-related queries, and improve the app’s performance.</Text>
            <Text style={styles.subHeading}>b. Voice Data</Text>
            <Text style={styles.text}>{`We may collect data on how you use the app, including:\n\nInteraction Patterns: Information on your interactions with the voice assistant.\nTechnical Data: Device information, IP address, and diagnostic logs to troubleshoot and optimize the app.`}</Text>
            <Text style={styles.heading}>2. How We Use Your Information</Text>
            <Text style={styles.text}>{`We use the information we collect to:Respond to your commands and provide health-related information. \nImprove our services, refine app features, and personalize your experience.\nPerform analytics on aggregated and anonymized data to enhance the app’s functionality.`}</Text>
            <Text style={styles.heading}>3. Data Sharing and Disclosure</Text>
            <Text style={styles.text}>{`We may share your data with:\n\nThird-Party Service Providers: We work with providers for services such as speech recognition and cloud storage. These providers are bound by confidentiality obligations and cannot use your data for any other purpose.\nLegal and Regulatory Requirements: We may disclose your data if required by law or to protect the rights, property, or safety of our users or others.`}</Text>
            <Text style={styles.heading}>4. Data Retention</Text>
            <Text style={styles.text}>We retain personal and voice data only as long as necessary to fulfill the purposes outlined in this policy, or as required by law. If you request data deletion, we will remove your information in accordance with our data retention policy.</Text>
            <Text style={styles.heading}>5. Security Measures</Text>
            <Text style={styles.text}>{`We take security seriously and implement measures to protect your data:\n\nEncryption: We encrypt voice and personal data during transmission and storage.\nAccess Control: Only authorized personnel have access to sensitive information.`}</Text>
            <Text style={styles.heading}>6. Children’s Privacy</Text>
            <Text style={styles.text}>VitaVoice is not intended for individuals under 13. We do not knowingly collect data from children under 13. If we become aware of such data, we will delete it promptly.</Text>
            <Text style={styles.heading}>7. Your Rights</Text>
            <Text style={styles.text}>{`You have the right to:\n\nAccess and Update: Review and update your personal information within the app.\nDelete Data: Request deletion of your data by contacting our support team.\nOpt-Out: Disable certain data collection features in your device settings.`}</Text>
            <Text style={styles.heading}>8. Changes to This Privacy Policy</Text>
            <Text style={styles.text}>We may update this Privacy Policy periodically. Any changes will be communicated through the app or other appropriate channels.</Text>
            <Text style={styles.heading}>9. Contact Us</Text>
            <Text style={styles.text}>If you have questions about this Privacy Policy, please contact us at VitaVitlis@gmail.com.</Text>
        </ScrollView>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('profile')}>
        <Text style={styles.backButtonText}>&lt;   Back</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
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
    heading: {fontSize: 22, color: '#03045e', marginBottom: 20, },
    subHeading: {fontSize: 18, color: '#03045e', marginBottom: 20,},
    text: {fontSize: 16, color: '#000000', marginBottom: 20,},
    container: { flex: 1, padding: 20 },
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

export default PrivacyPolicy;
