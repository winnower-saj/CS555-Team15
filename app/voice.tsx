import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';

const API_URL = process.env.API_URL;
const STATUS_URL = process.env.STATUS_URL;
const API_KEY = process.env.API_KEY;
const API_KEY_NAME = process.env.API_KEY_NAME;

const Voice = () => {
    const [isRunning, setIsRunning] = useState(false);
    const [loading, setLoading] = useState(false);

    const fetchStatus = () => {
        axios
            .get(STATUS_URL, { headers: { [API_KEY_NAME]: API_KEY } })
            .then(response => setIsRunning(response.data.status === 'running'))
            .catch(() => Alert.alert('Error', 'Failed to fetch status.'));
    };

    useEffect(() => { fetchStatus(); }, []);

    const handlePress = () => {
        setLoading(true);
        const action = isRunning ? 'stop' : 'start';

        axios
            .post(API_URL, { action }, { headers: { [API_KEY_NAME]: API_KEY, 'Content-Type': 'application/json' } })
            .then(response => {
                setIsRunning(!isRunning);
                Alert.alert('Success', response.data.status);
            })
            .catch(error => Alert.alert('Error', error.response?.data?.detail || 'Something went wrong.'))
            .finally(() => setLoading(false));
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Voice Assistant Control</Text>
            <TouchableOpacity
                style={[styles.button, isRunning ? styles.stopButton : styles.startButton]}
                onPress={handlePress}
                disabled={loading}
            >
                {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.buttonText}>{isRunning ? 'Stop' : 'Start'}</Text>}
            </TouchableOpacity>
            <Text style={styles.statusText}>Assistant is {isRunning ? 'Running' : 'Stopped'}</Text>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        marginBottom: 40,
        fontWeight: 'bold',
    },
    button: {
        width: 200,
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    startButton: {
        backgroundColor: '#4CAF50',
    },
    stopButton: {
        backgroundColor: '#F44336',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    statusText: {
        marginTop: 20,
        fontSize: 18,
    },
});

export default Voice;