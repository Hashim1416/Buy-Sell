import React, { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LiveChat from './components/LiveChat';
import NotificationToast from './components/NotificationToast';

import Home from './pages/Home';
import Collections from './pages/Collections';
import Viewer3D from './pages/Viewer3D';
import Compare from './pages/Compare';
import EVHub from './pages/EVHub';
import Trade from './pages/Trade';
import Brands from './pages/Brands';
import Services from './pages/Services';
import Scheduler from './pages/Scheduler';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Store from './pages/Store';

import { AuthProvider, AuthContext } from './context/AuthContext';
import { AppProvider } from './context/AppContext';

function ProtectedLayout({ children }) {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const isAdminRoute = location.pathname.startsWith('/admin');

  if (isAdminRoute) {
    return (
      <div className="flex flex-col min-h-screen bg-[#050505]">
        <div className="flex-grow flex flex-col">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-luxury-black text-luxury-silver">
      <Navbar />
      <div className="flex-grow flex flex-col">
        {children}
      </div>
      <LiveChat />
      <Footer />
    </div>
  );
}

const pageVariants = {
  initial: { opacity: 0, y: 10 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -10 }
};

const pageTransition = {
  type: 'tween',
  ease: 'easeInOut',
  duration: 0.4
};

function AnimatedRoutes() {
  const location = useLocation();

  // Scroll to top automatically on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition} className="flex-grow flex flex-col">
            <Home />
          </motion.div>
        } />
        <Route path="/collections" element={
          <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition} className="flex-grow flex flex-col">
            <Collections />
          </motion.div>
        } />
        <Route path="/viewer3d" element={
          <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition} className="flex-grow flex flex-col">
            <Viewer3D />
          </motion.div>
        } />
        <Route path="/compare" element={
          <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition} className="flex-grow flex flex-col">
            <Compare />
          </motion.div>
        } />
        <Route path="/evhub" element={
          <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition} className="flex-grow flex flex-col">
            <EVHub />
          </motion.div>
        } />
        <Route path="/trade" element={
          <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition} className="flex-grow flex flex-col">
            <Trade />
          </motion.div>
        } />
        <Route path="/brands" element={
          <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition} className="flex-grow flex flex-col">
            <Brands />
          </motion.div>
        } />
        <Route path="/services" element={
          <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition} className="flex-grow flex flex-col">
            <Services />
          </motion.div>
        } />
        <Route path="/scheduler" element={
          <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition} className="flex-grow flex flex-col">
            <Scheduler />
          </motion.div>
        } />
        <Route path="/admin" element={
          <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition} className="flex-grow flex flex-col">
            <Admin />
          </motion.div>
        } />
        
        <Route path="/store" element={
          <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition} className="flex-grow flex flex-col">
            <Store />
          </motion.div>
        } />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <Router>
          <NotificationToast />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/*" element={
              <ProtectedLayout>
                <AnimatedRoutes />
              </ProtectedLayout>
            } />
          </Routes>
        </Router>
      </AppProvider>
    </AuthProvider>
  );
}
