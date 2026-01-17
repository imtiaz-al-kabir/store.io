const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });
const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = 4000;

// Use env var or default to local
const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
// Log the URI (masking password if present) for debugging
const maskedUri = uri.replace(/:([^:@]{1,})@/, ':****@');
console.log(`Attempting to connect to MongoDB at: ${maskedUri}`);

const client = new MongoClient(uri);
const dbName = 'job-task';

app.use(cors());
app.use(express.json());

let db;
let itemsCollection;
let usersCollection;

// Initial Mock Data to Seed
const initialItems = [
  {
    name: 'Modern Lamp',
    description: 'A sleek and modern desk lamp for your workspace.',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&auto=format&fit=crop&q=60'
  },
  {
    name: 'Ergonomic Chair',
    description: 'Comfortable chair designed for long hours of work.',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=500&auto=format&fit=crop&q=60'
  },
  {
    name: 'Mechanical Keyboard',
    description: 'Clicky mechanical keyboard with RGB lighting.',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=500&auto=format&fit=crop&q=60'
  },
  {
    name: 'Wireless Mouse',
    description: 'Precision wireless mouse with long battery life.',
    price: 39.99,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&auto=format&fit=crop&q=60'
  },
  {
    name: 'Noise Cancelling Headphones',
    description: 'Immersive sound with active noise cancellation.',
    price: 299.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60'
  }
];

async function connectDB() {
  try {
    await client.connect();
    console.log("Connected successfully to MongoDB");
    db = client.db(dbName);
    itemsCollection = db.collection('products');
    usersCollection = db.collection('users');

    // Seed if empty
    const count = await itemsCollection.countDocuments();
    if (count === 0) {
      console.log("Seeding initial data...");
      await itemsCollection.insertMany(initialItems);
    }
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
}

connectDB();

app.get('/items', async (req, res) => {
  try {
    const items = await itemsCollection.find({}).toArray();
    // Start mapping _id to id for frontend compatibility
    const formattedItems = items.map(item => ({
      ...item,
      id: item._id.toString()
    }));
    res.json(formattedItems);
  } catch (err) {
    res.status(500).json({ message: "Error fetching items" });
  }
});

app.get('/items/:id', async (req, res) => {
  try {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
    const item = await itemsCollection.findOne({ _id: new ObjectId(id) });
    if (item) {
      res.json({ ...item, id: item._id.toString() });
    } else {
      res.status(404).json({ message: 'Item not found' });
    }
  } catch (err) {
    res.status(500).json({ message: "Error fetching item" });
  }
});

app.post('/items', async (req, res) => {
  try {
    const result = await itemsCollection.insertOne(req.body);
    res.status(201).json({ ...req.body, id: result.insertedId.toString() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error adding item" });
  }
});

// Fix broken image URLs in existing items
app.patch('/items/fix-images', async (req, res) => {
  try {
    const brokenUrl = 'https://images.unsplash.com/photo-1587829741301-dc798b91a603?w=500&auto=format&fit=crop&q=60';
    const fixedUrl = 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=500&auto=format&fit=crop&q=60';
    
    const result = await itemsCollection.updateMany(
      { image: brokenUrl },
      { $set: { image: fixedUrl } }
    );
    
    res.json({ message: `Updated ${result.modifiedCount} items with fixed image URL` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fixing images" });
  }
});

// Authentication Routes
app.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      name,
      email,
      password: hashedPassword,
      createdAt: new Date()
    };

    const result = await usersCollection.insertOne(newUser);
    res.status(201).json({ message: 'User registered successfully', userId: result.insertedId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error registering user' });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await usersCollection.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json({
      id: user._id,
      name: user.name,
      email: user.email
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error logging in' });
  }
});

// Save OAuth users (Google, Mock, etc.) to database
app.post('/save-oauth-user', async (req, res) => {
  try {
    const { name, email, image, provider } = req.body;

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email });

    if (!existingUser) {
      // Create new user from OAuth/Mock profile
      const result = await usersCollection.insertOne({
        name,
        email,
        image: image || null,
        provider: provider || 'credentials',
        createdAt: new Date()
      });
      console.log(`New ${provider || 'user'} saved to database:`, email);
      res.status(201).json({ message: 'User saved', userId: result.insertedId });
    } else {
      res.json({ message: 'User already exists', userId: existingUser._id });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error saving user' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
