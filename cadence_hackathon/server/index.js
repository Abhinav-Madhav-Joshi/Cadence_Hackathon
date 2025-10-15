const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MySQL Connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Dashboard Overview - Group by Key with P0 and P1 counts
app.get('/api/dashboard/overview', (req, res) => {
  const query = `
    SELECT 
      \`Key\`,
      SUM(CASE WHEN Priority = 0 THEN 1 ELSE 0 END) as P0,
      SUM(CASE WHEN Priority IN (1, 2) THEN 1 ELSE 0 END) as P1,
      COUNT(*) as Total
    FROM company
    GROUP BY \`Key\`
    ORDER BY \`Key\` ASC
  `;
  
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results);
  });
});

// Example API endpoint
app.get('/api/users', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results);
  });
});



app.post('/api/users', (req, res) => {
  const { name, email } = req.body;
  db.query('INSERT INTO users (name, email) VALUES (?, ?)', 
    [name, email], 
    (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: result.insertId, name, email });
    }
  );
});

// This should be at the END
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});