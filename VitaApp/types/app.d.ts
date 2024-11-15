interface AuthContextType {
	user: {
		userId: string;
		accessToken: string;
		firstName: string;
		lastName: string;
		phoneNumber: string;
	} | null;
	isUserLoaded: boolean;
	login: (
		userId: string,
		accessToken: string,
		refreshToken: string,
		firstName: string,
		lastName: string,
		phoneNumber: string
	) => Promise<void>;
	logout: () => Promise<void>;
}

export { AuthContextType };
