// src/components/NewsReportPage.tsx
import React, { useState } from 'react';
import './NewsReportPage.css';

interface NewsArticle {
    title: string;
    description: string;
    url: string;
    urlToImage: string;
    publishedAt: string;
    source: {
        name: string;
    };
}

interface NewsReportPageProps {
    onNavigate: (page: string) => void;
}

const NewsReportPage: React.FC<NewsReportPageProps> = ({ onNavigate }) => {
    const [articles, setArticles] = useState<NewsArticle[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [query, setQuery] = useState<string>('');

    const API_KEY = import.meta.env.VITE_NEWS_API_KEY;

    const fetchNews = async () => {
        if (!query.trim()) return;
        setLoading(true);
        setError(null);
        setArticles([]);

        const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&apiKey=${API_KEY}`;

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Failed to fetch news.');
            const data = await response.json();
            setArticles(data.articles);
        } catch (err: any) {
            setError(err.message || 'Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') fetchNews();
    };

    return (
        <div className="news-page">
            <button onClick={() => onNavigate('')} className="back-button">&larr; Back to Home</button>
            <h1 className="news-title">Search News by Keyword</h1>

            <div className="search-section">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Enter keyword (e.g. technology, health, sports...)"
                />
                <button onClick={fetchNews} className="search-button">Search</button>
            </div>

            {loading && <p className="loading">Loading news...</p>}
            {error && <p className="error">{error}</p>}

            <div className="news-grid">
                {articles.map((article, index) => (
                    <div key={index} className="news-card">
                        {article.urlToImage && <img src={article.urlToImage} alt={article.title} className="news-image" />}
                        <div className="news-content">
                            <h2 className="news-headline">{article.title}</h2>
                            <p className="news-description">{article.description}</p>
                            <a href={article.url} target="_blank" rel="noopener noreferrer" className="read-more">Read more</a>
                            <p className="news-meta">{new Date(article.publishedAt).toLocaleString()} - {article.source.name}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NewsReportPage;