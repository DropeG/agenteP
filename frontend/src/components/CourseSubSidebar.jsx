import React from 'react';
import { ArrowLeft, Info, CheckSquare } from 'lucide-react';

export default function CourseSubSidebar({ course, onBack, activeTab = 'general', onSelectTab }) {
  if (!course) return null;

  return (
    <aside className="course-sidebar" style={styles.sidebar}>
      {/* Back button */}
      <div style={styles.header}>
        <button onClick={onBack} style={styles.backButton} title="Volver a Ramos">
          <ArrowLeft size={16} />
          <span>Volver a Ramos</span>
        </button>
      </div>

      {/* Course Code & Name Badge */}
      <div style={styles.courseBadge}>
        <span style={styles.courseCode}>{course.course_code}</span>
        <h2 style={styles.courseName}>{course.course_name}</h2>
      </div>

      {/* Sub-navigation Items */}
      <nav style={styles.nav}>
        <button 
          onClick={() => onSelectTab && onSelectTab('general')}
          style={activeTab === 'general' ? styles.navItemActive : styles.navItem} 
          title="General"
        >
          <Info size={16} />
          <span>General</span>
        </button>
        <button 
          onClick={() => onSelectTab && onSelectTab('tasks')}
          style={activeTab === 'tasks' ? styles.navItemActive : styles.navItem} 
          title="Tareas"
        >
          <CheckSquare size={16} />
          <span style={{ flex: 1 }}>Tareas</span>
          <span style={styles.badgeCount}>2</span>
        </button>
      </nav>
    </aside>
  );
}

const styles = {
  sidebar: {
    padding: '20px 14px',
    backgroundColor: 'var(--color-surface-bg)',
    borderRight: '1px solid var(--color-border)'
  },
  header: {
    marginBottom: '20px'
  },
  backButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '13px',
    fontWeight: 500,
    color: 'var(--color-text-secondary)',
    padding: '6px 8px',
    borderRadius: '6px',
    transition: 'all 0.15s ease',
    width: '100%',
    textAlign: 'left'
  },
  courseBadge: {
    padding: '0 8px 16px 8px',
    marginBottom: '16px',
    borderBottom: '1px solid var(--color-border)'
  },
  courseCode: {
    display: 'inline-block',
    fontSize: '12px',
    fontWeight: 700,
    fontFamily: 'var(--font-mono)',
    color: 'var(--color-action-primary)',
    letterSpacing: '0.04em',
    marginBottom: '4px'
  },
  courseName: {
    fontSize: '14px',
    fontWeight: 600,
    color: 'var(--color-text-primary)',
    lineHeight: 1.35,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden'
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  navItemActive: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '9px 12px',
    borderRadius: '8px',
    fontSize: '13.5px',
    fontWeight: 600,
    backgroundColor: 'var(--color-elevated-surface)',
    color: 'var(--color-action-primary)',
    border: '1px solid var(--color-border)',
    textAlign: 'left',
    width: '100%',
    cursor: 'pointer'
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '9px 12px',
    borderRadius: '8px',
    fontSize: '13.5px',
    fontWeight: 500,
    backgroundColor: 'transparent',
    color: 'var(--color-text-secondary)',
    border: '1px solid transparent',
    textAlign: 'left',
    width: '100%',
    cursor: 'pointer',
    transition: 'all 0.15s ease'
  },
  badgeCount: {
    fontSize: '11px',
    fontWeight: 700,
    fontFamily: 'var(--font-mono)',
    backgroundColor: 'var(--color-surface-bg)',
    color: 'var(--color-action-primary)',
    padding: '2px 6px',
    borderRadius: '10px',
    border: '1px solid var(--color-border)'
  }
};
