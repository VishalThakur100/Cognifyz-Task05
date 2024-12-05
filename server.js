const express = require("express");
const mongoose = require("mongoose");
const {Product} = require("./model");
const jwt = require('jsonwebtoken');
const {User} = require("./model.js");
const bcrypt = require("bcryptjs");

const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 3000;
const session = require('express-session');
const cookieParser = require('cookie-parser');


app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true
}));

app.use(session({
  secret: process.env.SESSION_SECRET || 'your_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } 
}));



const protect = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized' });
  }
};


async function testPassword() {
  const password = 'abc123'; 
  const hashedPassword = '$2a$10$VHSH04foOJZTY8x3IfM8wewbCsUXWSX/IW4e.W66ypmzzyl160RMi'; 

  const isMatch = await bcrypt.compare(password, hashedPassword);
  console.log('Password match:', isMatch); 
}

testPassword();


app.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  // password = password.trim();
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }
  try {
    const existingUser = await User.findOne({ username }); 
    if (existingUser) {
      return res.status(400).json({ message: 'Username already in use' });
    }
    // const hashedPassword = await bcrypt.hash(password, 10);
    // console.log('Hashed Password:', hashedPassword);
    // const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    const token = jwt.sign({ _id: newUser._id, username: newUser.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    res.status(201).json({ message: 'Signup successful' });
  } catch (error) {
    console.error('Error during user signup:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }
  
  try {
    const user = await User.findOne({ username });
    if (!user) {
      // console.error('Login error: User not found');
      return res.status(401).json({ message: 'Invalid username or password' });
    }
    
    console.log('Stored Hashed Password:', user.password);
    const isMatch = await bcrypt.compare(String(password).trim(), user.password);
    if (!isMatch) {
      // console.error('Login error: Password does not match');
      return res.status(401).json({ message: 'Invalid username or password' });
    }
    
    const token = jwt.sign(
      { _id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    ); 
       res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    res.json({ message: 'Login successful', token });
  } catch (error) {
    // console.error('Error during user login:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get("/products",protect, async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Secure your existing routes
app.post("/products",protect, async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    // console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});

app.get("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// update a product
app.put("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body);
    if (!product) {
      return res
        .status(404)
        .json({ message: `cannot find any product with ID ${id}` });
    }
    const updatedProduct = await Product.findById(id);
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// delete a product
app.delete("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res
        .status(404)
        .json({ message: `cannot find any product with ID ${id}` });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("connected to MongoDB");
    app.listen(3000, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });
