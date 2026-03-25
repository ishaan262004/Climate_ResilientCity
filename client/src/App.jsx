import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import AIChatbot from './components/chatbot/AIChatbot';
import Home from './pages/Home';
import Heatwaves from './pages/Heatwaves';
import AirPollution from './pages/AirPollution';
import Flooding from './pages/Flooding';
import Environment from './pages/Environment';
import Weather from './pages/Weather';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/heatwaves" element={<Heatwaves />} />
          <Route path="/air-pollution" element={<AirPollution />} />
          <Route path="/flooding" element={<Flooding />} />
          <Route path="/environment" element={<Environment />} />
          <Route path="/weather" element={<Weather />} />
        </Routes>
        <Footer />
        <AIChatbot />
      </div>
    </Router>
  );
}
