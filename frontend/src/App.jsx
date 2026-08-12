import React, { useState, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import CourseSubSidebar from './components/CourseSubSidebar';
import CourseGrid from './components/CourseGrid';
import CourseGeneralView from './components/CourseGeneralView';
import CalendarView from './components/CalendarView';
import { loadWorkspaceCourses } from './utils/courseLoader';

export default function App() {
  const [activeView, setActiveView] = useState('ramos');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const courses = useMemo(() => loadWorkspaceCourses(), []);

  const handleSelectCourse = (course) => {
    setSelectedCourse(course);
    setActiveView('ramos');
  };

  const handleBackToRamos = () => {
    setSelectedCourse(null);
  };

  return (
    <div style={styles.appShell}>
      {/* Tier 1 Primary Sidebar */}
      <Sidebar
        activeView={activeView}
        setActiveView={(view) => {
          setActiveView(view);
          setSelectedCourse(null);
        }}
        collapsed={Boolean(selectedCourse)}
        onBackToRamos={handleBackToRamos}
      />

      {/* Tier 2 Secondary Course Sidebar */}
      {selectedCourse && (
        <CourseSubSidebar
          course={selectedCourse}
          onBack={handleBackToRamos}
        />
      )}

      {/* Main Content Area */}
      <main className={`main-content ${selectedCourse ? 'has-course' : ''}`}>
        {selectedCourse ? (
          <CourseGeneralView course={selectedCourse} />
        ) : (
          <>
            {activeView === 'ramos' && (
              <CourseGrid courses={courses} onSelectCourse={handleSelectCourse} />
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
          </>
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
