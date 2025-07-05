import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppointmentsProvider } from './context/AppointmentsContext';
import { ServicesProvider } from './context/ServicesContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <ServicesProvider>
        <AppointmentsProvider>
          <App />
        </AppointmentsProvider>
      </ServicesProvider>
    </AuthProvider>
  </BrowserRouter>
);
