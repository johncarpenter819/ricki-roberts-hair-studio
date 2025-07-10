import '../styles/Booking.css';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useServices } from '../context/ServicesContext';
import { useAppointments } from '../context/AppointmentsContext';
import { useTeam } from '../context/TeamContext';
import emailjs from '@emailjs/browser';

const BUSINESS_HOURS = {
  start: 9.5,
  end: 17,
};
const BUFFER_MINUTES = 10;

function formatTimeTo12Hour(time24) {
  const [hour, minute] = time24.split(':');
  const hourNum = parseInt(hour, 10);
  const ampm = hourNum >= 12 ? 'PM' : 'AM';
  const hour12 = hourNum % 12 || 12;
  return `${hour12}:${minute} ${ampm}`;
}

function toMinutes(timeStr) {
  if (!timeStr) return null;
  const [hour, minute] = timeStr.split(':').map(Number);
  return hour * 60 + minute;
}

function toTimeString(minutes) {
  const hour = Math.floor(minutes / 60);
  const min = minutes % 60;
  return `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
}

function findNextAvailableSlot(startDate, duration, stylistId, appointments, earliestStart = null, maxDays = 30) {
  const totalDuration = duration + BUFFER_MINUTES;
  const openMins = BUSINESS_HOURS.start * 60;
  const closeMins = BUSINESS_HOURS.end * 60;
  let dateCursor = new Date(startDate);

  for (let dayOffset = 0; dayOffset < maxDays; dayOffset++) {
    const dateStr = dateCursor.toISOString().slice(0, 10);

    const dayAppts = appointments
      .filter(a => a.date === dateStr && a.stylistId === stylistId && a.status === 'Confirmed')
      .map(a => {
        const startMins = toMinutes(a.rawTime || a.time);
        const dur = parseInt(a.duration, 10) || 60;
        return { start: startMins, end: startMins + dur + BUFFER_MINUTES };
      })
      .sort((a, b) => a.start - b.start);

    let searchStart = earliestStart !== null && dateStr === startDate ? earliestStart : openMins;

    for (let start = searchStart; start + totalDuration <= closeMins; start += 5) {
      const conflict = dayAppts.some(appt => !(start + totalDuration <= appt.start || start >= appt.end));
      if (!conflict) {
        return { date: dateStr, time: toTimeString(start) };
      }
    }

    dateCursor.setDate(dateCursor.getDate() + 1);
  }

  return null;
}

export default function Booking() {
  const location = useLocation();
  const { services } = useServices();
  const { appointments, setAppointments } = useAppointments();
  const { team } = useTeam();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    serviceId: '',
    stylistId: '',
    date: '',
    time: '',
    subscribe: false,
  });

  const [hydrated, setHydrated] = useState(false);

  useEffect(() => setHydrated(true), []);

  // ⬇️ Prefill service if passed from navigation
  useEffect(() => {
    const preselectedName = location.state?.preselectedService;
    if (preselectedName && services.length > 0) {
      const matchedService = services.find(s => s.name === preselectedName);
      if (matchedService) {
        setForm(prev => ({
          ...prev,
          serviceId: matchedService.id.toString()
        }));
      }
    }
  }, [location.state, services]);

  useEffect(() => {
    const saved = localStorage.getItem('appointments');
    if (saved) setAppointments(JSON.parse(saved));
  }, [setAppointments]);

  useEffect(() => {
    localStorage.setItem('appointments', JSON.stringify(appointments));
  }, [appointments]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const sendConfirmationEmail = (appointment) => {
    const templateParams = {
      to_name: appointment.name,
      to_email: appointment.email,
      service: appointment.service,
      stylist: appointment.stylist,
      date: appointment.date,
      time: appointment.time,
      phone: appointment.phone,
    };

    emailjs.send('service_wn6pbqr', 'template_1mva669', templateParams, '6gOkwHvGmFWzYR83o')
      .then(() => console.log('Confirmation email sent!'))
      .catch((error) => console.error('Email send failed:', error));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateEmail(form.email)) {
      alert('Please enter a valid email address.');
      return;
    }

    const selectedService = services.find(s => s.id === parseInt(form.serviceId));
    const selectedStylist = team.find(t => t.id === parseInt(form.stylistId));

    if (!selectedService || !selectedStylist) {
      alert('Please select a valid service and stylist.');
      return;
    }

    if (!form.date || !form.time) {
      alert('Please select a valid date and time.');
      return;
    }

    const requestedStart = toMinutes(form.time);
    const duration = parseInt(selectedService.duration, 10);
    if (isNaN(duration)) {
      alert('Service duration is invalid.');
      return;
    }

    const requestedEnd = requestedStart + duration;
    const dateStr = form.date;

    let conflict = appointments.some(appt => {
      if (
        appt.stylistId !== selectedStylist.id ||
        appt.date !== dateStr ||
        appt.status !== 'Confirmed'
      ) return false;

      const apptStart = toMinutes(appt.rawTime || appt.time);
      const apptDuration = parseInt(appt.duration, 10) || 60;
      const apptEnd = apptStart + apptDuration + BUFFER_MINUTES;

      return !(requestedEnd <= apptStart || requestedStart >= apptEnd);
    });

    if (conflict) {
      const overlappingAppts = appointments.filter(appt => {
        if (
          appt.stylistId !== selectedStylist.id ||
          appt.date !== dateStr ||
          appt.status !== 'Confirmed'
        ) return false;

        const apptStart = toMinutes(appt.rawTime || appt.time);
        const apptDuration = parseInt(appt.duration, 10) || 60;
        return !(requestedEnd <= apptStart || requestedStart >= apptStart + apptDuration + BUFFER_MINUTES);
      });

      const latestEnd = Math.max(...overlappingAppts.map(appt => {
        const apptStart = toMinutes(appt.rawTime || appt.time);
        const apptDuration = parseInt(appt.duration, 10) || 60;
        return apptStart + apptDuration + BUFFER_MINUTES;
      }));

      const foundSlot = findNextAvailableSlot(
        dateStr,
        duration,
        selectedStylist.id,
        appointments,
        latestEnd
      );

      if (foundSlot) {
        alert(`${form.name}, the selected time conflicts with an existing appointment.\nSuggested next available slot: ${foundSlot.date} at ${formatTimeTo12Hour(foundSlot.time)}`);
      } else {
        alert(`${form.name}, no available slots in the next 30 days. Please choose another date or stylist.`);
      }

      return;
    }

    if (requestedStart < BUSINESS_HOURS.start * 60 || requestedEnd > BUSINESS_HOURS.end * 60) {
      const foundSlot = findNextAvailableSlot(
        dateStr,
        duration,
        selectedStylist.id,
        appointments,
        BUSINESS_HOURS.start * 60
      );

      if (foundSlot) {
        alert(`${form.name}, this appointment duration exceeds the hours of operation.\nSuggested next available slot: ${foundSlot.date} at ${formatTimeTo12Hour(foundSlot.time)}`);
      } else {
        alert(`${form.name}, this appointment duration exceeds business hours and no alternate slots were found.`);
      }

      return;
    }

    const newAppointment = {
      id: Date.now(),
      name: form.name,
      email: form.email,
      phone: form.phone,
      service: selectedService.name,
      stylist: selectedStylist.name,
      stylistId: selectedStylist.id,
      date: form.date,
      time: formatTimeTo12Hour(form.time),
      rawTime: form.time,
      duration,
      status: 'Confirmed',
      subscribe: form.subscribe,
    };

    setAppointments([...appointments, newAppointment]);
    sendConfirmationEmail(newAppointment);

    alert(`Thank you, ${form.name}! Your ${selectedService.name} with ${selectedStylist.name} is booked.`);

    setForm({
      name: '',
      email: '',
      phone: '',
      serviceId: '',
      stylistId: '',
      date: '',
      time: '',
      subscribe: false,
    });
  };

  return (
    <div className={`booking-page ${hydrated ? 'visible' : ''}`}>
      <h1 className="booking-title">Book an Appointment</h1>
      {!hydrated ? (
        <p>Loading form...</p>
      ) : (
        <form className="booking-form" onSubmit={handleSubmit} noValidate>
          <label className="booking-label" htmlFor="name">
            Name
            <input
              id="name"
              className="booking-input"
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </label>

          <label className="booking-label" htmlFor="email">
            Email
            <input
              id="email"
              className="booking-input"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </label>

          <label className="booking-label" htmlFor="phone">
            Phone Number
            <input
              id="phone"
              className="booking-input"
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
            />
          </label>

          <label className="booking-label" htmlFor="serviceId">
            Service
            <select
              id="serviceId"
              className="booking-select"
              name="serviceId"
              value={form.serviceId}
              onChange={handleChange}
              required
            >
              <option value="">Select a Service</option>
              {services.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} — ${s.price.toFixed(2)}
                </option>
              ))}
            </select>
          </label>

          <label className="booking-label" htmlFor="stylistId">
            Stylist
            <select
              id="stylistId"
              className="booking-select"
              name="stylistId"
              value={form.stylistId}
              onChange={handleChange}
              required
            >
              <option value="">Select a Stylist</option>
              {team.map(stylist => (
                <option key={stylist.id} value={stylist.id}>
                  {stylist.name}
                </option>
              ))}
            </select>
          </label>

          <label className="booking-label" htmlFor="date">
            Date
            <input
              id="date"
              className="booking-input"
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
            />
          </label>

          <label className="booking-label" htmlFor="time">
            Time
            <input
              id="time"
              className="booking-input"
              type="time"
              name="time"
              value={form.time}
              onChange={handleChange}
              required
            />
          </label>

          <label className="checkbox-label" htmlFor="subscribe">
            <input
              id="subscribe"
              type="checkbox"
              name="subscribe"
              checked={form.subscribe}
              onChange={handleChange}
            />
            I’d like to receive newsletters, discounts, or service updates.
          </label>

          <button type="submit" className="cta-btn">Book Now</button>
        </form>
      )}
    </div>
  );
}
