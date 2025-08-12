// src/App.tsx
import React, { useState } from 'react';
import HomePage from './components/HomePage';
import WeatherReportPage from './components/WeatherReportPage';
import NewsReportPage from './components/NewsReportPage';
import FirecrawlPage from './components/FirecrawlPage';

const App: React.FC = () => {
    const [page, setPage] = useState<string>('home');

    const handleNavigate = (nextPage: string) => {
        setPage(nextPage);
    };

    switch (page) {
        case 'weather':
            return <WeatherReportPage onNavigate={handleNavigate} />;
        case 'news':
            return <NewsReportPage onNavigate={handleNavigate} />;
        case 'firecrawl':
            return <FirecrawlPage onNavigate={handleNavigate} />;
        default:
            return <HomePage onNavigate={handleNavigate} />;
    }
};

export default App;
