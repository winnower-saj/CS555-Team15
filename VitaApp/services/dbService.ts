import axios from 'axios';

const Config = {
    API_URL: 'server-public-api',
};

// Sign up a user by sending thier data to the API
const signupUser = async (userData: { firstName: string; lastName: string; phoneNumber: string; password: string; }) => {
    try {
        const response = await axios.post(`${Config.API_URL}/auth/signup`,
            userData
        );

        return response;
    } catch (error) {
        throw error;
    }
};

// Login a user by sending their phone number and password to the API
const loginUser = async (userData: { phoneNumber: string; password: string; }) => {
    try {
        const response = await axios.post(`${Config.API_URL}/auth/login`,
            userData
        );

        return response;
    } catch (error) {
        throw error;
    }
};

// Logout a user by sending their refresh token to the API
const logoutUser = async (refreshToken: string) => {
    try {
        const response = await axios.post(`${Config.API_URL}/auth/logout`, {
            token: refreshToken,
        });

        return response.data;
    } catch (error) {
        throw error;
    }
};

// Delete a user by sending their userId and token to the API
const deleteUser = async (userId: string, refreshToken: string) => {
    try {
        const response = await axios.delete(`${Config.API_URL}/auth/delete`, {
            data: { userId, token: refreshToken }
        });

        return response.data;
    } catch (error) {
        throw error;
    }
};

// Refresh the token
const refreshAccessToken = async (refreshToken: any) => {
    try {
        const response = await fetch(`${Config.API_URL}/token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token: refreshToken }),
        });

        if (response.ok) {
            const data = await response.json();
            return data.accessToken;
        }
        throw new Error('Failed to refresh access token');
    } catch (e) {
        console.error('Error refreshing token:', e);
        return null;
    }
};

export { signupUser, loginUser, logoutUser, deleteUser, refreshAccessToken };
