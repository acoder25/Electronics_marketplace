const express = require('express');
const multer=require('multer');
const cors = require('cors');
const path = require('path');
const bodyParser=require('body-parser');
const db=require('./database');

const app = express();
const PORT = 5000;

// Enable CORS for all routes
app.use(cors({
  origin: 'http://localhost:3001', 
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));
app.use(bodyParser.json());

app.get('/api', (req, res) => {
  res.json({ message: 'Hello from the Express server!' });
  
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'public/images'); // Save to this folder
  },
  filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname); // Unique filename
  },
});
const upload = multer({ storage });
app.use('/images', express.static(path.join(__dirname, 'public/images')));
app.post('/api/add_items',upload.single('file'),(req,res)=>{
  const { email,type, model, year, storage, ram, screenCondition, batteryHealth, physicalCondition,price, accessoriesIncluded } = req.body;
  const imagepath = req.file ? `images/${req.file.filename}` : null;

  const query='INSERT INTO sell_items (email,type, model, year, storage, ram, screenCondition, batteryHealth, physicalCondition,price, accessoriesIncluded,imagepath) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)';

  db.run(query,[email,type, model, year, storage, ram, screenCondition, batteryHealth, physicalCondition,price, accessoriesIncluded,imagepath],function(err){
    if (err) {
      console.error('Error executing query:', query, err.message);
      return res.status(500).json({ error: 'Failed to add device' });
    }
    res.status(201).json({ message: 'Device added successfully',id:this.lastID}); 
     
  });
    
});

app.post('/api/create-account', (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({error:"values of allfields are required"});
      
    }
  
    const query = `INSERT INTO accounts (username, email, password) VALUES (?, ?, ?)`;
    db.run(query, [username, email, password], function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to create account' });
      }
      res.status(201).json({ message: 'Account created successfully'});
    });
});
app.post('/api/create-account-seller', (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({error:"values of allfields are required"});
    
  }

  const query = `INSERT INTO seller_accounts (username, email, password) VALUES (?, ?, ?)`;
  db.run(query, [username, email, password], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to create account' });
    }
    res.status(201).json({ message: 'Account created successfully'});
  });
});
app.post('/api/login_sell',(req,res)=>{
    const {email,password}=req.body;

    if(!email ||!password){
       return res.status(400).json({error:"all fields are required"});
    }

    const query='SELECT * FROM seller_accounts WHERE email=? AND password=?';
    db.get(query,[email,password],(err,row)=>{
      if(err){
        return res.status(500).json({error:"failed to login"});
      }
      if(row){
        return res.status(200).json({message:"Login successful",user:row});

      }
      else{
         return res.status(401).json({error:"Invalid email or password"});
      }
    })
});

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
  
    const query = `SELECT * FROM accounts WHERE email = ? AND password = ?`;
    db.get(query, [email, password], (err, row) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to login' });
      }
      if (row) {
        res.status(200).json({ message: 'Login successful', user: row });
      } else {
        res.status(401).json({ error: 'Invalid email or password' });
      }
    });
});


app.post('/api/get_items_specific',(req,res)=>{
  const {email}=req.body;

  const query=`SELECT * FROM sell_items WHERE email = ?`;
  db.all(query,[email],(err,rows)=>{
       if(err){
         return res.status(400).json({error:'Failed to fetch items in catalogue'});
       }
       res.status(200).json(rows);
  });


});

app.use(express.static(path.join(__dirname, '../client/public')));

// Example API route


// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/public/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});