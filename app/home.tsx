import {
	SafeAreaProvider,
	SafeAreaView as SafeAreaViewRN,
} from 'react-native-safe-area-context';
const Home = () => {
	return (
		<SafeAreaProvider>
			<SafeAreaViewRN>Home</SafeAreaViewRN>
		</SafeAreaProvider>
	);
};

export default Home;
