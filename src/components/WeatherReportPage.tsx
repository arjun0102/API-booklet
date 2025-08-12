// src/components/WeatherReportPage.tsx
import React, { useState } from 'react';
import {
    LucideThermometer,
    LucideCloud,
    LucideDroplet,
    LucideWind,
    LucideSearch
} from 'lucide-react';
import './WeatherReportPage.css';

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const API_URL = 'https://api.weatherapi.com/v1/current.json';

interface WeatherData {
    location: {
        name: string;
        region: string;
        country: string;
    };
    current: {
        temp_c: number;
        feelslike_c: number;
        condition: {
            text: string;
            icon: string;
        };
        humidity: number;
        wind_kph: number;
        gust_kph: number;
        wind_dir: string;
        cloud: number;
        pressure_mb: number;
        vis_km: number;
        uv: number;
        last_updated: string;
    };
}

interface WeatherReportPageProps {
    onNavigate: (page: string) => void;
}

const WeatherReportPage: React.FC<WeatherReportPageProps> = ({ onNavigate }) => {
    const [location, setLocation] = useState<string>('');
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [history, setHistory] = useState<WeatherData[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchWeatherData = async () => {
        if (!API_KEY || API_KEY === 'YOUR_WEATHERAPI_COM_API_KEY') {
            setError('Missing or invalid API key. Check your .env file.');
            setWeather(null);
            return;
        }

        if (location.trim() === '') {
            setError('Please enter a city name.');
            setWeather(null);
            return;
        }

        setLoading(true);
        setError(null);
        setWeather(null);

        const url = `${API_URL}?key=${API_KEY}&q=${encodeURIComponent(location)}&aqi=no`;

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Failed to fetch data.');
            const data: WeatherData = await response.json();

            if (data.location && data.current) {
                setWeather(data);
                setHistory(prev => [data, ...prev.slice(0, 2)]); // Keep only last 2 in history
            } else {
                throw new Error('City not found.');
            }
        } catch (err: any) {
            setError(err.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLocation(event.target.value);
    };

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            fetchWeatherData();
        }
    };

    const getWeatherIconUrl = (iconPath: string) => {
        return iconPath.startsWith('//') ? `https:${iconPath}` : iconPath;
    };

    return (
        <div className="weather-page">
            <div className="weather-card">
                <button onClick={() => onNavigate('')} className="back-button">
                    &larr; Back to Home
                </button>
                <h1 className="title">Weather Report</h1>

                <div className="search-section">
                    <input
                        type="text"
                        placeholder="Enter city name (e.g., London)"
                        value={location}
                        onChange={handleInputChange}
                        onKeyPress={handleKeyPress}
                    />
                    <button onClick={fetchWeatherData} className="search-button">
                        <LucideSearch size={20} /> Get Weather
                    </button>
                </div>

                {loading && (
                    <div className="loading-indicator">
                        <svg className="spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Loading weather data...
                    </div>
                )}

                {error && <p className="error-message">{error}</p>}

                {weather && (
                    <>
                        <div className="weather-details">
                            <h2 className="location-heading">
                                {weather.location.name}, {weather.location.country}
                                {weather.current.condition?.icon && (
                                    <img
                                        src={getWeatherIconUrl(weather.current.condition.icon)}
                                        alt={weather.current.condition.text}
                                        className="weather-icon"
                                        onError={(e) => {
                                            e.currentTarget.src = 'https://placehold.co/64x64/cccccc/white?text=No+Icon';
                                        }}
                                    />
                                )}
                            </h2>
                            <div className="weather-grid">
                                <p><LucideThermometer size={20} /> Temperature: <strong>{Math.round(weather.current.temp_c)}°C</strong></p>
                                <p><LucideCloud size={20} /> Condition: <strong>{weather.current.condition.text}</strong></p>
                                <p><LucideDroplet size={20} /> Humidity: <strong>{weather.current.humidity}%</strong></p>
                                <p><LucideWind size={20} /> Wind Speed: <strong>{weather.current.wind_kph} km/h</strong></p>
                            </div>

                            <div className="weather-extra">
                                <p>🌡️ Feels Like: <strong>{weather.current.feelslike_c}°C</strong></p>
                                <p>🧪 Pressure: <strong>{weather.current.pressure_mb} mb</strong></p>
                                <p>🌥️ Cloud Cover: <strong>{weather.current.cloud}%</strong></p>
                                <p>🧭 Wind Direction: <strong>{weather.current.wind_dir}</strong></p>
                                <p>🌬️ Wind Gusts: <strong>{weather.current.gust_kph} km/h</strong></p>
                                <p>👁️ Visibility: <strong>{weather.current.vis_km} km</strong></p>
                                <p>🔆 UV Index: <strong>{weather.current.uv}</strong></p>
                                <p>⏰ Last Updated: <strong>{weather.current.last_updated}</strong></p>
                            </div>
                        </div>

                        {history.length > 0 && (
                            <div className="history-preview">
                                <h3 className="history-title">Previous Searches</h3>
                                <div className="history-cards">
                                    {history.map((item, index) => (
                                        <div key={index} className="history-card">
                                            <h4>{item.location.name}, {item.location.country}</h4>
                                            <p>🌡️ Feels Like: <strong>{weather.current.feelslike_c}°C</strong></p>
                                <p>🧪 Pressure: <strong>{weather.current.pressure_mb} mb</strong></p>
                                <p>🌥️ Cloud Cover: <strong>{weather.current.cloud}%</strong></p>
                                <p>🧭 Wind Direction: <strong>{weather.current.wind_dir}</strong></p>
                                <p>🌬️ Wind Gusts: <strong>{weather.current.gust_kph} km/h</strong></p>
                                <p>👁️ Visibility: <strong>{weather.current.vis_km} km</strong></p>
                                <p>🔆 UV Index: <strong>{weather.current.uv}</strong></p>
                                <p>⏰ Last Updated: <strong>{weather.current.last_updated}</strong></p>

                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default WeatherReportPage;
