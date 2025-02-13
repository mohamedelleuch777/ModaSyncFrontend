// src/App.jsx
import React, { useCallback, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Dashboard from './pages/Dashboard/Dashboard';


function App() {

  // Memoize service worker registration
  const registerCachingServiceWorker = useCallback(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then((existingRegistration) => {
        if (!existingRegistration) {
          navigator.serviceWorker.register('/service-worker.js', { type: 'module' })
            .then(registration => {
              console.log('✅ Service Worker registered with scope:', registration.scope);
            })
            .catch(error => {
              console.log('❌ Service Worker registration failed:', error);
            });
        } else {
          console.log('🚀 Service Worker already registered:', existingRegistration.scope);
        }
      });
    }
  }, []);

  // Memoize SSE registration
  const registerEventSource = useCallback(() => {
    const eventSource = new EventSource("http://localhost:9613/api/events");
    eventSource.onmessage = function(event) {
      const data = JSON.parse(event.data);
      console.log("Received SSE:", data);
    };
  }, []);

  useEffect(() => {
    registerCachingServiceWorker();
    registerEventSource();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
