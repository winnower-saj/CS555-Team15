interface AuthContextType {
	user: { userId: string; accessToken: string } | null;
	isUserLoaded: boolean;
	login: (
		userId: string,
		accessToken: string,
		refreshToken: string,
		firstName: string,
		lastName: sttring,
		phoneNumber: string
	) => Promise<void>;
	logout: () => Promise<void>;
}

export { AuthContextType };
