import React from 'react';

export default function CourseCard({ course }) {
  return (
    <div style={styles.card} className="course-card">
      <div style={styles.header}>
        <span style={styles.sigla}>{course.course_code}</span>
      </div>
      <h3 style={styles.name}>{course.course_name}</h3>
    </div>
  );
}

const styles = {
  card: {
    backgroundColor: 'var(--color-elevated-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: '12px',
    padding: '24px 20px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: '8px',
    minHeight: '120px',
    transition: 'all 0.2s ease',
    position: 'relative'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '4px'
  },
  sigla: {
    fontSize: '13px',
    fontWeight: 700,
    fontFamily: 'var(--font-mono)',
    color: 'var(--color-action-primary)',
    letterSpacing: '0.04em',
    textTransform: 'uppercase'
  },
  name: {
    fontSize: '17px',
    fontWeight: 600,
    color: 'var(--color-text-primary)',
    lineHeight: 1.3,
    letterSpacing: '-0.01em'
  }
};
