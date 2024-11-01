import React, { useState, useEffect } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SplashScreen from 'expo-splash-screen';
import { Stack, useRouter } from 'expo-router';
import { Asset } from 'expo-asset';
import { useFonts } from 'expo-font';
import AppIntroduction from './components/AppIntroduction';
import { AuthProvider, useAuth } from '../context/authContext';
import { getUserSession } from '../services/authService';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const preloadImages = async (imageAssets) => {
	const cacheImages = imageAssets.map((image) => Asset.loadAsync(image));
	return Promise.all(cacheImages);
};

const RootLayoutContent = () => {
	const [appState, setAppState] = useState(AppState.currentState);
	const router = useRouter();
	const { login, user } = useAuth();
	const [isAppReady, setIsAppReady] = useState(false);
	const [isLoadDataComplete, setIsLoadDataComplete] = useState(false);
	const [hasOpenedAppBefore, setHasOpenedAppBefore] = useState(false);
	const [isFontsLoaded] = useFonts({
		SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
	});

	useEffect(() => {
		const handleAppStateChange = (nextAppState: AppStateStatus) => {
			if (appState === 'background' && nextAppState === 'active') {
				if (user) {
					while (router.canGoBack()) {
						router.back();
					}
					router.replace('/home');
				}
			}

			if (appState === 'active' && nextAppState === 'background') {
			}

			setAppState(nextAppState);
		};

		const subscription = AppState.addEventListener(
			'change',
			handleAppStateChange
		);

		// Cleanup the event listener when the component is unmounted
		return () => {
			subscription.remove();
		};
	}, [appState]);

	const loadUserData = async () => {
		const session = await getUserSession();
		if (session?.accessToken) {
			await login(
				session.userId,
				session.accessToken,
				session.refreshToken,
				session.firstName,
				session.lastName,
				session.phoneNumber
			);
		}
	};

	const loadData = async () => {
		try {
			await preloadImages([
				require('../assets/images/bell.png'),
				require('../assets/images/lotus.png'),
				require('../assets/images/assistant.png'),
				require('../assets/images/wellbeing.png'),
				require('../assets/images/logo-blue.png'),
				require('../assets/images/check.png'),
			]);
			// Check if the app has been opened before
			const hasOpenedBefore = await AsyncStorage.getItem(
				'hasOpenedAppBefore'
			);
			setHasOpenedAppBefore(hasOpenedBefore === 'true');
			await loadUserData();
			setIsLoadDataComplete(true);
		} catch (e) {
			console.warn(e);
		}
	};

	useEffect(() => {
		loadData();
	}, []);

	useEffect(() => {
		const hideSplashScreen = async () => {
			if (isFontsLoaded && isLoadDataComplete) {
				setIsAppReady(true);
			}
		};
		hideSplashScreen();
	}, [isFontsLoaded, isLoadDataComplete]);

	useEffect(() => {
		if (isAppReady) {
			if (user) {
				while (router.canGoBack()) {
					router.back();
				}
				router.replace('/home');
			}
			SplashScreen.hideAsync().catch((error) =>
				console.warn('Error hiding splash screen', error)
			);
		}
	}, [isAppReady]);

	if (!isAppReady) {
		return null;
	}

	// If the app has not been opened before, show the AppIntroduction component
	if (!hasOpenedAppBefore && !user) {
		return (
			<AppIntroduction
				onSkip={async () => {
					await AsyncStorage.setItem('hasOpenedAppBefore', 'true');
					setHasOpenedAppBefore(true);
				}}
			/>
		);
	}

	return user ? (
		<Stack initialRouteName='home'>
			<Stack.Screen name='home' options={{ headerShown: false }} />
			<Stack.Screen name='delete-account' options={{ headerShown: false }} />
		</Stack>
	) : (
		<Stack>
			<Stack.Screen name='index' options={{ headerShown: false }} />
			<Stack.Screen name='signup' options={{ headerShown: false }} />
			<Stack.Screen name='login' options={{ headerShown: false }} />
		</Stack>
	);
};

const RootLayout = () => (
	<AuthProvider>
		<RootLayoutContent />
	</AuthProvider>
);

export default RootLayout;
