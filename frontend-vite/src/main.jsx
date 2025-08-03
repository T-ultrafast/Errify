import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.jsx';

console.log('main.jsx: Starting application initialization');

// Simple error handling
try {
  const rootElement = document.getElementById('root');
  console.log('main.jsx: Root element found:', !!rootElement);
  
  if (!rootElement) {
    throw new Error('Root element not found');
  }
  
  const root = ReactDOM.createRoot(rootElement);
  console.log('main.jsx: React root created successfully');
  
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  
  console.log('main.jsx: App component rendered successfully');
} catch (error) {
  console.error('main.jsx: Critical error:', error);
  
  // Show error in the DOM
  const rootElement = document.getElementById('root');
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #dc2626; color: white; text-align: center; padding: 20px;">
        <div>
          <h1 style="font-size: 2rem; margin-bottom: 1rem;">❌ React Failed to Load</h1>
          <p style="margin-bottom: 1rem;">Error: ${error.message}</p>
          <button onclick="window.location.reload()" style="padding: 10px 20px; background: white; color: #dc2626; border: none; border-radius: 5px; cursor: pointer;">
            Reload Page
          </button>
        </div>
      </div>
    `;
  }
}
