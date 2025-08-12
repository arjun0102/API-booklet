// src/components/FirecrawlPage.tsx
import React, { useState } from 'react';
import './FirecrawlPage.css';

interface FirecrawlPageProps {
  onNavigate: (page: string) => void;
}

interface FirecrawlResponse {
  title?: string;
  description?: string;
  summary?: string;
  url?: string;
}

const FirecrawlPage: React.FC<FirecrawlPageProps> = ({ onNavigate }) => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<FirecrawlResponse | null>(null);

  const API_KEY = import.meta.env.VITE_FIRECRAWL_API_KEY;

  const fetchInsight = async () => {
    if (!url.trim()) return;

    setLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({ url })
      });

      if (!response.ok) throw new Error('Failed to analyze the page.');
      const result = await response.json();
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') fetchInsight();
  };

  return (
    <div className="firecrawl-page">
      <button onClick={() => onNavigate('')} className="back-button">&larr; Back to Home</button>
      <h1 className="firecrawl-title">Analyze Any Web Page</h1>

      <div className="search-section">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Enter URL (e.g. https://example.com)"
        />
        <button onClick={fetchInsight} className="search-button">Analyze</button>
      </div>

      {loading && <p className="loading">Analyzing page...</p>}
      {error && <p className="error">{error}</p>}

      {data && (
        <div className="result-card">
          {data.title && <h2>{data.title}</h2>}
          {data.description && <p><strong>Description:</strong> {data.description}</p>}
          {data.summary && <p><strong>Summary:</strong> {data.summary}</p>}
          {data.url && <a href={data.url} target="_blank" rel="noopener noreferrer">Visit Page</a>}
        </div>
      )}
    </div>
  );
};

export default FirecrawlPage;
