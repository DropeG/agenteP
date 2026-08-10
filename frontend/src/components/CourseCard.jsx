import React from 'react';
import { ChevronRight } from 'lucide-react';

export default function CourseCard({ course, onSelect, activeTaskCount = 0 }) {
  return (
    <div 
      style={styles.card}
      onClick={() => onSelect(course)}
      className="course-card"
    >
      <div style={styles.header}>
        <span style={styles.sigla}>{course.course_code}</span>
        {activeTaskCount > 0 && (
          <span style={styles.badge}>
            <span style={styles.dot}>●</span> {activeTaskCount} {activeTaskCount === 1 ? 'tarea' : 'tareas'}
          </span>
        )}
      </div>

      <h3 style={styles.name}>{course.course_name}</h3>

      <div style={styles.footer}>
        <span style={styles.actionText}>Ver actividad agente</span>
        <ChevronRight size={16} style={styles.arrow} />
      </div>
    </div>
  );
}

const styles = {
  card: {
    backgroundColor: 'var(--color-elevated-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: '12px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    justify: 'space-between',
    minHeight: '140px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    position: 'relative'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px'
  },
  sigla: {
    fontSize: '13px',
    fontWeight: 700,
    fontFamily: 'var(--font-mono)',
    color: 'var(--color-action-primary)',
    letterSpacing: '0.02em',
    textTransform: 'uppercase'
  },
  badge: {
    fontSize: '11px',
    fontWeight: 600,
    color: 'var(--color-warning)',
    backgroundColor: 'var(--color-page-bg)',
    padding: '2px 8px',
    borderRadius: '12px',
    border: '1px solid var(--color-border)'
  },
  dot: {
    fontSize: '8px',
    marginRight: '4px'
  },
  name: {
    fontSize: '17px',
    fontWeight: 600,
    color: 'var(--color-text-primary)',
    lineHeight: 1.3,
    letterSpacing: '-0.01em',
    flex: 1
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: '16px',
    paddingTop: '12px',
    borderTop: '1px solid var(--color-page-bg)'
  },
  actionText: {
    fontSize: '12px',
    fontWeight: 500,
    color: 'var(--color-text-muted)'
  },
  arrow: {
    color: 'var(--color-text-muted)'
  }
};
