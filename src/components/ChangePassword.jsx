import React, { useState } from 'react';
import axios from 'axios';

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('user/change-password', { currentPassword, newPassword });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response.data.message);
    }
  };

  return (
    <form onSubmit={handleChangePassword}>
      <div>
        <label>Current Password</label>
        <input 
          type="password" 
          value={currentPassword} 
          onChange={(e) => setCurrentPassword(e.target.value)} 
          required 
        />
      </div>
      <div>
        <label>New Password</label>
        <input 
          type="password" 
          value={newPassword} 
          onChange={(e) => setNewPassword(e.target.value)} 
          required 
        />
      </div>
      <button type="submit">Change Password</button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default ChangePassword;
