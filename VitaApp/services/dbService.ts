import axios from 'axios';

const Config = {
    API_URL: 'http://<SERVER>:3000',
};

const signupUser = async (userData) => {
    try {
        const response = await axios.post(`${Config.API_URL}/auth/signup`,
            userData
        );

        return response;
    } catch (error) {
        console.error(
            'Error during signup:',
            error.response?.data || error.message
        );
        throw error;
    }
};

const loginUser = async (userData) => {
    try {
        const response = await axios.post(`${Config.API_URL}/auth/login`,
            userData
        );

        return response;
    } catch (error) {
        console.error(
            'Error during login:',
            error.response?.data || error.message
        );
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
        console.error(
            'Error during logout:',
            error.response?.data || error.message
        );
        throw new Error('Logout failed. Please try again.');
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
        console.error(
            'Error during deleting the account:',
            error.response?.data || error.message
        );
        throw new Error('Deleting the account failed. Please try again.');
    }
};

const refreshAccessToken = async (refreshToken) => {
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
