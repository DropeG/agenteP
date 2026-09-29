import React, { useState, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import CourseSubSidebar from './components/CourseSubSidebar';
import CourseGrid from './components/CourseGrid';
import CourseGeneralView from './components/CourseGeneralView';
import CourseTasksView from './components/CourseTasksView';
import CourseGradesView from './components/CourseGradesView';
import CalendarView from './components/CalendarView';
import OnboardingModal from './components/OnboardingModal';
import { ThemeSelector } from './components/ThemeSelector';
import { loadWorkspaceCourses } from './utils/courseLoader';
import { getStoredAuth, clearAuth } from './utils/auth';
import { Key, LogOut, CheckCircle2, User } from 'lucide-react';

export default function App() {
  const [auth, setAuth] = useState(() => getStoredAuth());
  const [activeView, setActiveView] = useState('ramos');
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

  const handleLogout = () => {
    if (window.confirm('¿Deseas desconectar tu token de Canvas UC? Podrás volver a ingresarlo cuando quieras.')) {
      clearAuth();
      setAuth(null);
    }
  };

  // If no auth token is configured (e.g., first run on a friend's machine), show onboarding
  if (!auth) {
    return <OnboardingModal onAuthSuccess={(authData) => setAuth(authData)} />;
  }

  return (
    <div className={`app-shell ${selectedCourse ? 'has-course' : ''}`} style={styles.appShell}>
      {/* Tier 1 Primary Sidebar */}
      <Sidebar
        activeView={activeView}
        setActiveView={(view) => {
          setActiveView(view);
          setSelectedCourse(null);
          setActiveCourseTab('general');
        }}
        collapsed={Boolean(selectedCourse)}
        onBackToRamos={handleBackToRamos}
        currentUser={auth?.user}
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
          ) : activeCourseTab === 'grades' ? (
            <CourseGradesView course={selectedCourse} />
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
            {activeView === 'settings' && (
              <div style={styles.settingsContainer}>
                <div style={styles.settingsHeader}>
                  <h2 style={styles.settingsTitle}>Configuración</h2>
                  <p style={styles.settingsSubtitle}>
                    Ajustes generales, cuenta de Canvas UC y personalización del sistema.
                  </p>
                </div>

                <div style={styles.settingsSectionStack}>
                  {/* Section: Canvas UC Account */}
                  <div style={styles.accountCard}>
                    <div style={styles.accountHeader}>
                      <div style={styles.accountIconCircle}>
                        <Key size={18} color="var(--color-action-primary)" />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={styles.accountCardTitle}>Cuenta de Canvas UC</div>
                        <div style={styles.accountCardSubtitle}>
                          Conexión activa con la plataforma institucional de la universidad.
                        </div>
                      </div>
                      <div style={styles.statusBadge}>
                        <CheckCircle2 size={13} color="var(--color-agent-completed)" />
                        <span style={styles.statusBadgeText}>Conectado</span>
                      </div>
                    </div>

                    <div style={styles.accountBody}>
                      <div style={styles.userRow}>
                        {auth.user?.avatar_url ? (
                          <img 
                            src={auth.user.avatar_url} 
                            alt={auth.user.name} 
                            style={styles.accountAvatar} 
                          />
                        ) : (
                          <div style={styles.accountAvatarFallback}>
                            <User size={18} color="var(--color-text-secondary)" />
                          </div>
                        )}
                        <div style={styles.accountDetails}>
                          <div style={styles.accountName}>{auth.user?.name || 'Estudiante UC'}</div>
                          <div style={styles.accountEmail}>{auth.user?.email || 'estudiante@uc.cl'}</div>
                          {auth.user?.student_number && (
                            <div style={styles.accountStudentNumber}>
                              N° Alumno: <strong>{auth.user.student_number}</strong>
                            </div>
                          )}
                        </div>
                      </div>

                      <div style={styles.tokenRow}>
                        <span style={styles.tokenLabel}>Token activo:</span>
                        <code style={styles.tokenCode}>
                          {auth.token ? `${auth.token.slice(0, 8)}••••••••••••••••••••••••` : '••••••••'}
                        </code>
                      </div>

                      <div style={styles.accountActions}>
                        <button
                          type="button"
                          onClick={handleLogout}
                          style={styles.logoutButton}
                        >
                          <LogOut size={15} style={{ marginRight: '6px' }} />
                          <span>Cambiar Token / Desconectar</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Section: Themes */}
                  <ThemeSelector />
                </div>
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
  accountCard: {
    backgroundColor: 'var(--color-elevated-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)'
  },
  accountHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '20px'
  },
  accountIconCircle: {
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    backgroundColor: 'var(--color-surface-bg)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  accountCardTitle: {
    fontSize: '15px',
    fontWeight: 600,
    color: 'var(--color-text-primary)',
    fontFamily: 'var(--font-sans)'
  },
  accountCardSubtitle: {
    fontSize: '12px',
    color: 'var(--color-text-secondary)',
    fontFamily: 'var(--font-sans)',
    marginTop: '2px'
  },
  statusBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 10px',
    borderRadius: '16px',
    backgroundColor: 'var(--color-surface-bg)',
    border: '1px solid var(--color-border)'
  },
  statusBadgeText: {
    fontSize: '11px',
    fontWeight: 600,
    color: 'var(--color-agent-completed)',
    fontFamily: 'var(--font-sans)'
  },
  accountBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    paddingTop: '16px',
    borderTop: '1px solid var(--color-border)'
  },
  userRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  accountAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '1px solid var(--color-border)',
    flexShrink: 0
  },
  accountAvatarFallback: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: 'var(--color-surface-bg)',
    border: '1px solid var(--color-border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  accountDetails: {
    display: 'flex',
    flexDirection: 'column'
  },
  accountName: {
    fontSize: '14px',
    fontWeight: 600,
    color: 'var(--color-text-primary)',
    fontFamily: 'var(--font-sans)'
  },
  accountEmail: {
    fontSize: '12px',
    color: 'var(--color-text-muted)',
    fontFamily: 'var(--font-mono)',
    marginTop: '2px'
  },
  accountStudentNumber: {
    fontSize: '11px',
    color: 'var(--color-action-primary)',
    fontFamily: 'var(--font-mono)',
    marginTop: '3px'
  },
  tokenRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '12px',
    color: 'var(--color-text-secondary)',
    fontFamily: 'var(--font-sans)'
  },
  tokenLabel: {
    fontWeight: 500
  },
  tokenCode: {
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    padding: '3px 8px',
    borderRadius: '6px',
    backgroundColor: 'var(--color-surface-bg)',
    border: '1px solid var(--color-border)',
    color: 'var(--color-text-primary)'
  },
  accountActions: {
    marginTop: '4px'
  },
  logoutButton: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '8px 14px',
    borderRadius: '6px',
    backgroundColor: 'var(--color-surface-bg)',
    border: '1px solid var(--color-border)',
    color: 'var(--color-text-primary)',
    fontSize: '12px',
    fontWeight: 500,
    cursor: 'pointer',
    fontFamily: 'var(--font-sans)',
    transition: 'all 0.15s ease'
  }
};

