import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ReactLenis, useLenis } from 'lenis/react';
import { LanguageProvider } from './context/LanguageContext';
import { DemoDataProvider } from './context/DemoDataContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';

// Pages
import { HomePage } from './pages/HomePage';
import { UdyogSamvaadPage } from './pages/UdyogSamvaadPage';
import { UdyogDarshanPage } from './pages/UdyogDarshanPage';
import { GrievancePage } from './pages/GrievancePage';
import { TrackComplaintPage } from './pages/TrackComplaintPage';
import { MeetingRequestPage } from './pages/MeetingRequestPage';
import { AssociationRegistrationPage } from './pages/AssociationRegistrationPage';
import { NitiManthanPage } from './pages/NitiManthanPage';
import { EventsPage } from './pages/EventsPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Scroll to top helper on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  const lenis = useLenis();

  useEffect(() => {
    lenis?.scrollTo(0, { duration: 0.8 });
  }, [lenis, pathname]);

  return null;
}

function App() {
  return (
    <LanguageProvider>
      <DemoDataProvider>
        <BrowserRouter>
          <ReactLenis root options={{ anchors: true, lerp: 0.1 }} />
          <ScrollToTop />
          <div className="min-h-screen flex flex-col bg-white text-[#111827] selection:bg-[#E35914]/20 selection:text-[#E35914]">
            <Header />
            <main className="flex-1 flex flex-col">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/udyog-samvaad" element={<UdyogSamvaadPage />} />
                <Route path="/udyog-darshan" element={<UdyogDarshanPage />} />
                <Route path="/grievance" element={<GrievancePage />} />
                <Route path="/track-complaint" element={<TrackComplaintPage />} />
                <Route path="/meeting-request" element={<MeetingRequestPage />} />
                <Route path="/association-registration" element={<AssociationRegistrationPage />} />
                <Route path="/niti-manthan" element={<NitiManthanPage />} />
                <Route path="/events" element={<EventsPage />} />
                <Route path="/admin" element={<AdminDashboardPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </DemoDataProvider>
    </LanguageProvider>
  );
}

export default App;
