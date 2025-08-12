// src/components/HomePage.tsx
import React from 'react';
import './HomePage.css';

interface HomePageProps {
    onNavigate: (page: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
    return (
        <div className="home-container">
            <nav className="navbar">
                <h1 className="nav-title">My Projects Hub</h1>
            </nav>

            <div className="card-container">
                <div className="feature-card" onClick={() => onNavigate('weather')}>
                    <h2>Weather Report</h2>
                    <p>Check the current weather of any city with detailed insights.</p>
                </div>

                <div className="feature-card" onClick={() => onNavigate('news')}>
                    <h2>News Search</h2>
                    <p>Search for global news articles by keyword. Powered by NewsAPI.</p>
                </div>

                <div className="feature-card" onClick={() => onNavigate('firecrawl')}>
                    <h2>Firecrawl Web Analyzer</h2>
                    <p>Paste a link and get an AI-powered insight into the page content.</p>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
