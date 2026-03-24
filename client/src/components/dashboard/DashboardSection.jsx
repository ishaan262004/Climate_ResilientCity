import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';
import AQICard from './AQICard';
import WeatherCard from './WeatherCard';
import { fetchAQI, fetchWeather } from '../../services/api';

// Fallback mock data
const mockAQI = {
  city: 'Delhi',
  data: [
    { area: 'Rohini', aqi: 185, category: 'Unhealthy', color: '#ef4444', pm25: 112, pm10: 156 },
    { area: 'Dwarka', aqi: 142, category: 'Unhealthy for Sensitive', color: '#f97316', pm25: 86, pm10: 120 },
    { area: 'Anand Vihar', aqi: 278, category: 'Very Unhealthy', color: '#a855f7', pm25: 168, pm10: 235 },
    { area: 'Connaught Place', aqi: 156, category: 'Unhealthy', color: '#ef4444', pm25: 94, pm10: 130 },
    { area: 'ITO', aqi: 215, category: 'Very Unhealthy', color: '#a855f7', pm25: 130, pm10: 185 },
    { area: 'IGI Airport (T3)', aqi: 148, category: 'Unhealthy for Sensitive', color: '#f97316', pm25: 89, pm10: 125 },
    { area: 'Nehru Nagar', aqi: 235, category: 'Very Unhealthy', color: '#a855f7', pm25: 142, pm10: 200 },
    { area: 'Punjabi Bagh', aqi: 192, category: 'Unhealthy', color: '#ef4444', pm25: 116, pm10: 162 },
  ]
};

const mockWeather = {
  city: 'Delhi',
  temperature: 34,
  feelsLike: 38,
  humidity: 55,
  windSpeed: 12,
  condition: 'Hazy',
  icon: '🌫️',
  visibility: 3,
  uvIndex: 7,
  pressure: 1012,
  sunrise: '06:15 AM',
  sunset: '06:30 PM'
};

export default function DashboardSection() {
  const [aqiData, setAqiData] = useState(mockAQI);
  const [weatherData, setWeatherData] = useState(mockWeather);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [aqi, weather] = await Promise.all([fetchAQI(), fetchWeather()]);
        if (aqi?.data) setAqiData(aqi);
        if (weather?.temperature) setWeatherData(weather);
      } catch (err) {
        // Use mock data on error
        console.log('Using mock data:', err.message);
      }
    };
    loadData();
    const interval = setInterval(loadData, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="dashboard" className="section-padding relative">
      {/* Background accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-resilient-green/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container-custom relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-4">
            <Activity className="w-4 h-4 text-resilient-green" />
            <span className="text-xs text-white/60">Live Data Dashboard</span>
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-white mb-4">
            Delhi Environmental <span className="text-gradient-green">Monitor</span>
          </h2>
          <p className="text-white/50 max-w-2xl mx-auto">
            Real-time air quality and weather data from monitoring stations across Delhi NCR.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* AQI Grid */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {aqiData.data.map((item, i) => (
                <AQICard key={item.area} data={item} index={i} />
              ))}
            </div>
          </div>

          {/* Weather */}
          <div className="lg:col-span-1">
            <WeatherCard data={weatherData} />
          </div>
        </div>
      </div>
    </section>
  );
}
