import { createContext, useContext, useState, useEffect } from 'react';

const AppointmentsContext = createContext();

export function AppointmentsProvider({ children }) {
  const [appointments, setAppointments] = useState(() => {
    const stored = localStorage.getItem('appointments');
    return stored ? JSON.parse(stored) : [
      {
        id: 1,
        name: 'Sarah Johnson',
        service: 'Haircut',
        date: '2025-07-05',
        time: '10:00 AM',
        phone: '555-1234',
        status: 'Confirmed',
      },
      {
        id: 2,
        name: 'Michael Lee',
        service: 'Color',
        date: '2025-07-06',
        time: '2:00 PM',
        phone: '555-5678',
        status: 'Confirmed',
      },
      {
        id: 3,
        name: 'Emma Davis',
        service: 'Styling',
        date: '2025-07-06',
        time: '4:00 PM',
        phone: '555-9876',
        status: 'Confirmed',
      },
    ];
  });

  useEffect(() => {
    localStorage.setItem('appointments', JSON.stringify(appointments));
  }, [appointments]);

  return (
    <AppointmentsContext.Provider value={{ appointments, setAppointments }}>
      {children}
    </AppointmentsContext.Provider>
  );
}

export function useAppointments() {
  return useContext(AppointmentsContext);
}
