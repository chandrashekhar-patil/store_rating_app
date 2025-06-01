const express = require('express');
const pool = require('../config/db');
const auth = require('../middleware/auth');
const router = express.Router();

router.use(auth(['admin']));

router.post('/users', async (req, res) => {
  const { name, email, password, address, role } = req.body;
  if (name.length < 20 || name.length > 60 || address.length > 400 || !/^[A-Za-z0-9+_.-]+@(.+)$/.test(email) || !/^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,16}$/.test(password)) {
    return res.status(400).json({ error: 'Invalid input' });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query('INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)', [name, email, hashedPassword, address, role]);
    res.status(201).json({ message: 'User created' });
  } catch (err) {
    res.status(400).json({ error: 'Email already exists' });
  }
});

router.post('/stores', async (req, res) => {
  const { name, email, address, owner_id } = req.body;
  if (name.length < 20 || name.length > 60 || address.length > 400 || !/^[A-Za-z0-9+_.-]+@(.+)$/.test(email)) {
    return res.status(400).json({ error: 'Invalid input' });
  }
  try {
    await pool.query('INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)', [name, email, address, owner_id]);
    res.status(201).json({ message: 'Store created' });
  } catch (err) {
    res.status(400).json({ error: 'Email already exists' });
  }
});

router.get('/dashboard', async (req, res) => {
  try {
    const [[{ user_count }]] = await pool.query('SELECT COUNT(*) as user_count FROM users');
    const [[{ store_count }]] = await pool.query('SELECT COUNT(*) as store_count FROM stores');
    const [[{ rating_count }]] = await pool.query('SELECT COUNT(*) as rating_count FROM ratings');
    res.json({ user_count, store_count, rating_count });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/users', async (req, res) => {
  const { name, email, address, role, sortBy = 'name', order = 'ASC' } = req.query;
  let query = 'SELECT id, name, email, address, role FROM users WHERE 1=1';
  const params = [];
  if (name) { query += ' AND name LIKE ?'; params.push(`%${name}%`); }
  if (email) { query += ' AND email LIKE ?'; params.push(`%${email}%`); }
  if (address) { query += ' AND address LIKE ?'; params.push(`%${address}%`); }
  if (role) { query += ' AND role = ?'; params.push(role); }
  query += ` ORDER BY ${sortBy} ${order}`;
  try {
    const [users] = await pool.query(query, params);
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/stores', async (req, res) => {
  const { name, email, address, sortBy = 'name', order = 'ASC' } = req.query;
  let query = 'SELECT s.id, s.name, s.email, s.address, AVG(r.rating) as rating FROM stores s LEFT JOIN ratings r ON s.id = r.store_id WHERE 1=1';
  const params = [];
  if (name) { query += ' AND s.name LIKE ?'; params.push(`%${name}%`); }
  if (email) { query += ' AND s.email LIKE ?'; params.push(`%${email}%`); }
  if (address) { query += ' AND s.address LIKE ?'; params.push(`%${address}%`); }
  query += ` GROUP BY s.id ORDER BY ${sortBy} ${order}`;
  try {
    const [stores] = await pool.query(query, params);
    res.json(stores);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [users] = await pool.query('SELECT u.name, u.email, u.address, u.role, AVG(r.rating) as rating FROM users u LEFT JOIN stores s ON u.id = s.owner_id LEFT JOIN ratings r ON s.id = r.store_id WHERE u.id = ? GROUP BY u.id', [id]);
    if (users.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json(users[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;