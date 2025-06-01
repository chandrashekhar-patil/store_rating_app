import { useState, useEffect } from 'react';
import axios from 'axios';

function UserDashboard({ user, onLogout }) {
  const [stores, setStores] = useState([]);
  const [filters, setFilters] = useState({ name: '', address: '' });
  const [sortBy, setSortBy] = useState('name');
  const [order, setOrder] = useState('ASC');
  const [passwordData, setPasswordData] = useState({ email: '', oldPassword: '', newPassword: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStores();
  }, [filters, sortBy, order]);

  const fetchStores = async () => {
    const res = await axios.get('http://localhost:5000/api/user/stores', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      params: { ...filters, sortBy, order },
    });
    setStores(res.data);
  };

  const handleRating = async (storeId, rating) => {
    await axios.post('http://localhost:5000/api/user/ratings', { store_id: storeId, rating }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    fetchStores();
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
        <h1 className="text-3xl font-bold">User Dashboard</h1>
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
        <h2 className="text-xl font-bold mb-2">Filters</h2>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Name"
            value={filters.name}
            onChange={(e) => setFilters({ ...filters, name: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Address"
            value={filters.address}
            onChange={(e) => setFilters({ ...filters, address: e.target.value })}
            className="p-2 border rounded"
          />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="name">Name</option>
            <option value="address">Address</option>
          </select>
          <select
            value={order}
            onChange={(e) => setOrder(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="ASC">Ascending</option>
            <option value="DESC">Descending</option>
          </select>
        </div>
      </div>
      <div>
        <h2 className="text-xl font-bold mb-2">Stores</h2>
        <table className="w-full bg-white rounded shadow">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">Name</th>
              <th className="p-2">Address</th>
              <th className="p-2">Overall Rating</th>
              <th className="p-2">Your Rating</th>
              <th className="p-2">Submit Rating</th>
            </tr>
          </thead>
          <tbody>
            {stores.map((store) => (
              <tr key={store.id}>
                <td className="p-2">{store.name}</td>
                <td className="p-2">{store.address}</td>
                <td className="p-2">{store.overall_rating || 'N/A'}</td>
                <td className="p-2">{store.user_rating || 'Not Rated'}</td>
                <td className="p-2">
                  <select onChange={(e) => handleRating(store.id, Number(e.target.value))} className="p-1 border rounded">
                    <option value="">Select</option>
                    {[1, 2, 3, 4, 5].map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserDashboard;