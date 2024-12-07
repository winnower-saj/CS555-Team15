import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import { fetchMedicationCount, fetchConversationCount } from '../services/dbService';
import PageHeading from './components/PageHeading';
import MediumButton from './components/MediumButton';

// Utility function to generate random alphanumeric coupon codes
const generateCouponCode = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let coupon = '';
  for (let i = 0; i < 8; i++) {
    coupon += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return coupon;
};

const RewardsScreen = ({ navigation,route }) => {
  const { user } = route.params;
  const [medicationCount, setMedicationCount] = useState(0);
  const [conversationCount, setConversationCount] = useState(0);
  const [medicationCoupon, setMedicationCoupon] = useState('');
  const [conversationCoupon, setConversationCoupon] = useState('');
  const MEDICATION_THRESHOLD = 50; // Adjust for medication reward threshold
  const CONVERSATION_THRESHOLD = 30; // Adjust for conversation reward threshold

  // Fetch medication and conversation counts on component mount
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const userId = user.userId
        const medCount = await fetchMedicationCount(userId); 
        const convCount = await fetchConversationCount(userId);
        setMedicationCount(medCount.medicationCount);
        setConversationCount(convCount.conversationCount);
      } catch (error) {
        console.error('Error fetching counts:', error.message);
      }
    };

    fetchCounts();
  }, []);

  const handleRedeemMedicationCoupon = () => {
	if (medicationCount == MEDICATION_THRESHOLD) {
		  setMedicationCoupon(generateCouponCode());
      Alert.alert('Congratulations!', `Your medication reward coupon code is: ${medicationCoupon}`);
    } else {
      const remaining = MEDICATION_THRESHOLD - medicationCount;
      Alert.alert('Keep Going!', `Log ${remaining} more medications to unlock your reward!`);
    }
  };

  const handleRedeemConversationCoupon = () => {
	if (conversationCount == CONVERSATION_THRESHOLD) {
		setConversationCoupon(generateCouponCode());
      Alert.alert('Congratulations!', `Your conversation reward coupon code is: ${conversationCoupon}`);
    } else {
      const remaining = CONVERSATION_THRESHOLD - conversationCount;
      Alert.alert('Keep Going!', `Participate in ${remaining} more conversations to unlock your reward!`);
    }
  };

  return (
    <View style={styles.container}>
      <PageHeading title="Rewards" handlePress={() => navigation.navigate('profile')} />
      
      {/* Medication Reward Section */}
      <Text style={styles.subtitle}>
        Medications Taken: {medicationCount} / {MEDICATION_THRESHOLD}
      </Text>
      <Button
        title={medicationCoupon ? 'Redeem Medication Coupon' : 'Check Medication Progress'}
        onPress={handleRedeemMedicationCoupon}
        color={medicationCoupon ? 'green' : 'gray'}
      />

      {/* Conversation Reward Section */}
      <Text style={styles.subtitle}>
        Conversations Participated: {conversationCount} / {CONVERSATION_THRESHOLD}
      </Text>
      <Button
        title={conversationCoupon ? 'Redeem Conversation Coupon' : 'Check Conversation Progress'}
        onPress={handleRedeemConversationCoupon}
        color={conversationCoupon ? 'green' : 'gray'}
      />
    </View>
  );
};

export default RewardsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  updateButton: {
    marginTop: 20,
    alignItems: 'center',
  },
});