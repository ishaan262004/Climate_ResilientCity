import { lazy, Suspense } from 'react';
import HeroSection from '../components/hero/HeroSection';
import DashboardSection from '../components/dashboard/DashboardSection';
import HomeChartsSection from '../components/dashboard/HomeChartsSection';
import ClimateSection from '../components/climate/ClimateSection';
import AlertsBanner from '../components/alerts/AlertsBanner';
import ReportForm from '../components/community/ReportForm';
import ClimateRiskPanel from '../components/risk/ClimateRiskPanel';
import { useSocket } from '../hooks/useSocket';

// Lazy load heavy components
const InteractiveMap = lazy(() => import('../components/map/InteractiveMap'));

function MapFallback() {
  return (
    <div className="section-padding">
      <div className="container-custom">
        <div className="h-[500px] rounded-2xl glass flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-resilient-green border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-white/40 text-sm">Loading map...</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const { alerts } = useSocket();

  return (
    <main>
      <HeroSection />
      <DashboardSection />
      <HomeChartsSection />
      <ClimateRiskPanel />
      <ClimateSection />
      <AlertsBanner socketAlerts={alerts} />
      <Suspense fallback={<MapFallback />}>
        <InteractiveMap />
      </Suspense>
      <ReportForm />
    </main>
  );
}
