import {
  saveAnalyzedArticle,
  getAnalyzedArticles,
  deleteAnalyzedArticle,
  API_BASE_URL
} from '../../src/services/databaseService';
import fetchMock from 'jest-fetch-mock';

import { AnalyzedArticle } from '../../src/types';

beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

beforeEach(() => {
  fetchMock.resetMocks();
});

describe('saveAnalyzedArticle', () => {
  it('should make a POST request and not throw on success', async () => {
    fetchMock.mockResponseOnce('', { status: 200 });

    const article: AnalyzedArticle = {
        id: '1',
        title: 'Test Article',
        summary: 'Summary here',
        description: '',
        url: '',
        image: '',
        published_at: '',
        source: '',
        sentiment: 'positive',
        sentiment_score: 0,
        analyzed_at: ''
    };

    await expect(saveAnalyzedArticle(article)).resolves.toBeUndefined();

    expect(fetch).toHaveBeenCalledWith(
      `${API_BASE_URL}/analyzed-articles`,
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(article),
      })
    );
  });

  it('should throw an error if response is not ok', async () => {
    fetchMock.mockResponseOnce('', { status: 500 });

    const article: AnalyzedArticle = {
        id: '1',
        title: 'Bad Article',
        summary: 'Bad',
        description: '',
        url: '',
        image: '',
        published_at: '',
        source: '',
        sentiment: 'positive',
        sentiment_score: 0,
        analyzed_at: ''
    };

    await expect(saveAnalyzedArticle(article)).rejects.toThrow('Failed to save analyzed article');
  });
});

describe('getAnalyzedArticles', () => {
  it('should return mapped articles', async () => {
    const mockArticles = [
      { _id: '1', title: 'A', content: 'B', summary: 'C', tags: ['x'] },
    ];

    fetchMock.mockResponseOnce(JSON.stringify(mockArticles), { status: 200 });

    const result = await getAnalyzedArticles();
    expect(result).toEqual([
      { id: '1',  _id: '1', title: 'A', content: 'B', summary: 'C', tags: ['x'] },
    ]);
  });

  it('should throw on failed fetch', async () => {
    fetchMock.mockResponseOnce('', { status: 404 });
    await expect(getAnalyzedArticles()).rejects.toThrow('Failed to fetch analyzed articles');
  });
});

describe('deleteAnalyzedArticle', () => {
  it('should make a DELETE request and not throw on success', async () => {
    fetchMock.mockResponseOnce('', { status: 200 });

    await expect(deleteAnalyzedArticle('123')).resolves.toBeUndefined();

    expect(fetch).toHaveBeenCalledWith(
      `${API_BASE_URL}/analyzed-articles/123`,
      expect.objectContaining({ method: 'DELETE' })
    );
  });

  it('should throw if DELETE fails', async () => {
    fetchMock.mockResponseOnce('', { status: 500 });
    await expect(deleteAnalyzedArticle('bad-id')).rejects.toThrow('Failed to delete analyzed article');
  });
});
