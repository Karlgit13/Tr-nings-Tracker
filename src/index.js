import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import MuscleProvider from './components/MuscleContext';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <MuscleProvider><App /></MuscleProvider>


  </React.StrictMode>
);

