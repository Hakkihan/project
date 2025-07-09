import axios from 'axios';
import { generateSummary, analyzeSentiment } from '../../src/services/aiApi';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});


describe('generateSummary', () => {
  it('should return trimmed summary from OpenAI response', async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: {
        choices: [
          {
            message: {
              content: '  This is a summary.  '
            }
          }
        ]
      }
    });

    const result = await generateSummary('Test article content');
    expect(result).toBe('This is a summary.');

    expect(mockedAxios.post).toHaveBeenCalledWith(
      'https://api.openai.com/v1/chat/completions',
      expect.objectContaining({
        model: 'gpt-3.5-turbo',
        messages: expect.any(Array),
        max_tokens: 150,
        temperature: 0.3,
      }),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: expect.stringContaining('Bearer '),
        }),
      })
    );
  });

  it('should throw on API failure', async () => {
    mockedAxios.post.mockRejectedValueOnce(new Error('API failed'));

    await expect(generateSummary('Bad input')).rejects.toThrow('Failed to generate summary');
  });
});

describe('analyzeSentiment', () => {
  it('should return parsed sentiment result from OpenAI', async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: {
        choices: [
          {
            message: {
              content: JSON.stringify({
                sentiment: 'positive',
                score: 85,
              }),
            },
          },
        ],
      },
    });

    const result = await analyzeSentiment('Great news for the company!');
    expect(result).toEqual({ sentiment: 'positive', score: 85 });
  });

  it('should fall back to manual analysis on API error - positive', async () => {
    mockedAxios.post.mockRejectedValueOnce(new Error('OpenAI down'));

    const result = await analyzeSentiment('This is a great success and a breakthrough!');
    expect(result).toEqual({ sentiment: 'positive', score: 70 });
  });

  it('should fall back to manual analysis on API error - negative', async () => {
    mockedAxios.post.mockRejectedValueOnce(new Error('OpenAI down'));

    const result = await analyzeSentiment('This is a terrible crisis and a problem!');
    expect(result).toEqual({ sentiment: 'negative', score: 30 });
  });

  it('should fall back to manual analysis on API error - neutral', async () => {
    mockedAxios.post.mockRejectedValueOnce(new Error('OpenAI down'));

    const result = await analyzeSentiment('The article discusses weather patterns and temperature.');
    expect(result).toEqual({ sentiment: 'neutral', score: 50 });
  });
});
