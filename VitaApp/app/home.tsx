import {
	SafeAreaProvider,
	SafeAreaView as SafeAreaViewRN,
} from 'react-native-safe-area-context';
import { Text } from 'react-native';

const Home = () => {
	return (
		<SafeAreaProvider>
			<SafeAreaViewRN>
				<Text>Home Screen</Text>
			</SafeAreaViewRN>
		</SafeAreaProvider>
	);
};

export default Home;
