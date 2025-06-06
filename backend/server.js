const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/user');
const storeRoutes = require('./routes/store');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);
app.use('/api/store', storeRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));