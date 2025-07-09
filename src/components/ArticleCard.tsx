import React from 'react';
import { format } from 'date-fns';
import { ExternalLink, Sparkles } from 'lucide-react';
import { NewsArticle } from '../types';

interface ArticleCardProps {
  article: NewsArticle;
  onAnalyze: (article: NewsArticle) => void;
  analyzing: boolean;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article, onAnalyze, analyzing }) => {
  const handleAnalyze = () => {
    onAnalyze(article);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      {article.image && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <span className="text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
            {article.source.name}
          </span>
          <span className="text-sm text-gray-500">
            {format(new Date(article.publishedAt), 'MMM d, yyyy')}
          </span>
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 leading-tight">
          {article.title}
        </h3>
        
        <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
          {article.description}
        </p>
        
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
          
          <button
            onClick={handleAnalyze}
            disabled={analyzing}
            className="inline-flex items-center px-4 py-2 bg-amber-600 text-white rounded-xl hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            {analyzing ? 'Analyzing...' : 'Analyze'}
          </button>
        </div>
      </div>
    </div>
  );
};