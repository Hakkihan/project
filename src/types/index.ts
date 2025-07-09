export interface NewsArticle {
  title: string;
  description: string;
  content: string;
  url: string;
  image: string;
  publishedAt: string;
  source: {
    name: string;
    url: string;
  };
}

export interface AnalyzedArticle {
  id?: string;
  title: string;
  description: string;
  url: string;
  image: string;
  published_at: string;
  source: string;
  summary: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  sentiment_score: number;
  analyzed_at: string;
}

export interface SearchState {
  query: string;
  articles: NewsArticle[];
  loading: boolean;
  error: string | null;
}

export interface AnalysisState {
  analyzing: boolean;
  error: string | null;
}