import React from 'react';
import CourseCard from './CourseCard';

export default function CourseGrid({ courses = [], onSelectCourse }) {
  if (!courses || courses.length === 0) {
    return (
      <div style={styles.emptyState}>
        <h3 style={styles.emptyTitle}>No hay ramos cargados aún</h3>
        <p style={styles.emptyText}>Los cursos se cargarán automáticamente desde Canvas UC.</p>
      </div>
    );
  }

  return (
    <div style={styles.gridContainer} className="grid-container">
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Mis Ramos</h2>
          <p style={styles.subtitle}>Asignaturas del semestre actual.</p>
        </div>
        <span style={styles.countBadge}>{courses.length} {courses.length === 1 ? 'Curso Activo' : 'Cursos Activos'}</span>
      </div>

      <div style={styles.grid}>
        {courses.map((course) => (
          <CourseCard
            key={course.course_code || course.id}
            course={course}
            onSelect={onSelectCourse}
          />
        ))}
      </div>
    </div>
  );
}

const styles = {
  gridContainer: {
    padding: '32px'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '28px'
  },
  title: {
    fontSize: '24px',
    fontWeight: 700,
    color: 'var(--color-text-primary)',
    letterSpacing: '-0.02em',
    marginBottom: '4px'
  },
  subtitle: {
    fontSize: '14px',
    color: 'var(--color-text-secondary)'
  },
  countBadge: {
    fontSize: '12px',
    fontWeight: 600,
    fontFamily: 'var(--font-mono)',
    color: 'var(--color-text-secondary)',
    backgroundColor: 'var(--color-surface-bg)',
    border: '1px solid var(--color-border)',
    padding: '4px 12px',
    borderRadius: '16px'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '20px'
  },
  emptyState: {
    padding: '64px 32px',
    textAlign: 'center',
    backgroundColor: 'var(--color-elevated-surface)',
    borderRadius: '12px',
    border: '1px solid var(--color-border)',
    margin: '32px'
  },
  emptyTitle: {
    fontSize: '18px',
    fontWeight: 600,
    color: 'var(--color-text-primary)',
    marginBottom: '8px'
  },
  emptyText: {
    fontSize: '14px',
    color: 'var(--color-text-muted)'
  }
};
