import React, { useState, useMemo } from 'react';
import { Activity, ChevronRight, Network } from 'lucide-react';
import Sidebar from './components/Sidebar';
import CourseSubSidebar from './components/CourseSubSidebar';
import CourseGrid from './components/CourseGrid';
import CourseGeneralView from './components/CourseGeneralView';
import CourseTasksView from './components/CourseTasksView';
import CalendarView from './components/CalendarView';
import SummaryView from './components/SummaryView';
import { ThemeSelector } from './components/ThemeSelector';
import CronMonitoringView from './components/CronMonitoringView';
import SystemArchitectureView from './components/SystemArchitectureView';
import { loadWorkspaceCourses } from './utils/courseLoader';

export default function App() {
  const [activeView, setActiveView] = useState('ramos');
  const [settingsSubView, setSettingsSubView] = useState('main'); // 'main' | 'crons' | 'architecture'
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [activeCourseTab, setActiveCourseTab] = useState('general');
  const courses = useMemo(() => loadWorkspaceCourses(), []);

  const handleSelectCourse = (course) => {
    setSelectedCourse(course);
    setActiveCourseTab('general');
    setActiveView('ramos');
  };

  const handleBackToRamos = () => {
    setSelectedCourse(null);
    setActiveCourseTab('general');
  };

  return (
    <div className={`app-shell ${selectedCourse ? 'has-course' : ''}`} style={styles.appShell}>
      {/* Tier 1 Primary Sidebar */}
      <Sidebar
        activeView={activeView}
        setActiveView={(view) => {
          setActiveView(view);
          setSelectedCourse(null);
          setActiveCourseTab('general');
          if (view === 'settings') {
            setSettingsSubView('main');
          }
        }}
        collapsed={Boolean(selectedCourse)}
        onBackToRamos={handleBackToRamos}
      />

      {/* Tier 2 Secondary Course Sidebar */}
      {selectedCourse && (
        <CourseSubSidebar
          course={selectedCourse}
          onBack={handleBackToRamos}
          activeTab={activeCourseTab}
          onSelectTab={(tab) => setActiveCourseTab(tab)}
        />
      )}

      {/* Main Content Area */}
      <main className={`main-content ${selectedCourse ? 'has-course' : ''}`}>
        {selectedCourse ? (
          activeCourseTab === 'tasks' ? (
            <CourseTasksView course={selectedCourse} />
          ) : (
            <CourseGeneralView course={selectedCourse} />
          )
        ) : (
          <>
            {activeView === 'ramos' && (
              <CourseGrid courses={courses} onSelectCourse={handleSelectCourse} />
            )}
            {activeView === 'calendar' && (
              <CalendarView />
            )}
            {activeView === 'summary' && (
              <SummaryView />
            )}
            {activeView === 'settings' && (
              settingsSubView === 'crons' ? (
                <CronMonitoringView onBack={() => setSettingsSubView('main')} />
              ) : settingsSubView === 'architecture' ? (
                <SystemArchitectureView onBack={() => setSettingsSubView('main')} />
              ) : (
                <div style={styles.settingsContainer}>
                  <div style={styles.settingsHeader}>
                    <h2 style={styles.settingsTitle}>Configuración</h2>
                    <p style={styles.settingsSubtitle}>
                      Ajustes generales, personalización y herramientas avanzadas del sistema.
                    </p>
                  </div>

                  <div style={styles.settingsSectionStack}>
                    {/* Section 1: Themes */}
                    <ThemeSelector />

                    {/* Section 2: Advanced Settings */}
                    <div style={styles.advancedSectionStack}>
                      <h3 style={styles.advancedSectionTitle}>Configuración Avanzada</h3>
                      
                      <button
                        onClick={() => setSettingsSubView('crons')}
                        style={styles.advancedCard}
                        className="advanced-setting-card"
                      >
                        <div style={styles.advancedCardLeft}>
                          <div style={styles.advancedIconWrapper}>
                            <Activity size={20} color="var(--color-action-primary)" />
                          </div>
                          <div style={styles.advancedCardText}>
                            <h4 style={styles.advancedCardTitle}>Automatizaciones & Crons</h4>
                            <p style={styles.advancedCardDesc}>
                              Monitorea los procesos en segundo plano, su estado y el registro de logs.
                            </p>
                          </div>
                        </div>
                        <ChevronRight size={18} color="var(--color-text-muted)" style={styles.advancedArrow} />
                      </button>

                      <button
                        onClick={() => setSettingsSubView('architecture')}
                        style={{ ...styles.advancedCard, marginTop: '12px' }}
                        className="advanced-setting-card"
                      >
                        <div style={styles.advancedCardLeft}>
                          <div style={styles.advancedIconWrapper}>
                            <Network size={20} color="var(--brand-turquoise, var(--color-action-primary))" />
                          </div>
                          <div style={styles.advancedCardText}>
                            <h4 style={styles.advancedCardTitle}>Arquitectura del Sistema</h4>
                            <p style={styles.advancedCardDesc}>
                              Explora cómo interactúan los crons, skills y vistas de Agente P.
                            </p>
                          </div>
                        </div>
                        <ChevronRight size={18} color="var(--color-text-muted)" style={styles.advancedArrow} />
                      </button>
                    </div>
                  </div>
                </div>
              )
            )}
          </>
        )}
      </main>
    </div>
  );
}

const styles = {
  appShell: {
    minHeight: '100vh',
    backgroundColor: 'var(--color-page-bg)'
  },
  settingsContainer: {
    padding: '32px',
    maxWidth: '840px',
    margin: '0 auto',
    width: '100%',
    boxSizing: 'border-box'
  },
  settingsHeader: {
    marginBottom: '28px'
  },
  settingsTitle: {
    fontSize: '24px',
    fontWeight: 700,
    color: 'var(--color-text-primary)',
    letterSpacing: '-0.02em',
    marginBottom: '4px'
  },
  settingsSubtitle: {
    fontSize: '14px',
    color: 'var(--color-text-secondary)'
  },
  settingsSectionStack: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  advancedSection: {
    marginTop: '8px'
  },
  advancedSectionTitle: {
    fontSize: '13px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    color: 'var(--color-text-muted)',
    marginBottom: '12px'
  },
  advancedCard: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: '18px 20px',
    backgroundColor: 'var(--color-surface-bg)',
    border: '1px solid var(--color-border)',
    borderRadius: '12px',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'all 0.15s ease'
  },
  advancedCardLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  advancedIconWrapper: {
    width: '40px',
    height: '40px',
    borderRadius: '8px',
    backgroundColor: 'var(--color-elevated-surface)',
    border: '1px solid var(--color-border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  advancedCardText: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px'
  },
  advancedCardTitle: {
    fontSize: '15px',
    fontWeight: 600,
    color: 'var(--color-text-primary)'
  },
  advancedCardDesc: {
    fontSize: '13px',
    color: 'var(--color-text-secondary)',
    lineHeight: 1.4
  },
  advancedArrow: {
    flexShrink: 0,
    marginLeft: '12px'
  }
};
