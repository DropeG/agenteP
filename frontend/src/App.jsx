import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import CourseGrid from './components/CourseGrid';
import CalendarView from './components/CalendarView';

const INITIAL_COURSES = [
  { course_code: 'IIC2143', course_name: 'Ingeniería de Software' }
];

export default function App() {
  const [activeView, setActiveView] = useState('ramos');

  return (
    <div style={styles.appShell}>
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
      />

      <main className="main-content">
        {activeView === 'ramos' && (
          <CourseGrid courses={INITIAL_COURSES} />
        )}
        {activeView === 'calendar' && (
          <CalendarView />
        )}
        {activeView === 'settings' && (
          <div style={styles.placeholderContainer}>
            <h2 style={styles.placeholderTitle}>Configuración</h2>
            <p style={styles.placeholderText}>Opciones de configuración próximamente.</p>
          </div>
        )}
      </main>
    </div>
  );
}

const styles = {
  appShell: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: 'var(--color-page-bg)'
  },
  placeholderContainer: {
    padding: '32px'
  },
  placeholderTitle: {
    fontSize: '24px',
    fontWeight: 700,
    color: 'var(--color-text-primary)',
    letterSpacing: '-0.02em',
    marginBottom: '8px'
  },
  placeholderText: {
    fontSize: '14px',
    color: 'var(--color-text-secondary)'
  }
};
