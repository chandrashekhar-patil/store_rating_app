import { useState, useEffect } from 'react';
import axios from 'axios';

function AdminDashboard({ user, onLogout }) {
  const [dashboard, setDashboard] = useState({});
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [filters, setFilters] = useState({ name: '', email: '', address: '', role: '' });
  const [sortBy, setSortBy] = useState('name');
  const [order, setOrder] = useState('ASC');

  useEffect(() => {
    fetchDashboard();
    fetchUsers();
    fetchStores();
  }, [filters, sortBy, order]);

  const fetchDashboard = async () => {
    const res = await axios.get('http://localhost:5000/api/admin/dashboard', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    setDashboard(res.data);
  };

  const fetchUsers = async () => {
    const res = await axios.get('http://localhost:5000/api/admin/users', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      params: { ...filters, sortBy, order },
    });
    setUsers(res.data);
  };

  const fetchStores = async () => {
    const res = await axios.get('http://localhost:5000/api/admin/stores', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      params: { ...filters, sortBy, order },
    });
    setStores(res.data);
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    const { name, email, password, address, role } = e.target;
    await axios.post('http://localhost:5000/api/admin/users', {
      name: name.value, email: email.value, password: password.value, address: address.value, role: role.value,
    }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
    fetchUsers();
  };

  const handleAddStore = async (e) => {
    e.preventDefault();
    const { name, email, address, owner_id } = e.target;
    await axios.post('http://localhost:5000/api/admin/stores', {
      name: name.value, email: email.value, address: address.value, owner_id: owner_id.value,
    }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
    fetchStores();
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button onClick={onLogout} className="bg-red-500 text-white p-2 rounded">Logout</button>
      </div>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Total Users</h2>
          <p className="text-2xl">{dashboard.user_count}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Total Stores</h2>
          <p className="text-2xl">{dashboard.store_count}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Total Ratings</h2>
          <p className="text-2xl">{dashboard.rating_count}</p>
        </div>
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
            placeholder="Email"
            value={filters.email}
            onChange={(e) => setFilters({ ...filters, email: e.target.value })}
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
            value={filters.role}
            onChange={(e) => setFilters({ ...filters, role: e.target.value })}
            className="p-2 border rounded"
          >
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
            <option value="store_owner">Store Owner</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="name">Name</option>
            <option value="email">Email</option>
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
      <div className="grid grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-bold mb-2">Add User</h2>
          <form onSubmit={handleAddUser} className="bg-white p-4 rounded shadow">
            <input name="name" type="text" placeholder="Name" className="w-full p-2 border rounded mb-2" required />
            <input name="email" type="email" placeholder="Email" className="w-full p-2 border rounded mb-2" required />
            <input name="password" type="password" placeholder="Password" className="w-full p-2 border rounded mb-2" required />
            <textarea name="address" placeholder="Address" className="w-full p-2 border rounded mb-2" required></textarea>
            <select name="role" className="w-full p-2 border rounded mb-2">
              <option value="admin">Admin</option>
              <option value="user">User</option>
              <option value="store_owner">Store Owner</option>
            </select>
            <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Add User</button>
          </form>
        </div>
        <div>
          <h2 className="text-xl font-bold mb-2">Add Store</h2>
          <form onSubmit={handleAddStore} className="bg-white p-4 rounded shadow">
            <input name="name" type="text" placeholder="Store Name" className="w-full p-2 border rounded mb-2" required />
            <input name="email" type="email" placeholder="Email" className="w-full p-2 border rounded mb-2" required />
            <textarea name="address" placeholder="Address" className="w-full p-2 border rounded mb-2" required></textarea>
            <input name="owner_id" type="number" placeholder="Owner ID" className="w-full p-2 border rounded mb-2" required />
            <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Add Store</button>
          </form>
        </div>
      </div>
      <div className="mt-6">
        <h2 className="text-xl font-bold mb-2">Users</h2>
        <table className="w-full bg-white rounded shadow">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Address</th>
              <th className="p-2">Role</th>
              <th className="p-2">Rating</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="p-2">{user.name}</td>
                <td className="p-2">{user.email}</td>
                <td className="p-2">{user.address}</td>
                <td className="p-2">{user.role}</td>
                <td className="p-2">{user.rating || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-6">
        <h2 className="text-xl font-bold mb-2">Stores</h2>
        <table className="w-full bg-white rounded shadow">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Address</th>
              <th className="p-2">Rating</th>
            </tr>
          </thead>
          <tbody>
            {stores.map((store) => (
              <tr key={store.id}>
                <td className="p-2">{store.name}</td>
                <td className="p-2">{store.email}</td>
                <td className="p-2">{store.address}</td>
                <td className="p-2">{store.rating || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminDashboard;