import React from 'react';
import { Activity, FileText, Megaphone, CheckSquare, BookOpen, ArrowLeft } from 'lucide-react';

export default function CourseSidebar({ course, activeSubView, setActiveSubView, onBackToDashboard }) {
  const menuItems = [
    { id: 'activity', label: 'Actividad Agente', icon: Activity },
    { id: 'programa', label: 'Programa del Curso', icon: FileText },
    { id: 'announcements', label: 'Anuncios', icon: Megaphone },
    { id: 'evaluations', label: 'Tareas & Evaluaciones', icon: CheckSquare },
    { id: 'materials', label: 'Materiales', icon: BookOpen },
  ];

  return (
    <aside className="course-sidebar">
      {/* Back Button & Course Header */}
      <div style={styles.header}>
        <button onClick={onBackToDashboard} style={styles.backButton}>
          <ArrowLeft size={16} color="var(--color-text-secondary)" />
          <span>Volver a Mis Ramos</span>
        </button>
        <div style={styles.siglaBadge}>{course.course_code}</div>
        <h3 style={styles.courseTitle}>{course.course_name}</h3>
      </div>

      {/* Sub-Navigation Menu */}
      <nav style={styles.nav}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSubView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveSubView(item.id)}
              style={{
                ...styles.navItem,
                ...(isActive ? styles.navItemActive : {})
              }}
            >
              <Icon size={16} color={isActive ? 'var(--color-action-primary)' : 'var(--color-text-secondary)'} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

const styles = {
  header: {
    padding: '20px 16px 16px',
    borderBottom: '1px solid var(--color-border)',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  backButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '12px',
    fontWeight: 500,
    color: 'var(--color-text-secondary)',
    marginBottom: '4px'
  },
  siglaBadge: {
    fontSize: '11px',
    fontWeight: 700,
    fontFamily: 'var(--font-mono)',
    color: 'var(--color-action-primary)',
    textTransform: 'uppercase',
    letterSpacing: '0.04em'
  },
  courseTitle: {
    fontSize: '15px',
    fontWeight: 700,
    color: 'var(--color-text-primary)',
    lineHeight: 1.25
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    padding: '12px 8px',
    flex: 1
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '8px 12px',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: 500,
    color: 'var(--color-text-secondary)',
    transition: 'all 0.15s ease',
    textAlign: 'left'
  },
  navItemActive: {
    backgroundColor: 'var(--color-elevated-surface)',
    color: 'var(--color-action-primary)',
    fontWeight: 600,
    border: '1px solid var(--color-border)'
  }
};
