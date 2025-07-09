import express from 'express';
import cors from 'cors';
import { MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = 'smart_reviewer';

// Middleware
app.use(cors());
app.use(express.json());

let db;

// Connect to MongoDB
MongoClient.connect(MONGODB_URI)
  .then(client => {
    console.log('Connected to MongoDB');
    db = client.db(DB_NAME);
  })
  .catch(error => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });

// Routes
app.get('/api/analyzed-articles', async (req, res) => {
  try {
    const articles = await db.collection('analyzed_articles')
      .find({})
      .sort({ analyzed_at: -1 })
      .toArray();
    
    res.json(articles);
  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).json({ error: 'Failed to fetch articles' });
  }
});

app.post('/api/analyzed-articles', async (req, res) => {
  try {
    const article = {
      ...req.body,
      created_at: new Date(),
      analyzed_at: new Date(req.body.analyzed_at)
    };
    
    const result = await db.collection('analyzed_articles').insertOne(article);
    res.json({ id: result.insertedId, ...article });
  } catch (error) {
    console.error('Error saving article:', error);
    res.status(500).json({ error: 'Failed to save article' });
  }
});

app.delete('/api/analyzed-articles/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection('analyzed_articles').deleteOne({ _id: new ObjectId(id) });
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting article:', error);
    res.status(500).json({ error: 'Failed to delete article' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});