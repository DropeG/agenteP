import React, { useMemo } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Calendar, 
  AlertCircle, 
  Check, 
  Tag, 
  Clock, 
  Award,
  ChevronDown,
  ExternalLink,
  FileText
} from 'lucide-react';
import { loadCourseTasks } from '../utils/taskLoader';

export default function CourseTasksView({ course }) {
  if (!course) return null;

  const { upcoming, past } = useMemo(
    () => loadCourseTasks(course.course_code),
    [course.course_code]
  );

  const totalTasks = upcoming.length + past.length;

  return (
    <div style={styles.container} className="course-tasks-view">
      {/* Header */}
      <div style={styles.headerSection}>
        <span style={styles.siglaBadge}>{course.course_code}</span>
        <h1 style={styles.courseTitle}>Tareas del Curso</h1>
        <div style={styles.statsRow}>
          <span style={styles.statPillPending}>
            <span style={styles.dotPending} /> {upcoming.length} próximas
          </span>
          <span style={styles.statPillCompleted}>
            <span style={styles.dotCompleted} /> {past.length} pasadas
          </span>
        </div>
      </div>

      {totalTasks === 0 ? (
        <div style={styles.emptyState}>
          <FileText size={36} color="var(--color-text-muted)" style={{ marginBottom: '12px' }} />
          <h3 style={styles.emptyTitle}>No hay tareas registradas</h3>
          <p style={styles.emptySubtitle}>
            Aún no se han sincronizado tareas o evaluaciones para este curso en el workspace.
          </p>
        </div>
      ) : (
        <div style={styles.sectionsLayout}>
          {/* Section 1: Próximas Tareas */}
          <section style={styles.section}>
            <div style={styles.sectionHeader}>
              <div style={styles.sectionTitleRow}>
                <Circle size={15} style={{ color: 'var(--color-action-primary)' }} />
                <h2 style={styles.sectionTitle}>Próximas Tareas ({upcoming.length})</h2>
              </div>
            </div>

            {upcoming.length === 0 ? (
              <div style={styles.emptySubSection}>
                <CheckCircle2 size={16} color="var(--color-text-muted)" />
                <span>No tienes tareas pendientes por ahora. ¡Al día!</span>
              </div>
            ) : (
              <div style={styles.taskList}>
                {upcoming.map((task) => {
                  const pointsText = task.points?.possible != null 
                    ? `${task.points.possible} pts` 
                    : null;

                  return (
                    <div key={task.id} style={styles.taskCardPending}>
                      <div style={styles.taskHeader}>
                        <div style={styles.checkboxVisual} title={task.status === 'submitted' ? 'Entregada' : 'Pendiente'}>
                          {task.status === 'submitted' ? (
                            <CheckCircle2 size={18} color="var(--color-action-primary)" />
                          ) : (
                            <Circle size={18} color="var(--color-text-muted)" />
                          )}
                        </div>
                        <div style={styles.taskContent}>
                          <div style={styles.taskTitleRow}>
                            <h3 style={styles.taskTitle}>{task.title}</h3>
                            {task.source?.url && (
                              <a 
                                href={task.source.url} 
                                target="_blank" 
                                rel="noreferrer" 
                                style={styles.externalLink}
                                title="Ver en Canvas"
                              >
                                <ExternalLink size={13} />
                              </a>
                            )}
                          </div>

                          <div style={styles.taskMetaRow}>
                            {task.dates?.due_at && (
                              <span style={styles.metaItem}>
                                <Calendar size={13} style={{ marginRight: '4px' }} />
                                Fecha de entrega: {task.formattedDue}
                              </span>
                            )}

                            {task.dates?.unlock_at && task.dates.unlock_at !== task.dates.due_at && (
                              <span style={styles.metaItemMuted}>
                                <Clock size={12} style={{ marginRight: '4px' }} />
                                Desde: {task.formattedUnlock}
                              </span>
                            )}

                            {task.relativeTime && (
                              <span style={task.urgent ? styles.urgentBadge : styles.daysBadge}>
                                {task.urgent && <AlertCircle size={11} style={{ marginRight: '3px' }} />}
                                {task.relativeTime}
                              </span>
                            )}

                            {pointsText && (
                              <span style={styles.pointsBadge}>
                                <Award size={11} style={{ marginRight: '3px' }} />
                                {pointsText}
                              </span>
                            )}

                            {task.category && (
                              <span style={styles.categoryBadge}>
                                <Tag size={11} style={{ marginRight: '3px' }} />
                                {task.category.toUpperCase().replace(/_/g, ' ')}
                              </span>
                            )}

                            {task.status === 'submitted' && (
                              <span style={styles.submittedBadge}>
                                <Check size={11} style={{ marginRight: '3px' }} />
                                Entregado
                              </span>
                            )}
                          </div>

                          {task.details?.description_md && (
                            <p style={styles.taskDescription}>{task.details.description_md}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Section 2: Tareas Pasadas */}
          <section style={styles.section}>
            <div style={styles.sectionHeader}>
              <div style={styles.sectionTitleRow}>
                <CheckCircle2 size={15} style={{ color: 'var(--color-text-muted)' }} />
                <h2 style={styles.sectionTitle}>Tareas Pasadas ({past.length})</h2>
              </div>
            </div>

            {past.length === 0 ? (
              <div style={styles.emptySubSection}>
                <span>No hay tareas pasadas registradas.</span>
              </div>
            ) : (
              <div style={styles.taskList}>
                {past.map((task) => {
                  const scoreDisplay = task.points?.score != null && task.points?.possible != null
                    ? `${task.points.score}/${task.points.possible} pts`
                    : task.points?.possible != null
                    ? `${task.points.possible} pts`
                    : null;

                  return (
                    <div key={task.id} style={styles.taskCardCompleted}>
                      <div style={styles.taskHeader}>
                        <div style={styles.checkboxVisualCompleted} title="Tarea pasada / cerrada">
                          <CheckCircle2 size={18} color="var(--color-text-muted)" />
                        </div>
                        <div style={styles.taskContent}>
                          <div style={styles.taskTitleRow}>
                            <h3 style={styles.taskTitleCompleted}>{task.title}</h3>
                            {task.source?.url && (
                              <a 
                                href={task.source.url} 
                                target="_blank" 
                                rel="noreferrer" 
                                style={styles.externalLinkMuted}
                                title="Ver en Canvas"
                              >
                                <ExternalLink size={13} />
                              </a>
                            )}
                          </div>

                          <div style={styles.taskMetaRow}>
                            <span style={styles.closedBadge}>Cerrado</span>

                            {task.dates?.due_at && (
                              <span style={styles.metaItemCompleted}>
                                <Calendar size={13} style={{ marginRight: '4px' }} />
                                Venció: {task.formattedDue}
                              </span>
                            )}

                            {scoreDisplay && (
                              <span style={styles.pointsBadgeMuted}>
                                <Award size={11} style={{ marginRight: '3px' }} />
                                {scoreDisplay}
                              </span>
                            )}

                            {task.category && (
                              <span style={styles.categoryBadgeMuted}>
                                <Tag size={11} style={{ marginRight: '3px' }} />
                                {task.category.toUpperCase().replace(/_/g, ' ')}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: '32px',
    maxWidth: '960px',
    margin: '0 auto',
    width: '100%'
  },
  headerSection: {
    marginBottom: '28px'
  },
  siglaBadge: {
    display: 'inline-block',
    fontSize: '12.5px',
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
    lineHeight: 1.2,
    marginBottom: '10px'
  },
  statsRow: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center'
  },
  statPillPending: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '12px',
    fontWeight: 500,
    color: 'var(--color-text-secondary)',
    backgroundColor: 'var(--color-surface-bg)',
    padding: '3px 10px',
    borderRadius: '12px',
    border: '1px solid var(--color-border)'
  },
  dotPending: {
    width: '7px',
    height: '7px',
    borderRadius: '50%',
    backgroundColor: 'var(--brand-orange, #F99814)'
  },
  statPillCompleted: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '12px',
    fontWeight: 500,
    color: 'var(--color-text-secondary)',
    backgroundColor: 'var(--color-surface-bg)',
    padding: '3px 10px',
    borderRadius: '12px',
    border: '1px solid var(--color-border)'
  },
  dotCompleted: {
    width: '7px',
    height: '7px',
    borderRadius: '50%',
    backgroundColor: 'var(--color-text-muted)'
  },
  sectionsLayout: {
    display: 'flex',
    flexDirection: 'column',
    gap: '32px'
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: '8px',
    borderBottom: '1px solid var(--color-border)'
  },
  sectionTitleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  sectionTitle: {
    fontSize: '14.5px',
    fontWeight: 600,
    color: 'var(--color-text-primary)',
    letterSpacing: '-0.01em'
  },
  taskList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  taskCardPending: {
    backgroundColor: 'var(--color-elevated-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: '10px',
    padding: '16px 18px',
    transition: 'all 0.15s ease',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.02)'
  },
  taskCardCompleted: {
    backgroundColor: 'var(--color-surface-bg)',
    border: '1px solid var(--color-border)',
    borderRadius: '10px',
    padding: '14px 18px',
    opacity: 0.85
  },
  taskHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px'
  },
  checkboxVisual: {
    marginTop: '2px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--color-text-muted)'
  },
  checkboxVisualCompleted: {
    marginTop: '2px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  taskContent: {
    flex: 1,
    minWidth: 0
  },
  taskTitleRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '8px',
    marginBottom: '6px'
  },
  taskTitle: {
    fontSize: '14.5px',
    fontWeight: 600,
    color: 'var(--color-text-primary)',
    lineHeight: 1.35
  },
  taskTitleCompleted: {
    fontSize: '14px',
    fontWeight: 500,
    color: 'var(--color-text-secondary)',
    lineHeight: 1.35
  },
  externalLink: {
    color: 'var(--color-text-muted)',
    display: 'inline-flex',
    alignItems: 'center',
    padding: '2px',
    borderRadius: '4px',
    transition: 'color 0.15s ease'
  },
  externalLinkMuted: {
    color: 'var(--color-text-muted)',
    display: 'inline-flex',
    alignItems: 'center',
    opacity: 0.6
  },
  taskMetaRow: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: '10px',
    fontSize: '12px',
    color: 'var(--color-text-secondary)'
  },
  metaItem: {
    display: 'inline-flex',
    alignItems: 'center',
    fontFamily: 'var(--font-mono)',
    fontSize: '11.5px',
    color: 'var(--color-text-secondary)'
  },
  metaItemMuted: {
    display: 'inline-flex',
    alignItems: 'center',
    fontFamily: 'var(--font-mono)',
    fontSize: '11.5px',
    color: 'var(--color-text-muted)'
  },
  metaItemCompleted: {
    display: 'inline-flex',
    alignItems: 'center',
    fontFamily: 'var(--font-mono)',
    fontSize: '11.5px',
    color: 'var(--color-text-muted)'
  },
  urgentBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    fontSize: '11px',
    fontWeight: 700,
    fontFamily: 'var(--font-mono)',
    color: 'var(--brand-orange, #F99814)',
    backgroundColor: 'rgba(249, 152, 20, 0.08)',
    border: '1px solid rgba(249, 152, 20, 0.25)',
    padding: '1px 7px',
    borderRadius: '8px'
  },
  daysBadge: {
    fontSize: '11px',
    fontWeight: 600,
    fontFamily: 'var(--font-mono)',
    color: 'var(--color-text-muted)',
    backgroundColor: 'var(--color-surface-bg)',
    border: '1px solid var(--color-border)',
    padding: '1px 7px',
    borderRadius: '8px'
  },
  closedBadge: {
    fontSize: '10.5px',
    fontWeight: 600,
    fontFamily: 'var(--font-mono)',
    color: 'var(--color-text-muted)',
    backgroundColor: 'var(--color-surface-bg)',
    border: '1px solid var(--color-border)',
    padding: '1px 6px',
    borderRadius: '6px'
  },
  pointsBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    fontSize: '11px',
    fontWeight: 600,
    fontFamily: 'var(--font-mono)',
    color: 'var(--color-text-primary)',
    backgroundColor: 'var(--color-surface-bg)',
    border: '1px solid var(--color-border)',
    padding: '1px 7px',
    borderRadius: '8px'
  },
  pointsBadgeMuted: {
    display: 'inline-flex',
    alignItems: 'center',
    fontSize: '11px',
    fontWeight: 500,
    fontFamily: 'var(--font-mono)',
    color: 'var(--color-text-muted)',
    backgroundColor: 'var(--color-surface-bg)',
    border: '1px solid var(--color-border)',
    padding: '1px 6px',
    borderRadius: '6px'
  },
  categoryBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    fontSize: '10.5px',
    fontWeight: 600,
    fontFamily: 'var(--font-mono)',
    color: 'var(--color-action-primary)',
    backgroundColor: 'var(--color-surface-bg)',
    border: '1px solid var(--color-border)',
    padding: '1px 7px',
    borderRadius: '8px'
  },
  categoryBadgeMuted: {
    display: 'inline-flex',
    alignItems: 'center',
    fontSize: '10.5px',
    fontWeight: 500,
    fontFamily: 'var(--font-mono)',
    color: 'var(--color-text-muted)',
    backgroundColor: 'var(--color-elevated-surface)',
    border: '1px solid var(--color-border)',
    padding: '1px 6px',
    borderRadius: '6px'
  },
  submittedBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    fontSize: '10.5px',
    fontWeight: 600,
    fontFamily: 'var(--font-mono)',
    color: 'var(--color-action-primary)',
    backgroundColor: 'rgba(0, 163, 166, 0.08)',
    border: '1px solid rgba(0, 163, 166, 0.25)',
    padding: '1px 7px',
    borderRadius: '8px'
  },
  taskDescription: {
    fontSize: '12.5px',
    color: 'var(--color-text-secondary)',
    lineHeight: 1.45,
    marginTop: '8px',
    padding: '8px 12px',
    backgroundColor: 'var(--color-surface-bg)',
    borderRadius: '6px',
    border: '1px solid var(--color-border)'
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '48px 24px',
    textAlign: 'center',
    backgroundColor: 'var(--color-surface-bg)',
    borderRadius: '12px',
    border: '1px solid var(--color-border)'
  },
  emptyTitle: {
    fontSize: '16px',
    fontWeight: 600,
    color: 'var(--color-text-primary)',
    marginBottom: '6px'
  },
  emptySubtitle: {
    fontSize: '13px',
    color: 'var(--color-text-muted)',
    maxWidth: '380px'
  },
  emptySubSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '12.5px',
    color: 'var(--color-text-muted)',
    padding: '14px 16px',
    backgroundColor: 'var(--color-surface-bg)',
    borderRadius: '8px',
    border: '1px dashed var(--color-border)'
  }
};
