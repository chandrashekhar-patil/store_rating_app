import { useState, useEffect } from 'react';
import axios from 'axios';

function StoreOwnerDashboard({ user, onLogout }) {
  const [dashboard, setDashboard] = useState({ ratings: [], average_rating: 0 });
  const [passwordData, setPasswordData] = useState({ email: '', oldPassword: '', newPassword: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    const res = await axios.get('http://localhost:5000/api/store/dashboard', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    setDashboard(res.data);
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/update-password', passwordData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setPasswordData({ email: '', oldPassword: '', newPassword: '' });
      setError('');
    } catch (err) {
      setError(err.response?.data.error || 'Password update failed');
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Store Owner Dashboard</h1>
        <button onClick={onLogout} className="bg-red-500 text-white p-2 rounded">Logout</button>
      </div>
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2">Update Password</h2>
        <form onSubmit={handlePasswordUpdate} className="bg-white p-4 rounded shadow">
          <input
            type="email"
            placeholder="Email"
            value={passwordData.email}
            onChange={(e) => setPasswordData({ ...passwordData, email: e.target.value })}
            className="w-full p-2 border rounded mb-2"
            required
          />
          <input
            type="password"
            placeholder="Old Password"
            value={passwordData.oldPassword}
            onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
            className="w-full p-2 border rounded mb-2"
            required
          />
          <input
            type="password"
            placeholder="New Password"
            value={passwordData.newPassword}
            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
            className="w-full p-2 border rounded mb-2"
            required
          />
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Update Password</button>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </form>
      </div>
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2">Store Ratings</h2>
        <p className="text-lg">Average Rating: {dashboard.average_rating.toFixed(2)}</p>
        <table className="w-full bg-white rounded shadow">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">User Name</th>
              <th className="p-2">Rating</th>
            </tr>
          </thead>
          <tbody>
            {dashboard.ratings.map((rating, index) => (
              <tr key={index}>
                <td className="p-2">{rating.name}</td>
                <td className="p-2">{rating.rating}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StoreOwnerDashboard;