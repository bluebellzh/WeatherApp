import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Create root element
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

// Render App component
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
