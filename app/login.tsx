import {
	SafeAreaProvider,
	SafeAreaView as SafeAreaViewRN,
} from 'react-native-safe-area-context';
import { Text } from 'react-native';

const Login = () => {
	return (
		<SafeAreaProvider>
			<SafeAreaViewRN>
				<Text>Login</Text>
			</SafeAreaViewRN>
		</SafeAreaProvider>
	);
};

export default Login;
