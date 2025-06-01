const express = require('express');
const pool = require('../config/db');
const auth = require('../middleware/auth');
const router = express.Router();

router.use(auth(['user']));

router.get('/stores', async (req, res) => {
  const { name, address, sortBy = 'name', order = 'ASC' } = req.query;
  let query = 'SELECT s.id, s.name, s.address, AVG(r.rating) as overall_rating, (SELECT rating FROM ratings WHERE user_id = ? AND store_id = s.id) as user_rating FROM stores s LEFT JOIN ratings r ON s.id = r.store_id WHERE 1=1';
  const params = [req.user.id];
  if (name) { query += ' AND s.name LIKE ?'; params.push(`%${name}%`); }
  if (address) { query += ' AND s.address LIKE ?'; params.push(`%${address}%`); }
  query += ` GROUP BY s.id ORDER BY ${sortBy} ${order}`;
  try {
    const [stores] = await pool.query(query, params);
    res.json(stores);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/ratings', async (req, res) => {
  const { store_id, rating } = req.body;
  if (rating < 1 || rating > 5) return res.status(400).json({ error: 'Invalid rating' });
  try {
    await pool.query('INSERT INTO ratings (user_id, store_id, rating) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE rating = ?', [req.user.id, store_id, rating, rating]);
    res.status(201).json({ message: 'Rating submitted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;