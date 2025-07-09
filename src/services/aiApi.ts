import axios from 'axios';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

export const generateSummary = async (content: string): Promise<string> => {
  try {
    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a professional news summarizer. Provide a concise, objective summary of the given article in 2-3 sentences.',
          },
          {
            role: 'user',
            content: `Please summarize this article: ${content}`,
          },
        ],
        max_tokens: 150,
        temperature: 0.3,
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw new Error('Failed to generate summary');
  }
};

export const analyzeSentiment = async (text: string): Promise<{ sentiment: 'positive' | 'neutral' | 'negative'; score: number }> => {
  try {
    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a sentiment analysis expert. Analyze the sentiment of the given text and respond with ONLY a JSON object containing "sentiment" (positive/neutral/negative) and "score" (0-100 where 0 is very negative, 50 is neutral, 100 is very positive).',
          },
          {
            role: 'user',
            content: `Analyze the sentiment of this text: ${text}`,
          },
        ],
        max_tokens: 50,
        temperature: 0.1,
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const result = JSON.parse(response.data.choices[0].message.content.trim());
    return {
      sentiment: result.sentiment,
      score: result.score,
    };
  } catch (error) {
    console.error('Sentiment Analysis Error:', error);
    // Fallback simple sentiment analysis
    const lowerText = text.toLowerCase();
    const positiveWords = ['good', 'great', 'excellent', 'positive', 'success', 'win', 'breakthrough'];
    const negativeWords = ['bad', 'terrible', 'negative', 'fail', 'crisis', 'problem', 'danger'];
    
    const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length;
    const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length;
    
    if (positiveCount > negativeCount) {
      return { sentiment: 'positive', score: 70 };
    } else if (negativeCount > positiveCount) {
      return { sentiment: 'negative', score: 30 };
    } else {
      return { sentiment: 'neutral', score: 50 };
    }
  }
};