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
import SampleDetailsPage from './pages/SamplesDetails/SampleDetails';
import AddImageToSample from './pages/SamplesDetails/AddImageToSample';
import { ToastContainer } from "react-toastify";
import Profile from './pages/Profile/Profile';
import Conversation from './pages/Conversation/Conversation';
import TaskList from './pages/TaskList/TaskList';
import useSSE from '../src/hooks/useSSE';
import { notifyApp } from './constants';
import { jwtDecode } from "jwt-decode";



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

  
  useSSE((data) => {
    const token = localStorage.getItem('token');
    const user = jwtDecode(token).user;
    if(data.type === 'comment' && user && user.id !== data.userId) {
      notifyApp({
        title: '🔥 Urgent Alert',
        text: data.message,
        data
      });
    }
    else {
      console.log(data);
    }
  });

  useEffect(() => {
    registerCachingServiceWorker();
  }, []);

  return (
    <>
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/conversation" element={<Conversation />} />
          <Route path="/tasks" element={<TaskList />} />
          <Route path="/samples-details" element={<SampleDetailsPage />} />
          <Route path="/create-collection" element={<CreateCollection />} />
          <Route path="/create-sub-collection" element={<CreateSubCollection />} />
          <Route path="/list-samples" element={<ListSamples selectedSubCollectionId={selectedSubCollectionId} selectedSubCollectionName={selectedSubCollectionName}/>} />
          <Route path="/create-sample" element={<CreateSample  selectedSubCollectionName={selectedSubCollectionId}/>} />
          <Route path="/add-image-sample" element={<AddImageToSample />} />
          <Route path="/" element={<Dashboard setSelectedSubCollectionId={setSelectedSubCollectionId} setSelectedSubCollectionName={setSelectedSubCollectionName} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
