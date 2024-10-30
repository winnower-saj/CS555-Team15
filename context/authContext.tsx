import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	ReactNode,
	useMemo,
} from 'react';
import {
	getUserSession,
	saveUserSession,
	clearUserSession,
} from '../services/authService';
import { AuthContextType } from '../types/app';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [user, setUser] = useState<AuthContextType['user']>(null);
	const [isUserLoaded, setIsUserLoaded] = useState(false);

	useEffect(() => {
		const loadSession = async () => {
			const session = await getUserSession();
			if (session?.accessToken) {
				setUser(session);
			}
			setIsUserLoaded(true);
		};
		loadSession();
	}, []);

	const login = async (
		userId: string,
		accessToken: string,
		refreshToken: string,
		firstName: string,
		lastName: string,
		phoneNumber: string
	) => {
		await saveUserSession(userId, accessToken, refreshToken, firstName, lastName, phoneNumber);
		setUser({ userId, accessToken });
	};

	const logout = async () => {
		await clearUserSession();
		setUser(null);
	};

	const value = useMemo(
		() => ({ user, login, logout, isUserLoaded }),
		[user, login, logout, isUserLoaded]
	);

	return (
		<AuthContext.Provider value={value}>{children}</AuthContext.Provider>
	);
};

export const useAuth = (): AuthContextType => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
};
