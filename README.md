# Smart Reviewer for Aries

This is a news analysis application that allows users to search for news articles, generate summaries, and perform sentiment analysis.

Had there been more time I would have:

1) further broken down the App.tsx (eg. perhaps with utils folder/file for reusable behaviour)
2) Added more tests (particularly front end playwright tests)
3) Hosted the app on a free tier solution in addition to the readme installation option
4) Alongside hosting I would store the api credentials in a vault of sorts
5) Further optimise the initial application boot-up time

## Features

- **News Search**: Search for recent news articles using GNews API
- **AI Summarization**: Generate concise summaries using OpenAI 
- **Sentiment Analysis**: Analyze article sentiment with AI-powered scoring
- **Database Storage**: Store and retrieve analyzed articles with MongoDB
- **Beautiful UI**: Modern, responsive design with smooth animations
- **Real-time Updates**: Live search and analysis results

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB installed and running locally

### 1. MongoDB Setup
Make sure MongoDB is running on your system:

```bash
# macOS (if installed via Homebrew)
brew services start mongodb-community

# Windows
# Start MongoDB service from Services or run mongod.exe

# Linux
sudo systemctl start mongodb
# or
sudo service mongodb start
```

### 2. Environment Variables
Copy `.env.example` to `.env` and fill in your API keys:

```bash
cp .env.example .env
```

Update the `.env` file:
```
VITE_GNEWS_API_KEY=gnews_api_key
VITE_OPENAI_API_KEY=openai_api_key
MONGODB_URI=mongodb://localhost:27017
```

### 3. API Keys Required
- **GNews API**: [GNews.io](https://gnews.io/)
- **OpenAI API**:  [OpenAI](https://platform.openai.com/)

### 4. Install Dependencies
```bash
npm install
```

### 5. Start the Application
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## DB

The application uses MongoDB with a single collection:

### `analyzed_articles` Collection
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  url: String,
  image: String,
  published_at: Date,
  source: String,
  summary: String,
  sentiment: String, // 'positive', 'neutral', 'negative'
  sentiment_score: Number, // 0-100
  analyzed_at: Date,
  created_at: Date
}
```

## Usage

1. **Search for News**: Use the search bar to find articles on any topic
2. **View Trending**: Click "View Trending News" to see current headlines
3. **Analyze Articles**: Click "Analyze" on any article to generate AI summary and sentiment
4. **View Results**: Switch to the "Analyzed Articles" tab to see your saved analyses

## Technology Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Database**: MongoDB
- **APIs**: GNews.io, OpenAI 
- **Build Tool**: Vite
- **Icons**: Lucide React

## Architecture

The application follows a clean, modular architecture:

- **Components**: Reusable UI components with proper separation of concerns
- **Services**: API integration layers for news, AI, and database operations
- **Types**: TypeScript interfaces for type safety
- **Hooks**: Custom hooks for state management and local storage

## API Integration

- **News API**: Fetches articles with search and trending endpoints
- **AI API**: Generates summaries and analyzes sentiment
- **Database**: Stores and retrieves analyzed articles with full CRUD operations

## Error Handling

- Comprehensive error boundaries and user feedback
- Fallback sentiment analysis for API failures
- Graceful degradation for network issues
- User-friendly error messages with retry options

## MongoDB Connection

The application automatically connects to MongoDB when needed and handles connection management. Make sure your MongoDB service is running before starting the application.