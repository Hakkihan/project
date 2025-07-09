import axios from 'axios';
import { NewsArticle } from '../types';

const NEWS_API_KEY = import.meta.env.VITE_GNEWS_API_KEY;
const NEWS_API_URL = 'https://gnews.io/api/v4/search';

export const searchNews = async (query: string, max: number = 10): Promise<NewsArticle[]> => {
  try {
    const response = await axios.get(NEWS_API_URL, {
      params: {
        q: query,
        token: NEWS_API_KEY,
        lang: 'en',
        country: 'us',
        max,
      },
    });

    return response.data.articles.map((article: any) => ({
      title: article.title,
      description: article.description,
      content: article.content,
      url: article.url,
      image: article.image,
      publishedAt: article.publishedAt,
      source: {
        name: article.source.name,
        url: article.source.url,
      },
    }));
  } catch (error) {
    console.error('News API Error:', error);
    throw new Error('Failed to fetch news articles');
  }
};

export const getTrendingNews = async (): Promise<NewsArticle[]> => {
  try {
    const response = await axios.get('https://gnews.io/api/v4/top-headlines', {
      params: {
        token: NEWS_API_KEY,
        lang: 'en',
        country: 'us',
        max: 10,
      },
    });

    return response.data.articles.map((article: any) => ({
      title: article.title,
      description: article.description,
      content: article.content,
      url: article.url,
      image: article.image,
      publishedAt: article.publishedAt,
      source: {
        name: article.source.name,
        url: article.source.url,
      },
    }));
  } catch (error) {
    console.error('Trending News API Error:', error);
    throw new Error('Failed to fetch trending news');
  }
};