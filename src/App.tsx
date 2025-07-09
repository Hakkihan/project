import React, { useState, useEffect } from 'react';
import { Brain, Database, Newspaper } from 'lucide-react';
import { SearchBar } from './components/SearchBar';
import { ArticleCard } from './components/ArticleCard';
import { AnalyzedArticleCard } from './components/AnalyzedArticleCard';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage';
import { searchNews, getTrendingNews } from './services/newsApi';
import { generateSummary, analyzeSentiment } from './services/aiApi';
import { saveAnalyzedArticle, getAnalyzedArticles, deleteAnalyzedArticle } from './services/databaseService';
import { NewsArticle, AnalyzedArticle, SearchState, AnalysisState } from './types';

function App() {
  const [activeTab, setActiveTab] = useState<'search' | 'analyzed'>('search');
  const [searchState, setSearchState] = useState<SearchState>({
    query: '',
    articles: [],
    loading: false,
    error: null,
  });
  const [analysisState, setAnalysisState] = useState<AnalysisState>({
    analyzing: false,
    error: null,
  });
  const [analyzedArticles, setAnalyzedArticles] = useState<AnalyzedArticle[]>([]);
  const [loadingAnalyzed, setLoadingAnalyzed] = useState(false);

  useEffect(() => {
    if (activeTab === 'analyzed') {
      loadAnalyzedArticles();
    }
  }, [activeTab]);

  const loadAnalyzedArticles = async () => {
    setLoadingAnalyzed(true);
    try {
      const articles = await getAnalyzedArticles();
      setAnalyzedArticles(articles);
    } catch (error) {
      console.error('Failed to load analyzed articles:', error);
    } finally {
      setLoadingAnalyzed(false);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const articles = await searchNews(query);
      setSearchState(prev => ({ ...prev, articles, query, loading: false }));
    } catch (error) {
      setSearchState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : 'An error occurred' 
      }));
    }
  };

  const handleTrending = async () => {
    setSearchState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const articles = await getTrendingNews();
      setSearchState(prev => ({ ...prev, articles, query: 'Trending News', loading: false }));
    } catch (error) {
      setSearchState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : 'An error occurred' 
      }));
    }
  };

  const handleAnalyze = async (article: NewsArticle) => {
    setAnalysisState({ analyzing: true, error: null });
    try {
      const [summary, sentimentResult] = await Promise.all([
        generateSummary(article.content || article.description),
        analyzeSentiment(article.title + ' ' + article.description),
      ]);

      const analyzedArticle: AnalyzedArticle = {
        title: article.title,
        description: article.description,
        url: article.url,
        image: article.image,
        published_at: article.publishedAt,
        source: article.source.name,
        summary,
        sentiment: sentimentResult.sentiment,
        sentiment_score: sentimentResult.score,
        analyzed_at: new Date().toISOString(),
      };

      await saveAnalyzedArticle(analyzedArticle);
      setAnalysisState({ analyzing: false, error: null });
      
      // Show success message or switch to analyzed tab
      setActiveTab('analyzed');
      await loadAnalyzedArticles();
    } catch (error) {
      setAnalysisState({ 
        analyzing: false, 
        error: error instanceof Error ? error.message : 'An error occurred during analysis' 
      });
    }
  };

  const handleDeleteAnalyzed = async (id: string) => {
    try {
      await deleteAnalyzedArticle(id);
      await loadAnalyzedArticles();
    } catch (error) {
      console.error('Failed to delete article:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Brain className="w-8 h-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Smart Reviewer</h1>
            </div>
            <nav className="flex space-x-1">
              <button
                onClick={() => setActiveTab('search')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'search'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Newspaper className="w-4 h-4 inline mr-2" />
                Search News
              </button>
              <button
                onClick={() => setActiveTab('analyzed')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'analyzed'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Database className="w-4 h-4 inline mr-2" />
                Analyzed Articles
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'search' ? (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Discover & Analyze News
              </h2>
              <p className="text-xl text-gray-600">
                Search for news articles and get AI-powered summaries and sentiment analysis
              </p>
            </div>

            <SearchBar
              onSearch={handleSearch}
              onTrending={handleTrending}
              loading={searchState.loading}
            />

            {/* Analysis Error */}
            {analysisState.error && (
              <div className="mt-6">
                <ErrorMessage message={analysisState.error} />
              </div>
            )}

            {/* Search Results */}
            {searchState.loading && <LoadingSpinner />}
            
            {searchState.error && (
              <ErrorMessage
                message={searchState.error}
                onRetry={() => searchState.query && handleSearch(searchState.query)}
              />
            )}

            {searchState.articles.length > 0 && (
              <div className="mt-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Search Results ({searchState.articles.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {searchState.articles.map((article, index) => (
                    <ArticleCard
                      key={index}
                      article={article}
                      onAnalyze={handleAnalyze}
                      analyzing={analysisState.analyzing}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Analyzed Articles
              </h2>
              <p className="text-xl text-gray-600">
                View your analyzed articles with AI-generated summaries and sentiment scores
              </p>
            </div>

            {loadingAnalyzed && <LoadingSpinner />}

            {!loadingAnalyzed && analyzedArticles.length === 0 && (
              <div className="text-center py-12">
                <Database className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  No analyzed articles yet
                </h3>
                <p className="text-gray-500">
                  Start by searching for news articles and analyzing them!
                </p>
              </div>
            )}

            {analyzedArticles.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {analyzedArticles.map((article) => (
                  <AnalyzedArticleCard
                    key={article.id}
                    article={article}
                    onDelete={handleDeleteAnalyzed}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;