import React, { useState, useMemo } from 'react';
import { Copy, Check, Calendar, Award, UserCheck, BookOpen } from 'lucide-react';
import calendarEvents from '../../../agents/workspace/calendar.json';

export default function CourseGeneralView({ course }) {
  const [copiedEmail, setCopiedEmail] = useState(null);

  if (!course) return null;

  // Filter calendar events for this course
  const courseEvents = useMemo(() => {
    if (!calendarEvents || !Array.isArray(calendarEvents)) return [];
    return calendarEvents.filter(
      (evt) => evt.course_code?.toUpperCase() === course.course_code?.toUpperCase()
    ).sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [course.course_code]);

  const handleCopyEmail = (email) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    setTimeout(() => {
      setCopiedEmail(null);
    }, 2000);
  };

  // Fallback descriptions for workspace courses
  const defaultDescriptions = {
    IIC2213: "Estudio de sistemas lógicos formales, sintaxis y semántica de la lógica proposicional y de primer orden, modelos formales de razonamiento, satisfacción de fórmulas (SAT) y sus aplicaciones en computación y verificación.",
    IIC2173: "Principios, arquitecturas y patrones de diseño para el desarrollo de aplicaciones web complejas, escalables y mantenibles en producción.",
    IIC2523: "Fundamentos, frameworks e implementación de agentes conversacionales e inteligencia artificial generativa aplicada a problemas reales.",
    IIC2513: "Diseño e implementación de tecnologías web modernas, estándares del W3C, cliente-servidor e interfaces interactivas de usuario.",
    EYP1027: "Conceptos fundamentales de teoría de probabilidades, variables aleatorias, distribuciones y análisis estadístico inferencial para ingeniería."
  };

  const courseDescription = course.description || defaultDescriptions[course.course_code] || "Asignatura académica del semestre actual.";

  return (
    <div style={styles.container} className="course-general-view">
      {/* Toast Notification */}
      {copiedEmail && (
        <div style={styles.toast}>
          <Check size={14} color="var(--color-action-primary)" />
          <span>Email copiado: {copiedEmail}</span>
        </div>
      )}

      {/* Course Main Header */}
      <div style={styles.headerSection}>
        <span style={styles.siglaBadge}>{course.course_code}</span>
        <h1 style={styles.courseTitle}>{course.course_name}</h1>
      </div>

      <div style={styles.gridContent}>
        {/* Left Column: Description & Evaluations */}
        <div style={styles.mainColumn}>
          {/* Description Section */}
          <section style={styles.card}>
            <div style={styles.cardHeader}>
              <BookOpen size={18} style={styles.cardIcon} />
              <h2 style={styles.cardTitle}>Descripción del Curso</h2>
            </div>
            <p style={styles.descriptionText}>{courseDescription}</p>
          </section>

          {/* Evaluations Section */}
          <section style={styles.card}>
            <div style={styles.cardHeader}>
              <Award size={18} style={styles.cardIcon} />
              <h2 style={styles.cardTitle}>Regla de Evaluación y Notas</h2>
            </div>

            {course.evaluations ? (
              <div style={styles.evaluationsContainer}>
                {Object.entries(course.evaluations).map(([key, item]) => (
                  <div key={key} style={styles.evalItem}>
                    <div style={styles.evalHeader}>
                      <span style={styles.evalName}>{key.toUpperCase()}</span>
                      {item.weight && <span style={styles.evalWeight}>{item.weight}%</span>}
                    </div>
                    {item.details && <p style={styles.evalDetails}>{item.details}</p>}
                  </div>
                ))}
              </div>
            ) : (
              <p style={styles.descriptionText}>Sin detalles de evaluación registrados.</p>
            )}

            {/* Key Dates from Calendar */}
            {courseEvents.length > 0 && (
              <div style={styles.eventsSection}>
                <h3 style={styles.eventsSubTitle}>
                  <Calendar size={15} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                  Próximos Hitos en Calendario
                </h3>
                <div style={styles.eventsList}>
                  {courseEvents.map((evt) => {
                    const evtDate = new Date(evt.date);
                    const formattedDate = evtDate.toLocaleDateString('es-CL', {
                      day: '2-digit',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    });
                    return (
                      <div key={evt.id} style={styles.eventRow}>
                        <span style={styles.eventTitle}>{evt.title}</span>
                        <span style={styles.eventDate}>{formattedDate}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Right Column: Teaching Team */}
        <div style={styles.sideColumn}>
          <section style={styles.card}>
            <div style={styles.cardHeader}>
              <UserCheck size={18} style={styles.cardIcon} />
              <h2 style={styles.cardTitle}>Equipo Docente</h2>
            </div>

            {/* Professors */}
            {course.contacts?.professors?.length > 0 && (
              <div style={styles.contactGroup}>
                <h3 style={styles.contactGroupTitle}>Profesor(a)</h3>
                {course.contacts.professors.map((prof, idx) => (
                  <div key={idx} style={styles.contactCard}>
                    <div>
                      <div style={styles.contactName}>{prof.name}</div>
                      <div style={styles.contactEmail}>{prof.email}</div>
                    </div>
                    <button 
                      onClick={() => handleCopyEmail(prof.email)} 
                      style={styles.copyBtn}
                      title="Copiar correo"
                    >
                      {copiedEmail === prof.email ? <Check size={14} color="var(--color-action-primary)" /> : <Copy size={14} />}
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Ayudantes */}
            {course.contacts?.ayudantes?.length > 0 && (
              <div style={styles.contactGroup}>
                <h3 style={styles.contactGroupTitle}>Ayudantes ({course.contacts.ayudantes.length})</h3>
                <div style={styles.ayudantesList}>
                  {course.contacts.ayudantes.map((ayu, idx) => (
                    <div key={idx} style={styles.contactCard}>
                      <div>
                        <div style={styles.contactName}>{ayu.name}</div>
                        <div style={styles.contactEmail}>{ayu.email}</div>
                      </div>
                      <button 
                        onClick={() => handleCopyEmail(ayu.email)} 
                        style={styles.copyBtn}
                        title="Copiar correo"
                      >
                        {copiedEmail === ayu.email ? <Check size={14} color="var(--color-action-primary)" /> : <Copy size={14} />}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '32px',
    maxWidth: '1200px',
    margin: '0 auto',
    position: 'relative'
  },
  toast: {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    backgroundColor: 'var(--color-elevated-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: '8px',
    padding: '10px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '13px',
    fontWeight: 500,
    color: 'var(--color-text-primary)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    zIndex: 100
  },
  headerSection: {
    marginBottom: '28px'
  },
  siglaBadge: {
    display: 'inline-block',
    fontSize: '13px',
    fontWeight: 700,
    fontFamily: 'var(--font-mono)',
    color: 'var(--color-action-primary)',
    letterSpacing: '0.04em',
    marginBottom: '6px',
    textTransform: 'uppercase'
  },
  courseTitle: {
    fontSize: '26px',
    fontWeight: 700,
    color: 'var(--color-text-primary)',
    letterSpacing: '-0.02em',
    lineHeight: 1.2
  },
  gridContent: {
    display: 'grid',
    gridTemplateColumns: '1fr 340px',
    gap: '24px',
    alignItems: 'start'
  },
  mainColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  sideColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  card: {
    backgroundColor: 'var(--color-elevated-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: '12px',
    padding: '24px'
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '16px'
  },
  cardIcon: {
    color: 'var(--color-action-primary)',
    flexShrink: 0
  },
  cardTitle: {
    fontSize: '16px',
    fontWeight: 600,
    color: 'var(--color-text-primary)'
  },
  descriptionText: {
    fontSize: '14.5px',
    lineHeight: 1.6,
    color: 'var(--color-text-secondary)'
  },
  evaluationsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
    marginBottom: '20px'
  },
  evalItem: {
    padding: '14px',
    backgroundColor: 'var(--color-surface-bg)',
    borderRadius: '8px',
    border: '1px solid var(--color-border)'
  },
  evalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '6px'
  },
  evalName: {
    fontSize: '12.5px',
    fontWeight: 700,
    fontFamily: 'var(--font-mono)',
    color: 'var(--color-text-primary)'
  },
  evalWeight: {
    fontSize: '12px',
    fontWeight: 600,
    color: 'var(--color-action-primary)',
    backgroundColor: 'var(--color-elevated-surface)',
    padding: '2px 8px',
    borderRadius: '12px',
    border: '1px solid var(--color-border)'
  },
  evalDetails: {
    fontSize: '13.5px',
    color: 'var(--color-text-secondary)',
    lineHeight: 1.45
  },
  eventsSection: {
    marginTop: '16px',
    paddingTop: '16px',
    borderTop: '1px solid var(--color-border)'
  },
  eventsSubTitle: {
    fontSize: '13.5px',
    fontWeight: 600,
    color: 'var(--color-text-primary)',
    marginBottom: '12px'
  },
  eventsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  eventRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 12px',
    backgroundColor: 'var(--color-surface-bg)',
    borderRadius: '6px',
    fontSize: '13px'
  },
  eventTitle: {
    fontWeight: 500,
    color: 'var(--color-text-primary)'
  },
  eventDate: {
    fontFamily: 'var(--font-mono)',
    fontSize: '12px',
    color: 'var(--color-text-muted)'
  },
  contactGroup: {
    marginBottom: '20px'
  },
  contactGroupTitle: {
    fontSize: '12px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    color: 'var(--color-text-muted)',
    marginBottom: '10px'
  },
  contactCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 12px',
    backgroundColor: 'var(--color-surface-bg)',
    borderRadius: '8px',
    border: '1px solid var(--color-border)',
    marginBottom: '8px'
  },
  contactName: {
    fontSize: '13.5px',
    fontWeight: 600,
    color: 'var(--color-text-primary)'
  },
  contactEmail: {
    fontSize: '12px',
    color: 'var(--color-text-secondary)',
    fontFamily: 'var(--font-mono)'
  },
  copyBtn: {
    padding: '6px',
    borderRadius: '6px',
    color: 'var(--color-text-muted)',
    transition: 'all 0.15s ease'
  },
  ayudantesList: {
    maxHeight: '380px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  }
};
