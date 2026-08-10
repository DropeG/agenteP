import React, { useState } from 'react';
import { X, Clock, Terminal, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function DetailPanel({ course, tasks, logs, onClose }) {
  const [activeTab, setActiveTab] = useState('timeline'); // 'timeline' | 'console'

  if (!course) return null;

  // Filter tasks & logs for this course
  const courseTasks = tasks.filter(t => t.course_code === course.course_code);
  const courseLogs = logs.filter(l => !l.course_code || l.course_code === course.course_code);

  // Group tasks by Amie-style timeline categories
  const groupTasksByDate = (taskList) => {
    const groups = {
      Today: [],
      Yesterday: [],
      'Last Week': [],
      Past: []
    };

    const now = new Date();
    const todayStr = now.toDateString();

    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();

    const lastWeekLimit = new Date(now);
    lastWeekLimit.setDate(now.getDate() - 7);

    taskList.forEach(task => {
      const taskDate = task.created_at ? new Date(task.created_at) : new Date();
      const dateStr = taskDate.toDateString();

      if (dateStr === todayStr) {
        groups.Today.push(task);
      } else if (dateStr === yesterdayStr) {
        groups.Yesterday.push(task);
      } else if (taskDate >= lastWeekLimit) {
        groups['Last Week'].push(task);
      } else {
        groups.Past.push(task);
      }
    });

    return groups;
  };

  const timelineGroups = groupTasksByDate(courseTasks);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 size={16} color="var(--color-agent-completed)" />;
      case 'processing':
        return <Loader2 size={16} color="var(--color-agent-running)" className="spin" />;
      case 'failed':
        return <AlertCircle size={16} color="var(--color-agent-failed)" />;
      default:
        return <Clock size={16} color="var(--color-agent-waiting)" />;
    }
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.drawer} className="detail-drawer" onClick={e => e.stopPropagation()}>
        
        {/* Drawer Header */}
        <div style={styles.drawerHeader}>
          <div>
            <div style={styles.headerSigla}>{course.course_code}</div>
            <h2 style={styles.headerTitle}>{course.course_name}</h2>
          </div>
          <button onClick={onClose} style={styles.closeButton}>
            <X size={20} color="var(--color-text-primary)" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div style={styles.tabContainer}>
          <button
            onClick={() => setActiveTab('timeline')}
            style={{
              ...styles.tabButton,
              ...(activeTab === 'timeline' ? styles.tabButtonActive : {})
            }}
          >
            <Clock size={16} />
            <span>Línea de Tiempo (Amie)</span>
          </button>

          <button
            onClick={() => setActiveTab('console')}
            style={{
              ...styles.tabButton,
              ...(activeTab === 'console' ? styles.tabButtonActive : {})
            }}
          >
            <Terminal size={16} />
            <span>Consola Agente (`JetBrains Mono`)</span>
          </button>
        </div>

        {/* Tab Content */}
        <div style={styles.contentBody}>
          {activeTab === 'timeline' ? (
            <div style={styles.timelineContainer}>
              {Object.entries(timelineGroups).map(([groupTitle, groupItems]) => {
                if (groupItems.length === 0) return null;

                return (
                  <div key={groupTitle} style={styles.timelineGroup}>
                    <div style={styles.groupHeader}>
                      <span style={styles.groupTitle}>{groupTitle}</span>
                      <span style={styles.groupCount}>{groupItems.length}</span>
                    </div>

                    <div style={styles.taskList}>
                      {groupItems.map(task => (
                        <div key={task.id} style={styles.taskCard}>
                          <div style={styles.taskHeader}>
                            <div style={styles.taskMeta}>
                              {getStatusIcon(task.status)}
                              <span style={styles.taskType}>{task.task_type}</span>
                            </div>
                            <span style={styles.taskTime}>
                              {task.created_at ? new Date(task.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                            </span>
                          </div>

                          <p style={styles.taskPrompt}>{task.prompt}</p>

                          {task.result && (
                            <div style={styles.resultBox}>
                              <span style={styles.resultLabel}>Resultado:</span>
                              <pre style={styles.resultJson}>
                                {JSON.stringify(task.result, null, 2)}
                              </pre>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}

              {courseTasks.length === 0 && (
                <div style={styles.emptyState}>
                  <p>No hay tareas registradas en la línea de tiempo para este ramo.</p>
                </div>
              )}
            </div>
          ) : (
            /* Console View (JetBrains Mono) */
            <div style={styles.consoleContainer}>
              <div style={styles.consoleHeader}>
                <span>TERMINAL LOGS - AGENTE P CORE</span>
                <span>SYSTEM REGISTRY</span>
              </div>
              <div style={styles.consoleBody}>
                {courseLogs.length > 0 ? (
                  courseLogs.map((log, idx) => (
                    <div key={idx} style={styles.logLine}>
                      <span style={styles.logTime}>
                        [{new Date(log.created_at || Date.now()).toLocaleTimeString()}]
                      </span>{' '}
                      <span style={styles.logAgent}>[{log.agent_name || 'System'}]:</span>{' '}
                      <span style={{
                        color: log.level === 'error' ? 'var(--color-agent-failed)' : 
                               log.level === 'warning' ? 'var(--color-warning)' : 'var(--color-text-console)'
                      }}>
                        {log.message}
                      </span>
                    </div>
                  ))
                ) : (
                  <div style={styles.logLine}>
                    [SYSTEM]: Esperando nuevos logs de ejecución en tiempo real desde Supabase...
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(69, 36, 15, 0.2)',
    backdropFilter: 'blur(2px)',
    display: 'flex',
    justifyContent: 'flex-end',
    zIndex: 100
  },
  drawer: {
    width: '560px',
    maxWidth: '90vw',
    height: '100%',
    backgroundColor: 'var(--color-elevated-surface)',
    borderLeft: '1px solid var(--color-border)',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '-4px 0 24px rgba(0,0,0,0.06)'
  },
  drawerHeader: {
    padding: '24px 28px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottom: '1px solid var(--color-border)',
    backgroundColor: 'var(--color-page-bg)'
  },
  headerSigla: {
    fontSize: '12px',
    fontWeight: 700,
    fontFamily: 'var(--font-mono)',
    color: 'var(--color-action-primary)',
    letterSpacing: '0.04em'
  },
  headerTitle: {
    fontSize: '20px',
    fontWeight: 700,
    color: 'var(--color-text-primary)',
    marginTop: '2px'
  },
  closeButton: {
    padding: '6px',
    borderRadius: '6px',
    transition: 'background 0.15s ease'
  },
  tabContainer: {
    display: 'flex',
    borderBottom: '1px solid var(--color-border)',
    padding: '0 28px',
    backgroundColor: 'var(--color-page-bg)',
    gap: '8px'
  },
  tabButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 16px',
    fontSize: '13px',
    fontWeight: 500,
    color: 'var(--color-text-secondary)',
    borderBottom: '2px solid transparent'
  },
  tabButtonActive: {
    color: 'var(--color-action-primary)',
    fontWeight: 600,
    borderBottomColor: 'var(--color-action-primary)'
  },
  contentBody: {
    flex: 1,
    overflowY: 'auto',
    padding: '24px 28px'
  },
  timelineContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  timelineGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  groupHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: '6px',
    borderBottom: '1px solid var(--color-border)'
  },
  groupTitle: {
    fontSize: '12px',
    fontWeight: 700,
    color: 'var(--color-text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.04em'
  },
  groupCount: {
    fontSize: '11px',
    fontWeight: 600,
    fontFamily: 'var(--font-mono)',
    color: 'var(--color-text-secondary)',
    backgroundColor: 'var(--color-surface-bg)',
    padding: '2px 8px',
    borderRadius: '10px'
  },
  taskList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  taskCard: {
    backgroundColor: 'var(--color-page-bg)',
    border: '1px solid var(--color-border)',
    borderRadius: '8px',
    padding: '16px'
  },
  taskHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px'
  },
  taskMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  taskType: {
    fontSize: '12px',
    fontWeight: 600,
    color: 'var(--color-text-primary)'
  },
  taskTime: {
    fontSize: '11px',
    fontFamily: 'var(--font-mono)',
    color: 'var(--color-text-muted)'
  },
  taskPrompt: {
    fontSize: '13px',
    color: 'var(--color-text-secondary)',
    lineHeight: 1.4
  },
  resultBox: {
    marginTop: '12px',
    paddingTop: '12px',
    borderTop: '1px solid var(--color-border)'
  },
  resultLabel: {
    fontSize: '11px',
    fontWeight: 600,
    color: 'var(--color-text-muted)',
    display: 'block',
    marginBottom: '4px'
  },
  resultJson: {
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    backgroundColor: 'var(--color-elevated-surface)',
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid var(--color-border)',
    overflowX: 'auto',
    color: 'var(--color-text-primary)'
  },
  consoleContainer: {
    backgroundColor: 'var(--color-bg-console)',
    borderRadius: '8px',
    border: '1px solid var(--color-border)',
    overflow: 'hidden',
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  consoleHeader: {
    backgroundColor: '#141210',
    padding: '10px 16px',
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '11px',
    fontFamily: 'var(--font-mono)',
    color: 'var(--color-text-muted)',
    borderBottom: '1px solid #2A2622'
  },
  consoleBody: {
    padding: '16px',
    fontFamily: 'var(--font-mono)',
    fontSize: '12px',
    lineHeight: 1.6,
    color: 'var(--color-text-console)',
    flex: 1,
    overflowY: 'auto'
  },
  logLine: {
    marginBottom: '6px',
    wordBreak: 'break-word'
  },
  logTime: {
    color: '#8A8278'
  },
  logAgent: {
    color: 'var(--color-action-primary)',
    fontWeight: 600
  },
  emptyState: {
    padding: '32px 16px',
    textAlign: 'center',
    fontSize: '13px',
    color: 'var(--color-text-muted)'
  }
};
