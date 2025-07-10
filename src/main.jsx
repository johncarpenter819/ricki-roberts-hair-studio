import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppointmentsProvider } from './context/AppointmentsContext';
import { ServicesProvider } from './context/ServicesContext';
import { TeamProvider } from './context/TeamContext';
import { ReviewsProvider } from './context/ReviewsContext'; // <-- import ReviewsProvider
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <ServicesProvider>
        <AppointmentsProvider>
          <TeamProvider>
            <ReviewsProvider>  
              <App />
            </ReviewsProvider>
          </TeamProvider>
        </AppointmentsProvider>
      </ServicesProvider>
    </AuthProvider>
  </BrowserRouter>
);
