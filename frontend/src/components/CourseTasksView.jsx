import React, { useState } from 'react';
import { CheckCircle2, Circle, Calendar, AlertCircle, Check, Tag } from 'lucide-react';

export default function CourseTasksView({ course }) {
  if (!course) return null;

  // Mock tasks tailored for UC courses or standard defaults
  const courseTasks = {
    IIC2523: {
      pending: [
        {
          id: 'p1',
          title: 'Entrega 1: Agente Conversacional en LangChain & Tools',
          dueDate: '18 Ago, 23:59 hrs',
          daysLeft: 'En 3 días',
          urgent: true,
          category: 'PROYECTO',
          weight: '15%'
        },
        {
          id: 'p2',
          title: 'Control 2: Evaluaciones de LLMs y RAG Avanzado',
          dueDate: '25 Ago, 23:59 hrs',
          daysLeft: 'En 10 días',
          urgent: false,
          category: 'CONTROLES',
          weight: '5%'
        }
      ],
      completed: [
        {
          id: 'c1',
          title: 'Actividad Formativa 1: Prompt Engineering y Estructura JSON',
          completedDate: '04 Ago, 18:30 hrs',
          category: 'ACTIVIDADES FORMATIVAS'
        },
        {
          id: 'c2',
          title: 'Tarea 0: Configuración de Entornos Python y OpenAI API',
          completedDate: '01 Ago, 22:15 hrs',
          category: 'PROYECTO'
        }
      ]
    },
    IIC2213: {
      pending: [
        {
          id: 'p1',
          title: 'Tarea 1: Algoritmos de Model Checking y SAT Solvers',
          dueDate: '20 Ago, 23:59 hrs',
          daysLeft: 'En 5 días',
          urgent: false,
          category: 'TAREAS',
          weight: '20%'
        }
      ],
      completed: [
        {
          id: 'c1',
          title: 'Control 1: Lógica Proposicional y Tablas de Verdad',
          completedDate: '08 Ago, 14:00 hrs',
          category: 'CONTROLES'
        }
      ]
    }
  };

  const defaultTasks = {
    pending: [
      {
        id: 'p1',
        title: 'Entrega de Avance 1',
        dueDate: '20 Ago, 23:59 hrs',
        daysLeft: 'En 5 días',
        urgent: true,
        category: 'PROYECTO',
        weight: '15%'
      },
      {
        id: 'p2',
        title: 'Control Práctico de Contenido',
        dueDate: '28 Ago, 23:59 hrs',
        daysLeft: 'En 13 días',
        urgent: false,
        category: 'EVALUACIONES',
        weight: '10%'
      }
    ],
    completed: [
      {
        id: 'c1',
        title: 'Actividad 1: Diagnóstico Inicial',
        completedDate: '02 Ago, 20:00 hrs',
        category: 'TAREAS'
      }
    ]
  };

  const tasksData = courseTasks[course.course_code] || defaultTasks;
  const pendingTasks = tasksData.pending;
  const completedTasks = tasksData.completed;

  return (
    <div style={styles.container} className="course-tasks-view">
      {/* Header */}
      <div style={styles.headerSection}>
        <span style={styles.siglaBadge}>{course.course_code}</span>
        <h1 style={styles.courseTitle}>Tareas del Curso</h1>
        <div style={styles.statsRow}>
          <span style={styles.statPillPending}>
            <span style={styles.dotPending} /> {pendingTasks.length} pendientes
          </span>
          <span style={styles.statPillCompleted}>
            <span style={styles.dotCompleted} /> {completedTasks.length} completadas
          </span>
        </div>
      </div>

      <div style={styles.sectionsLayout}>
        {/* Section 1: Tareas por Hacer (Pendientes) */}
        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <div style={styles.sectionTitleRow}>
              <Circle size={16} style={{ color: 'var(--color-action-primary)' }} />
              <h2 style={styles.sectionTitle}>Tareas por hacer ({pendingTasks.length})</h2>
            </div>
          </div>

          <div style={styles.taskList}>
            {pendingTasks.map((task) => (
              <div key={task.id} style={styles.taskCardPending}>
                <div style={styles.taskHeader}>
                  <div style={styles.checkboxVisual} title="Marcar como completada">
                    <Circle size={18} color="var(--color-text-muted)" />
                  </div>
                  <div style={styles.taskContent}>
                    <h3 style={styles.taskTitle}>{task.title}</h3>
                    <div style={styles.taskMetaRow}>
                      <span style={styles.metaItem}>
                        <Calendar size={13} style={{ marginRight: '4px' }} />
                        Vence: {task.dueDate}
                      </span>
                      {task.urgent ? (
                        <span style={styles.urgentBadge}>
                          <AlertCircle size={12} style={{ marginRight: '3px' }} />
                          {task.daysLeft}
                        </span>
                      ) : (
                        <span style={styles.daysBadge}>{task.daysLeft}</span>
                      )}
                      {task.category && (
                        <span style={styles.categoryBadge}>
                          <Tag size={11} style={{ marginRight: '3px' }} />
                          {task.category} {task.weight && `· ${task.weight}`}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2: Tareas ya hechas (Completadas) */}
        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <div style={styles.sectionTitleRow}>
              <CheckCircle2 size={16} style={{ color: 'var(--color-action-primary)' }} />
              <h2 style={styles.sectionTitle}>Tareas ya hechas ({completedTasks.length})</h2>
            </div>
          </div>

          <div style={styles.taskList}>
            {completedTasks.map((task) => (
              <div key={task.id} style={styles.taskCardCompleted}>
                <div style={styles.taskHeader}>
                  <div style={styles.checkboxVisualCompleted} title="Tarea completada">
                    <CheckCircle2 size={18} color="var(--color-action-primary)" />
                  </div>
                  <div style={styles.taskContent}>
                    <h3 style={styles.taskTitleCompleted}>{task.title}</h3>
                    <div style={styles.taskMetaRow}>
                      <span style={styles.metaItemCompleted}>
                        <Check size={12} style={{ marginRight: '4px', color: 'var(--color-action-primary)' }} />
                        Entregado: {task.completedDate}
                      </span>
                      {task.category && (
                        <span style={styles.categoryBadgeMuted}>
                          {task.category}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '32px',
    maxWidth: '1000px',
    margin: '0 auto'
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
    lineHeight: 1.2,
    marginBottom: '10px'
  },
  statsRow: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center'
  },
  statPillPending: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '12.5px',
    fontWeight: 500,
    color: 'var(--color-text-secondary)',
    backgroundColor: 'var(--color-surface-bg)',
    padding: '4px 10px',
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
    fontSize: '12.5px',
    fontWeight: 500,
    color: 'var(--color-text-secondary)',
    backgroundColor: 'var(--color-surface-bg)',
    padding: '4px 10px',
    borderRadius: '12px',
    border: '1px solid var(--color-border)'
  },
  dotCompleted: {
    width: '7px',
    height: '7px',
    borderRadius: '50%',
    backgroundColor: 'var(--color-action-primary)'
  },
  sectionsLayout: {
    display: 'flex',
    flexDirection: 'column',
    gap: '32px'
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px'
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
    fontSize: '15px',
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
    borderRadius: '12px',
    padding: '16px 20px',
    transition: 'all 0.15s ease',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)'
  },
  taskCardCompleted: {
    backgroundColor: 'var(--color-surface-bg)',
    border: '1px solid var(--color-border)',
    borderRadius: '12px',
    padding: '14px 18px',
    opacity: 0.9
  },
  taskHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '14px'
  },
  checkboxVisual: {
    marginTop: '2px',
    cursor: 'pointer',
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
    flex: 1
  },
  taskTitle: {
    fontSize: '15px',
    fontWeight: 600,
    color: 'var(--color-text-primary)',
    lineHeight: 1.35,
    marginBottom: '6px'
  },
  taskTitleCompleted: {
    fontSize: '14.5px',
    fontWeight: 500,
    color: 'var(--color-text-secondary)',
    lineHeight: 1.35,
    marginBottom: '6px',
    textDecoration: 'line-through'
  },
  taskMetaRow: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: '12px',
    fontSize: '12.5px',
    color: 'var(--color-text-secondary)'
  },
  metaItem: {
    display: 'inline-flex',
    alignItems: 'center',
    fontFamily: 'var(--font-mono)',
    fontSize: '12px',
    color: 'var(--color-text-secondary)'
  },
  metaItemCompleted: {
    display: 'inline-flex',
    alignItems: 'center',
    fontFamily: 'var(--font-mono)',
    fontSize: '12px',
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
    padding: '2px 8px',
    borderRadius: '10px'
  },
  daysBadge: {
    fontSize: '11px',
    fontWeight: 600,
    fontFamily: 'var(--font-mono)',
    color: 'var(--color-text-muted)',
    backgroundColor: 'var(--color-surface-bg)',
    border: '1px solid var(--color-border)',
    padding: '2px 8px',
    borderRadius: '10px'
  },
  categoryBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    fontSize: '11px',
    fontWeight: 600,
    fontFamily: 'var(--font-mono)',
    color: 'var(--color-action-primary)',
    backgroundColor: 'var(--color-surface-bg)',
    border: '1px solid var(--color-border)',
    padding: '2px 8px',
    borderRadius: '10px'
  },
  categoryBadgeMuted: {
    display: 'inline-flex',
    alignItems: 'center',
    fontSize: '11px',
    fontWeight: 500,
    fontFamily: 'var(--font-mono)',
    color: 'var(--color-text-muted)',
    backgroundColor: 'var(--color-elevated-surface)',
    border: '1px solid var(--color-border)',
    padding: '2px 8px',
    borderRadius: '10px'
  }
};
