# Store Rating Application

A full-stack web application that allows users to submit ratings for stores registered on the platform. The application features role-based authentication with different functionalities for System Administrators, Normal Users, and Store Owners.

## 🚀 Features

### User Roles & Capabilities

#### System Administrator
- Add new stores, normal users, and admin users
- Dashboard with analytics (total users, stores, ratings)
- View and filter lists of stores and users
- Manage user details and store information
- Access detailed user profiles with ratings (for store owners)

#### Normal User
- Register and login to the platform
- View and search stores
- Submit ratings (1-5 scale) for stores
- Update existing ratings
- Filter stores by name and location

#### Store Owner
- View dashboard with received ratings
- See average rating for their store
- Access detailed rating breakdown from customers

## 🛠️ Tech Stack

### Backend
- **Framework**: Express.js
- **Database**: MySQL with mysql2
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Environment Variables**: dotenv
- **CORS**: cors middleware

### Frontend
- **Framework**: React.js
- **Build Tool**: Vite
- **Styling**: CSS/Tailwind (based on your setup)

## 📋 Prerequisites

Before running this application, make sure you have:

- Node.js (v14 or higher)
- MySQL/MariaDB server
- npm or yarn package manager

## 🗃️ Database Schema

The application requires the following MySQL tables:

```sql
-- Users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(60) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    address TEXT(400),
    role ENUM('admin', 'user', 'store_owner') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Stores table
CREATE TABLE stores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(60) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    address TEXT(400),
    owner_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id)
);

-- Ratings table
CREATE TABLE ratings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    store_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_user_store (user_id, store_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (store_id) REFERENCES stores(id)
);
```

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd store-rating-app
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASS=your_mysql_password
DB_NAME=store_rating_db
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

### 3. Database Setup
- Create a MySQL database named `store_rating_db`
- Run the SQL schema provided above
- Optionally, insert a default admin user:
```

### 4. Frontend Setup
```bash
cd ../frontend
npm install
```

### 5. Run the Application

**Start Backend** (from backend directory):
```bash
npm start
# or
node server.js
```

**Start Frontend** (from frontend directory):
```bash
npm run dev
```

The application will be available at:
- Frontend: `http://localhost:5173` (Vite default)
- Backend API: `http://localhost:5000`

## 📁 Project Structure

```
store-rating-app/
├── backend/
│   ├── config/
│   │   └── db.js              # Database configuration
│   ├── middleware/
│   │   └── auth.js            # JWT authentication middleware
│   ├── routes/
│   │   ├── admin.js           # Admin routes
│   │   ├── auth.js            # Authentication routes
│   │   ├── store.js           # Store owner routes
│   │   └── user.js            # User routes
│   ├── server.js              # Main server file
│   ├── package.json
│   └── .env                   # Environment variables
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── AdminDashboard.jsx
    │   │   ├── Login.jsx
    │   │   ├── Signup.jsx
    │   │   ├── StoreOwnerDashboard.jsx
    │   │   └── UserDashboard.jsx
    │   └── ...
    ├── package.json
    └── vite.config.js
```

## 🔐 Authentication

The application uses JWT-based authentication with the following validation rules:

### Password Requirements
- 8-16 characters long
- At least one uppercase letter
- At least one special character (!@#$%^&*)
- Alphanumeric with special characters only

### Name Requirements
- 03-60 characters long

### Email Requirements
- Valid email format

### Address Requirements
- Maximum 400 characters

## 🧪 Testing the Application

### Manual Testing Steps

1. **Admin Testing**:
   - Login with admin credentials
   - Test dashboard statistics
   - Add new users and stores
   - Filter and sort listings

2. **User Testing**:
   - Register a new user account
   - Login and browse stores
   - Submit ratings for different stores
   - Update existing ratings

3. **Store Owner Testing**:
   - Create a store owner account (via admin)
   - Login and view rating dashboard
   - Check average ratings and customer feedback

### API Endpoints Testing

You can test the API endpoints using tools like Postman or curl:

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"Password123!"}'

# Get stores (with auth token)
curl -X GET http://localhost:5000/api/user/stores \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**:
   - Verify MySQL server is running
   - Check database credentials in `.env`
   - Ensure database exists

2. **JWT Token Issues**:
   - Verify JWT_SECRET in `.env`
   - Check token expiration (1 hour default)

3. **CORS Issues**:
   - Ensure frontend URL is accessible
   - Check CORS configuration in server.js

4. **Missing bcrypt import**:
   - Add `const bcrypt = require('bcryptjs');` to admin.js route file

## 🔧 Environment Variables

### Backend (.env)
```env
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASS=your_mysql_password
DB_NAME=store_rating_db
JWT_SECRET=your_jwt_secret_key_here
PORT=5000
```

## 📝 License

This project is created as part of a coding challenge.

## 👥 Contributing

This is a coding challenge project. For improvements or bug fixes, please follow standard Git workflow practices.

---

**Happy Coding!** 🎉
