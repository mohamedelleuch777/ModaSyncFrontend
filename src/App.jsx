// src/App.jsx
import React, { useCallback, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import CreateCollection from './pages/CreateCollection/CreateCollection';
import CreateSubCollection from './pages/CreateCollection/CreateSubCollection';
import CreateSample from './pages/CreateSample/CreateSample';
import ListSamples from './pages/CreateSample/ListSamples';


function App() {
  const [selectedSubCollectionId, setSelectedSubCollectionId] = useState(null);
  const [selectedSubCollectionName, setSelectedSubCollectionName] = useState('');

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
        <Route path="/create-collection" element={<CreateCollection />} />
        <Route path="/create-sub-collection" element={<CreateSubCollection />} />
        <Route path="/list-samples" element={<ListSamples selectedSubCollectionId={selectedSubCollectionId} selectedSubCollectionName={selectedSubCollectionName}/>} />
        <Route path="/create-sample" element={<CreateSample  selectedSubCollectionName={selectedSubCollectionId}/>} />
        <Route path="/" element={<Dashboard setSelectedSubCollectionId={setSelectedSubCollectionId} setSelectedSubCollectionName={setSelectedSubCollectionName} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
