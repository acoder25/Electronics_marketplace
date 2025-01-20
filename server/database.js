const sqlite3=require('sqlite3').verbose();
const path=require('path');

const dbPath = path.resolve(__dirname, 'mydatabase.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to the database.');
    db.run(`CREATE TABLE IF NOT EXISTS sell_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL,
      type TEXT NOT NULL,
      model TEXT NOT NULL,
      year INTEGER NOT NULL,
      storage INTEGER NOT NULL,
      ram INTEGER NOT NULL,
      screenCondition TEXT NOT NULL,
      batteryHealth TEXT NOT NULL,
      physicalCondition TEXT NOT NULL,
      price TEXT NOT NULL,
      accessoriesIncluded BOOLEAN NOT NULL,
      imagepath TEXT
    )`, (err) => {
      if (err) {
        console.error('Error creating table:', err.message);
      }
    });
    db.run(`CREATE TABLE IF NOT EXISTS accounts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      email TEXT NOT NULL,
      password TEXT NOT NULL
      
    )`, (err) => {
      if (err) {
        console.error('Error creating table:', err.message);
      }
    });
    db.run(`CREATE TABLE IF NOT EXISTS seller_accounts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      email TEXT NOT NULL,
      password TEXT NOT NULL
      
    )`, (err) => {
      if (err) {
        console.error('Error creating table:', err.message);
      }
    });

  }
});

db.all("SELECT * FROM sell_items", (err, rows) => {
  if (err) {
      console.error(err.message);
      return;
  }

  rows.forEach((row) => {
      const newImagePath = row.imagepath.replace('public/', ''); // Remove 'public/' from the image path

      // Update the database with the new image path
      db.run(`UPDATE sell_items SET imagepath = ? WHERE id = ?`, [newImagePath, row.id], function(err) {
          if (err) {
              console.error('Error updating image path:', err.message);
          } else {
              console.log(`Updated image path for item ID ${row.id}`);
          }
      });
  });
});


module.exports = db;