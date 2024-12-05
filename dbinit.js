const mongoose = require('mongoose');
const {Product} = require('./model'); 
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', async () => {
  console.log('Connected to the database');

  // Dummy product data
  const products = [
    {
      name: "Product One",
      quantity: 10,
      price: 29.99,
      image: "https://m.media-amazon.com/images/I/619gDUPcbNL.jpg"
    },
    {
      name: "Product Two",
      quantity: 20,
      price: 49.99,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBuLVIT-McQjUFzDxbxYMUY-gBqysWig7yOQ&s"
    },
    {
      name: "Product Three",
      quantity: 30,
      price: 19.99,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVhjb1qg9a2qIGmWHyC___lCkD_CbWGdUB1g&s"
    },
    {
      name: "Product Three",
      quantity: 30,
      price: 19.99,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR23hVJDRwORZETPdBEX3aXkWXKwAW2wmWDlg&s"
    },
    {
      name: "Product Three",
      quantity: 30,
      price: 19.99,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0LoNZUBs37fa3uPVDpXmdsiU3OWFnIfPcxA&s"
    },
    {
      name: "Product Three",
      quantity: 30,
      price: 19.99,
      image: "https://i.pinimg.com/736x/62/1b/be/621bbe3e4131d20e3bbaeb7868578204.jpg"
    }
  ];

  try {
    // Clear existing products
    await Product.deleteMany({});
    console.log('Existing products removed');

    // Insert dummy products
    await Product.insertMany(products);
    console.log('Dummy products inserted');

    // Close the database connection
    mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error inserting dummy products:', error);
  }
});