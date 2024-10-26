import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import SplashPage from './pages/SplashPage';
import Home from './pages/Home';
import About from './pages/About';
import Projects from './pages/Projects';
import Studiowork from './pages/Studiowork';
import Exhibitions from './pages/Exhibitions';
import Contact from './pages/Contact';
import ProjectDetailPage from './pages/ProjectDetailPage';
import FooterComponent from './components/FooterComponent';
import StickyTopNav from './components/StickyTopNav';
import StickyBottomNav from './components/StickyBottomNav';
import Admin from './pages/Admin';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Routes>
          <Route path="/" element={<><StickyTopNav /><SplashPage /></>} />

          {/* Home route including sticky navs */}
          <Route path="/home" element={
            <>
              <StickyTopNav />
              <Home />
              <StickyBottomNav />
              <FooterComponent />
            </>
          } />

          {/* Other routes that include sticky navs */}
          <Route path="/about" element={
            <>
              <StickyTopNav />
              <About />
              <StickyBottomNav />
            </>
          } />

          <Route path="/projects" element={
            <>
              <StickyTopNav />
              <Projects />
              <StickyBottomNav />
            </>
          } />

          <Route path="/projects/:projectId" element={
            <>
              <StickyTopNav />
              <ProjectDetailPage />
              <StickyBottomNav />
            </>
          } />

          <Route path="/studiowork" element={
            <>
              <StickyTopNav />
              <Studiowork />
              <StickyBottomNav />
              <FooterComponent />
            </>
          } />

          <Route path="/exhibitions" element={
            <>
              <StickyTopNav />
              <Exhibitions />
              <StickyBottomNav />
              <FooterComponent />
            </>
          } />

          <Route path="/contact" element={
            <>
              <StickyTopNav />
              <Contact />
              <StickyBottomNav />
              <FooterComponent />
            </>
          } />

          <Route path="/connect/admin/c165d331-a6b0-42a0-8127-634d81148d40/studio/signin" element={
            <>
              <StickyTopNav />
              <Admin />
              <StickyBottomNav />
              <FooterComponent />
            </>
          } />

          <Route path="*" element={<Navigate to="/" />} /> {/* Redirect all unknown routes to SplashPage */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
