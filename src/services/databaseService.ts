import { AnalyzedArticle } from '../types';

export const API_BASE_URL = 'http://localhost:3001/api';

export const saveAnalyzedArticle = async (article: AnalyzedArticle): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/analyzed-articles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(article),
    });

    if (!response.ok) {
      throw new Error('Failed to save article');
    }
  } catch (error) {
    console.error('Database save error:', error);
    throw new Error('Failed to save analyzed article');
  }
};

export const getAnalyzedArticles = async (): Promise<AnalyzedArticle[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/analyzed-articles`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch articles');
    }

    const articles = await response.json();
    return articles.map((article: any) => ({
      ...article,
      id: article._id,
    }));
  } catch (error) {
    console.error('Database fetch error:', error);
    throw new Error('Failed to fetch analyzed articles');
  }
};

export const deleteAnalyzedArticle = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/analyzed-articles/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete article');
    }
  } catch (error) {
    console.error('Database delete error:', error);
    throw new Error('Failed to delete analyzed article');
  }
};