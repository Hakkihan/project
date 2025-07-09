import React from 'react';
import { format } from 'date-fns';
import { ExternalLink, Trash2, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { AnalyzedArticle } from '../types';
import { clsx } from 'clsx';

interface AnalyzedArticleCardProps {
  article: AnalyzedArticle;
  onDelete: (id: string) => void;
}

export const AnalyzedArticleCard: React.FC<AnalyzedArticleCardProps> = ({ article, onDelete }) => {
  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return <TrendingUp className="w-5 h-5" />;
      case 'negative':
        return <TrendingDown className="w-5 h-5" />;
      default:
        return <Minus className="w-5 h-5" />;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'text-emerald-600 bg-emerald-50';
      case 'negative':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-amber-600 bg-amber-50';
    }
  };

  const handleDelete = () => {
    if (article.id) {
      onDelete(article.id);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      {article.image && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              {article.source}
            </span>
            <div className={clsx(
              'flex items-center space-x-1 text-sm font-medium px-3 py-1 rounded-full',
              getSentimentColor(article.sentiment)
            )}>
              {getSentimentIcon(article.sentiment)}
              <span className="capitalize">{article.sentiment}</span>
              <span className="text-xs">({article.sentiment_score})</span>
            </div>
          </div>
          <button
            onClick={handleDelete}
            className="text-red-500 hover:text-red-700 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 leading-tight">
          {article.title}
        </h3>
        
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">AI Summary:</h4>
          <p className="text-gray-600 leading-relaxed">
            {article.summary}
          </p>
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <span>Published: {format(new Date(article.published_at), 'MMM d, yyyy')}</span>
          <span>Analyzed: {format(new Date(article.analyzed_at), 'MMM d, yyyy')}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            Read Full Article
            <ExternalLink className="w-4 h-4 ml-1" />
          </a>
        </div>
      </div>
    </div>
  );
};