import { useState, useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { Asset } from 'expo-asset';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppIntroduction from './components/AppIntroduction';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const preloadImages = async (imageAssets) => {
	const cacheImages = imageAssets.map((image) => Asset.loadAsync(image));
	return Promise.all(cacheImages);
};

const RootLayout = () => {
	const router = useRouter();
	const [isAppReady, setIsAppReady] = useState(false);
	const [isLoadDataComplete, setIsLoadDataComplete] = useState(false);
	const [hasOpenedAppBefore, setHasOpenedAppBefore] = useState(false);
	const [isFontsLoaded] = useFonts({
		SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
	});

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
				await SplashScreen.hideAsync().catch((error) =>
					console.warn('Error hiding splash screen', error)
				);
			}
		};
		hideSplashScreen();
	}, [isFontsLoaded, isLoadDataComplete]);

	if (!isAppReady) {
		return null;
	}

	// If the app has not been opened before, show the AppIntroduction component
	if (!hasOpenedAppBefore) {
		return (
			<AppIntroduction
				onSkip={async () => {
					await AsyncStorage.setItem('hasOpenedAppBefore', 'true');
					setHasOpenedAppBefore(true);
				}}
			/>
		);
	}

	return (
		<Stack>
			<Stack.Screen name='index' options={{ headerShown: false }} />
			<Stack.Screen name='signup' options={{ headerShown: false }} />
			<Stack.Screen name='home' options={{ headerShown: false }} />
		</Stack>
	);
};

export default RootLayout;
