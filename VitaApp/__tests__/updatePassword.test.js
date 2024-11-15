import axios from 'axios';
import { updatePassword } from '../services/dbService';

jest.mock('axios'); 

describe('updatePassword function', () => {
  it('should update password successfully', async () => {
    const mockResponse = { data: { success: true, message: 'Password updated successfully' } };
    axios.patch.mockResolvedValue(mockResponse);

    const userId = '123';
    const currentPassword = 'oldPassword';
    const newPassword = 'newPassword';
    const response = await updatePassword(userId, currentPassword, newPassword);
    expect(axios.patch).toHaveBeenCalledWith(
      'http://<SERVER_IP>:3000/auth/update-password',
      { userId, currentPassword, newPassword }
    );
    expect(response.success).toBe(true);
    expect(response.message).toBe('Password updated successfully');
  });

  it('should handle error when password update fails', async () => {
    const mockError = new Error('Password update failed');
    axios.patch.mockRejectedValue(mockError); 

    const userId = '123'; 
    const currentPassword = 'oldPassword';
    const newPassword = 'newPassword';

    try {
      await updatePassword(userId, currentPassword, newPassword);
    } catch (error) {
      expect(error.message).toBe('Password update failed. Please try again.');
    }
  });
});
