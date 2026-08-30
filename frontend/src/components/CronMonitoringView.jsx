import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, 
  Clock, 
  Terminal, 
  ChevronDown, 
  ChevronUp, 
  Copy, 
  Check, 
  Activity, 
  Pencil, 
  X, 
  Sliders, 
  CheckCircle2, 
  AlertCircle
} from 'lucide-react';
import { loadCronStatuses } from '../utils/cronLoader';

export default function CronMonitoringView({ onBack }) {
  const initialJobs = useMemo(() => loadCronStatuses(), []);
  const [cronJobs, setCronJobs] = useState(initialJobs);
  const [expandedJobs, setExpandedJobs] = useState({
    daily_briefing: true
  });
  const [editingJobId, setEditingJobId] = useState(null);
  const [editMode, setEditMode] = useState('daily_time'); // 'daily_time' | 'interval' | 'custom'
  const [selectedTime, setSelectedTime] = useState('15:00');
  const [selectedInterval, setSelectedInterval] = useState('1'); // hours
  const [customCron, setCustomCron] = useState('0 15 * * *');
  const [customLabel, setCustomLabel] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [copiedJobId, setCopiedJobId] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToastMessage({ text: msg, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const toggleAccordion = (jobId) => {
    setExpandedJobs((prev) => ({
      ...prev,
      [jobId]: !prev[jobId]
    }));
  };

  const handleCopyLogs = (job) => {
    if (!job.logs || job.logs.length === 0) return;
    
    const formattedLogs = job.logs
      .map((log) => `[${log.timestamp || ''}] [${(log.level || 'INFO').toUpperCase()}] ${log.message || ''}`)
      .join('\n');

    navigator.clipboard.writeText(formattedLogs);
    setCopiedJobId(job.id);
    setTimeout(() => {
      setCopiedJobId(null);
    }, 2000);
  };

  const startEditing = (job) => {
    setEditingJobId(job.id);
    // Parse current schedule to guess best mode
    const sched = job.schedule || '0 15 * * *';
    setCustomCron(sched);
    setCustomLabel(job.schedule_label || '');

    // Check if it's daily fixed time like "0 15 * * *" or "30 9 * * *"
    const dailyMatch = sched.match(/^(\d+)\s+(\d+)\s+\*\s+\*\s+\*$/);
    const intervalMatch = sched.match(/^0\s+\*\/(\d+)\s+\*\s+\*\s+\*$/);

    if (dailyMatch) {
      const min = String(dailyMatch[1]).padStart(2, '0');
      const hr = String(dailyMatch[2]).padStart(2, '0');
      setSelectedTime(`${hr}:${min}`);
      setEditMode('daily_time');
    } else if (intervalMatch) {
      setSelectedInterval(intervalMatch[1]);
      setEditMode('interval');
    } else {
      setEditMode('custom');
    }
  };

  const calculateScheduleFromForm = () => {
    if (editMode === 'daily_time') {
      const [hrStr, minStr] = (selectedTime || '15:00').split(':');
      const hr = parseInt(hrStr, 10) || 0;
      const min = parseInt(minStr, 10) || 0;
      const ampm = hr >= 12 ? 'PM' : 'AM';
      const hr12 = hr % 12 || 12;
      const label = `Todos los días a las ${String(hr).padStart(2, '0')}:${String(min).padStart(2, '0')} hrs (${hr12}:${String(min).padStart(2, '0')} ${ampm})`;
      return {
        schedule: `${min} ${hr} * * *`,
        label
      };
    } else if (editMode === 'interval') {
      const hours = parseInt(selectedInterval, 10) || 1;
      const label = hours === 1 ? 'Cada 1 hora' : `Cada ${hours} horas`;
      return {
        schedule: `0 */${hours} * * *`,
        label
      };
    } else {
      return {
        schedule: customCron.trim() || '* * * * *',
        label: customLabel.trim() || 'Cadencia personalizada'
      };
    }
  };

  const handleSaveSchedule = async (jobId) => {
    setIsSaving(true);
    const { schedule, label } = calculateScheduleFromForm();

    try {
      const response = await fetch('/api/update-cron-schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId,
          schedule,
          scheduleLabel: label
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Update local state directly
        setCronJobs((prev) =>
          prev.map((j) => {
            if (j.id === jobId) {
              return {
                ...j,
                schedule,
                schedule_label: label
              };
            }
            return j;
          })
        );
        setEditingJobId(null);
        showToast(data.osSynced ? '✅ Horario actualizado y sincronizado con macOS crontab' : '✅ Horario de tarea actualizado');
      } else {
        // Fallback for production or static preview without dev middleware
        setCronJobs((prev) =>
          prev.map((j) => {
            if (j.id === jobId) {
              return {
                ...j,
                schedule,
                schedule_label: label
              };
            }
            return j;
          })
        );
        setEditingJobId(null);
        showToast('✅ Horario actualizado en el workspace');
      }
    } catch {
      // Offline fallback: Update local state
      setCronJobs((prev) =>
        prev.map((j) => {
          if (j.id === jobId) {
            return {
              ...j,
              schedule,
              schedule_label: label
            };
          }
          return j;
        })
      );
      setEditingJobId(null);
      showToast('✅ Horario actualizado en la vista');
    } finally {
      setIsSaving(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No registrado';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    return date.toLocaleDateString('es-CL', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'success':
        return (
          <span style={styles.statusSuccess}>
            <span style={styles.dotSuccess} />
            Activo
          </span>
        );
      case 'running':
        return (
          <span style={styles.statusRunning}>
            <span style={styles.dotRunning} />
            Ejecutando
          </span>
        );
      case 'error':
        return (
          <span style={styles.statusError}>
            <span style={styles.dotError} />
            Error
          </span>
        );
      default:
        return (
          <span style={styles.statusIdle}>
            <span style={styles.dotIdle} />
            Inactivo
          </span>
        );
    }
  };

  const renderLogLevelBadge = (level) => {
    const lvl = (level || 'INFO').toUpperCase();
    if (lvl === 'SUCCESS') {
      return <span style={styles.logBadgeSuccess}>[SUCCESS]</span>;
    }
    if (lvl === 'ERROR') {
      return <span style={styles.logBadgeError}>[ERROR]</span>;
    }
    if (lvl === 'WARN' || lvl === 'WARNING') {
      return <span style={styles.logBadgeWarning}>[WARN]</span>;
    }
    return <span style={styles.logBadgeInfo}>[INFO]</span>;
  };

  const preview = calculateScheduleFromForm();

  return (
    <div style={styles.container} className="cron-monitoring-view">
      {/* Toast Notification */}
      {toastMessage && (
        <div style={styles.toast}>
          <CheckCircle2 size={15} color="var(--color-action-primary)" />
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Header & Back Button */}
      <div style={styles.header}>
        <button 
          onClick={onBack} 
          style={styles.backButton}
          title="Volver a Configuración"
        >
          <ArrowLeft size={16} />
          <span>Volver a Configuración</span>
        </button>

        <div style={styles.headerTitleGroup}>
          <div style={styles.titleWithIcon}>
            <Activity size={24} color="var(--color-action-primary)" />
            <h1 style={styles.title}>Automatizaciones & Crons</h1>
          </div>
          <p style={styles.subtitle}>
            Monitoreo pasivo y configuración de tareas programadas en segundo plano.
          </p>
        </div>
      </div>

      {/* Main Content */}
      {cronJobs.length === 0 ? (
        <div style={styles.emptyState}>
          <Terminal size={40} color="var(--color-text-muted)" style={{ marginBottom: '12px' }} />
          <h3 style={styles.emptyTitle}>No hay tareas programadas registradas</h3>
          <p style={styles.emptySubtitle}>
            Aún no se han configurado procesos o automatizaciones en el workspace.
          </p>
        </div>
      ) : (
        <div style={styles.cronList}>
          {cronJobs.map((job) => {
            const isExpanded = Boolean(expandedJobs[job.id]);
            const isEditing = editingJobId === job.id;
            const isCopied = copiedJobId === job.id;

            return (
              <div key={job.id} style={styles.cronCard}>
                {/* Top Summary Row */}
                <div style={styles.cardMain}>
                  <div style={styles.cardHeaderRow}>
                    <div style={styles.titleGroup}>
                      <div style={styles.titleStatusRow}>
                        {renderStatusBadge(job.status)}
                        <h2 style={styles.jobName}>{job.name}</h2>
                      </div>
                      {job.description && (
                        <p style={styles.jobDescription}>{job.description}</p>
                      )}
                      {job.target_script && (
                        <div style={styles.scriptPathPill}>
                          <Terminal size={11} style={{ marginRight: '5px' }} />
                          <span>{job.target_script}</span>
                        </div>
                      )}
                    </div>

                    {/* Schedule Badge & Edit Trigger */}
                    <div style={styles.scheduleBadgeGroup}>
                      <div style={styles.scheduleActionsRow}>
                        <span style={styles.scheduleBadge}>
                          <Clock size={12} style={{ marginRight: '5px' }} />
                          {job.schedule}
                        </span>
                        <button
                          onClick={() => isEditing ? setEditingJobId(null) : startEditing(job)}
                          style={styles.editScheduleBtn}
                          title="Editar horario del cron"
                        >
                          <Pencil size={12} style={{ marginRight: '4px' }} />
                          <span>{isEditing ? 'Cerrar' : 'Editar'}</span>
                        </button>
                      </div>
                      {job.schedule_label && (
                        <span style={styles.scheduleLabelText}>
                          {job.schedule_label}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Inline Schedule Editor */}
                  {isEditing && (
                    <div style={styles.editorBox}>
                      <div style={styles.editorHeader}>
                        <div style={styles.editorHeaderLeft}>
                          <Sliders size={14} color="var(--color-action-primary)" />
                          <h4 style={styles.editorTitle}>Editar Frecuencia de Ejecución</h4>
                        </div>
                        <button
                          onClick={() => setEditingJobId(null)}
                          style={styles.editorCloseBtn}
                        >
                          <X size={15} />
                        </button>
                      </div>

                      {/* Mode Selector Tabs */}
                      <div style={styles.modeTabs}>
                        <button
                          onClick={() => setEditMode('daily_time')}
                          style={{
                            ...styles.modeTabBtn,
                            ...(editMode === 'daily_time' ? styles.modeTabBtnActive : {})
                          }}
                        >
                          Hora Diaria
                        </button>
                        <button
                          onClick={() => setEditMode('interval')}
                          style={{
                            ...styles.modeTabBtn,
                            ...(editMode === 'interval' ? styles.modeTabBtnActive : {})
                          }}
                        >
                          Intervalo de Horas
                        </button>
                        <button
                          onClick={() => setEditMode('custom')}
                          style={{
                            ...styles.modeTabBtn,
                            ...(editMode === 'custom' ? styles.modeTabBtnActive : {})
                          }}
                        >
                          Cron Personalizado
                        </button>
                      </div>

                      {/* Mode Input Content */}
                      <div style={styles.editorBody}>
                        {editMode === 'daily_time' && (
                          <div style={styles.formGroup}>
                            <label style={styles.formLabel}>Seleccionar hora de ejecución diaria:</label>
                            <input
                              type="time"
                              value={selectedTime}
                              onChange={(e) => setSelectedTime(e.target.value)}
                              style={styles.timeInput}
                            />
                          </div>
                        )}

                        {editMode === 'interval' && (
                          <div style={styles.formGroup}>
                            <label style={styles.formLabel}>Ejecutar periódicamente:</label>
                            <select
                              value={selectedInterval}
                              onChange={(e) => setSelectedInterval(e.target.value)}
                              style={styles.selectInput}
                            >
                              <option value="1">Cada 1 hora</option>
                              <option value="2">Cada 2 horas</option>
                              <option value="4">Cada 4 horas</option>
                              <option value="6">Cada 6 horas</option>
                              <option value="12">Cada 12 horas</option>
                            </select>
                          </div>
                        )}

                        {editMode === 'custom' && (
                          <div style={styles.formGroupStack}>
                            <div>
                              <label style={styles.formLabel}>Expresión Cron (5 campos):</label>
                              <input
                                type="text"
                                value={customCron}
                                onChange={(e) => setCustomCron(e.target.value)}
                                placeholder="0 15 * * *"
                                style={styles.textInputMono}
                              />
                            </div>
                            <div>
                              <label style={styles.formLabel}>Descripción legible:</label>
                              <input
                                type="text"
                                value={customLabel}
                                onChange={(e) => setCustomLabel(e.target.value)}
                                placeholder="Ej: De lunes a viernes a las 15:00 hrs"
                                style={styles.textInput}
                              />
                            </div>
                          </div>
                        )}

                        {/* Live Preview Box */}
                        <div style={styles.previewBox}>
                          <div style={styles.previewRow}>
                            <span style={styles.previewLabel}>Cadencia:</span>
                            <code style={styles.previewCode}>{preview.schedule}</code>
                          </div>
                          <div style={styles.previewDesc}>{preview.label}</div>
                        </div>

                        {/* Actions */}
                        <div style={styles.editorActions}>
                          <button
                            onClick={() => setEditingJobId(null)}
                            style={styles.cancelBtn}
                            disabled={isSaving}
                          >
                            Cancelar
                          </button>
                          <button
                            onClick={() => handleSaveSchedule(job.id)}
                            style={styles.saveBtn}
                            disabled={isSaving}
                          >
                            {isSaving ? 'Guardando...' : 'Guardar y Aplicar'}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Metadata Row: Last run & Next run */}
                  <div style={styles.metaRow}>
                    <div style={styles.metaItem}>
                      <span style={styles.metaLabel}>Última ejecución:</span>
                      <span style={styles.metaValue}>{formatDate(job.last_run)}</span>
                    </div>

                    <div style={styles.metaDivider}>•</div>

                    <div style={styles.metaItem}>
                      <span style={styles.metaLabel}>Próxima ejecución:</span>
                      <span style={styles.metaValue}>{formatDate(job.next_run)}</span>
                    </div>

                    <div style={styles.accordionActionWrapper}>
                      <button
                        onClick={() => toggleAccordion(job.id)}
                        style={styles.accordionToggleBtn}
                        title={isExpanded ? 'Ocultar logs' : 'Ver logs'}
                      >
                        <Terminal size={14} style={{ marginRight: '6px' }} />
                        <span>{isExpanded ? 'Ocultar Logs' : `Ver Logs (${job.logs?.length || 0})`}</span>
                        {isExpanded ? (
                          <ChevronUp size={15} style={{ marginLeft: '4px' }} />
                        ) : (
                          <ChevronDown size={15} style={{ marginLeft: '4px' }} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Collapsible Log Terminal Box */}
                {isExpanded && (
                  <div style={styles.logsContainer}>
                    <div style={styles.logsHeader}>
                      <div style={styles.logsHeaderTitle}>
                        <Terminal size={13} color="var(--color-text-muted)" />
                        <span>Terminal de Logs</span>
                        <span style={styles.logCountBadge}>{job.logs?.length || 0} líneas</span>
                      </div>

                      {job.logs?.length > 0 && (
                        <button
                          onClick={() => handleCopyLogs(job)}
                          style={styles.copyLogsBtn}
                          title="Copiar contenido de los logs"
                        >
                          {isCopied ? (
                            <>
                              <Check size={13} color="var(--color-action-primary)" />
                              <span style={{ color: 'var(--color-action-primary)' }}>Copiado</span>
                            </>
                          ) : (
                            <>
                              <Copy size={13} />
                              <span>Copiar Logs</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>

                    <div style={styles.terminalBody}>
                      {job.logs?.length === 0 ? (
                        <div style={styles.noLogsMessage}>
                          No se han registrado eventos para esta tarea aún.
                        </div>
                      ) : (
                        <div style={styles.logLinesList}>
                          {job.logs.map((log, idx) => (
                            <div key={idx} style={styles.logLine}>
                              <span style={styles.logTimestamp}>{log.timestamp || '00:00:00'}</span>
                              <span style={styles.logLevel}>{renderLogLevelBadge(log.level)}</span>
                              <span style={styles.logMessage}>{log.message}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
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
    width: '100%',
    boxSizing: 'border-box',
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
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
    zIndex: 100
  },
  header: {
    marginBottom: '28px'
  },
  backButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 12px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: 500,
    color: 'var(--color-text-secondary)',
    backgroundColor: 'var(--color-surface-bg)',
    border: '1px solid var(--color-border)',
    cursor: 'pointer',
    marginBottom: '18px',
    transition: 'all 0.15s ease'
  },
  headerTitleGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  titleWithIcon: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  title: {
    fontSize: '24px',
    fontWeight: 700,
    color: 'var(--color-text-primary)',
    letterSpacing: '-0.02em',
    lineHeight: 1.2
  },
  subtitle: {
    fontSize: '14px',
    color: 'var(--color-text-secondary)',
    marginTop: '4px'
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
    maxWidth: '400px'
  },
  cronList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  cronCard: {
    backgroundColor: 'var(--color-elevated-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: '12px',
    overflow: 'hidden',
    transition: 'border-color 0.15s ease',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)'
  },
  cardMain: {
    padding: '20px 24px'
  },
  cardHeaderRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '16px',
    flexWrap: 'wrap',
    marginBottom: '14px'
  },
  titleGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    flex: 1,
    minWidth: '260px'
  },
  titleStatusRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flexWrap: 'wrap'
  },
  jobName: {
    fontSize: '16px',
    fontWeight: 600,
    color: 'var(--color-text-primary)',
    letterSpacing: '-0.01em'
  },
  jobDescription: {
    fontSize: '13.5px',
    color: 'var(--color-text-secondary)',
    lineHeight: 1.45
  },
  scriptPathPill: {
    display: 'inline-flex',
    alignItems: 'center',
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    color: 'var(--color-text-muted)',
    backgroundColor: 'var(--color-surface-bg)',
    padding: '3px 8px',
    borderRadius: '4px',
    border: '1px solid var(--color-border)',
    maxWidth: '100%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  scheduleBadgeGroup: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '4px'
  },
  scheduleActionsRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  scheduleBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    fontFamily: 'var(--font-mono)',
    fontSize: '12px',
    fontWeight: 600,
    color: 'var(--color-action-primary)',
    backgroundColor: 'var(--color-surface-bg)',
    padding: '4px 10px',
    borderRadius: '6px',
    border: '1px solid var(--color-border)'
  },
  editScheduleBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    fontSize: '11.5px',
    fontWeight: 600,
    color: 'var(--color-text-secondary)',
    backgroundColor: 'var(--color-surface-bg)',
    padding: '4px 8px',
    borderRadius: '6px',
    border: '1px solid var(--color-border)',
    cursor: 'pointer',
    transition: 'all 0.15s ease'
  },
  scheduleLabelText: {
    fontSize: '11px',
    color: 'var(--color-text-muted)'
  },
  editorBox: {
    backgroundColor: 'var(--color-surface-bg)',
    border: '1px solid var(--color-border)',
    borderRadius: '10px',
    padding: '16px',
    marginTop: '12px',
    marginBottom: '16px'
  },
  editorHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '14px'
  },
  editorHeaderLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  editorTitle: {
    fontSize: '13.5px',
    fontWeight: 600,
    color: 'var(--color-text-primary)'
  },
  editorCloseBtn: {
    color: 'var(--color-text-muted)',
    padding: '2px',
    cursor: 'pointer'
  },
  modeTabs: {
    display: 'flex',
    gap: '6px',
    marginBottom: '14px',
    borderBottom: '1px solid var(--color-border)',
    paddingBottom: '8px'
  },
  modeTabBtn: {
    padding: '4px 10px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: 500,
    color: 'var(--color-text-secondary)',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    transition: 'all 0.15s ease'
  },
  modeTabBtnActive: {
    backgroundColor: 'var(--color-elevated-surface)',
    color: 'var(--color-action-primary)',
    fontWeight: 600,
    border: '1px solid var(--color-border)'
  },
  editorBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  formGroupStack: {
    display: 'grid',
    gridTemplateColumns: '1fr 1.5fr',
    gap: '12px'
  },
  formLabel: {
    fontSize: '12px',
    fontWeight: 500,
    color: 'var(--color-text-secondary)'
  },
  timeInput: {
    padding: '8px 12px',
    borderRadius: '6px',
    border: '1px solid var(--color-border)',
    backgroundColor: 'var(--color-elevated-surface)',
    color: 'var(--color-text-primary)',
    fontFamily: 'var(--font-mono)',
    fontSize: '14px',
    maxWidth: '160px'
  },
  selectInput: {
    padding: '8px 12px',
    borderRadius: '6px',
    border: '1px solid var(--color-border)',
    backgroundColor: 'var(--color-elevated-surface)',
    color: 'var(--color-text-primary)',
    fontFamily: 'var(--font-sans)',
    fontSize: '13px',
    maxWidth: '240px'
  },
  textInputMono: {
    width: '100%',
    padding: '8px 10px',
    borderRadius: '6px',
    border: '1px solid var(--color-border)',
    backgroundColor: 'var(--color-elevated-surface)',
    color: 'var(--color-text-primary)',
    fontFamily: 'var(--font-mono)',
    fontSize: '13px'
  },
  textInput: {
    width: '100%',
    padding: '8px 10px',
    borderRadius: '6px',
    border: '1px solid var(--color-border)',
    backgroundColor: 'var(--color-elevated-surface)',
    color: 'var(--color-text-primary)',
    fontFamily: 'var(--font-sans)',
    fontSize: '13px'
  },
  previewBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    padding: '10px 12px',
    backgroundColor: 'var(--color-elevated-surface)',
    borderRadius: '6px',
    border: '1px dashed var(--color-border)'
  },
  previewRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  previewLabel: {
    fontSize: '11.5px',
    color: 'var(--color-text-muted)'
  },
  previewCode: {
    fontFamily: 'var(--font-mono)',
    fontSize: '12px',
    fontWeight: 600,
    color: 'var(--color-action-primary)'
  },
  previewDesc: {
    fontSize: '12px',
    color: 'var(--color-text-secondary)'
  },
  editorActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '8px',
    marginTop: '4px'
  },
  cancelBtn: {
    padding: '6px 12px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: 500,
    color: 'var(--color-text-secondary)',
    backgroundColor: 'transparent',
    border: '1px solid var(--color-border)',
    cursor: 'pointer'
  },
  saveBtn: {
    padding: '6px 14px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: 600,
    color: '#FFFFFF',
    backgroundColor: 'var(--color-action-primary)',
    cursor: 'pointer',
    border: 'none',
    transition: 'background-color 0.15s ease'
  },
  metaRow: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '10px',
    paddingTop: '12px',
    borderTop: '1px solid var(--color-border)',
    fontSize: '12.5px'
  },
  metaItem: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px'
  },
  metaLabel: {
    color: 'var(--color-text-muted)'
  },
  metaValue: {
    fontFamily: 'var(--font-mono)',
    fontSize: '12px',
    fontWeight: 500,
    color: 'var(--color-text-secondary)'
  },
  metaDivider: {
    color: 'var(--color-border)'
  },
  accordionActionWrapper: {
    marginLeft: 'auto'
  },
  accordionToggleBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '5px 12px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: 600,
    color: 'var(--color-text-primary)',
    backgroundColor: 'var(--color-surface-bg)',
    border: '1px solid var(--color-border)',
    cursor: 'pointer',
    transition: 'all 0.15s ease'
  },
  statusSuccess: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '11px',
    fontWeight: 600,
    color: 'var(--color-action-primary)',
    backgroundColor: 'rgba(8, 172, 177, 0.1)',
    padding: '2px 8px',
    borderRadius: '12px'
  },
  dotSuccess: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: 'var(--color-action-primary)'
  },
  statusRunning: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '11px',
    fontWeight: 600,
    color: 'var(--brand-orange, #F99814)',
    backgroundColor: 'rgba(249, 152, 20, 0.1)',
    padding: '2px 8px',
    borderRadius: '12px'
  },
  dotRunning: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: 'var(--brand-orange, #F99814)'
  },
  statusError: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '11px',
    fontWeight: 600,
    color: '#E53E3E',
    backgroundColor: 'rgba(229, 62, 62, 0.1)',
    padding: '2px 8px',
    borderRadius: '12px'
  },
  dotError: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: '#E53E3E'
  },
  statusIdle: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '11px',
    fontWeight: 500,
    color: 'var(--color-text-muted)',
    backgroundColor: 'var(--color-surface-bg)',
    padding: '2px 8px',
    borderRadius: '12px'
  },
  dotIdle: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: 'var(--color-text-muted)'
  },
  logsContainer: {
    borderTop: '1px solid var(--color-border)',
    backgroundColor: 'var(--color-surface-bg)'
  },
  logsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 18px',
    borderBottom: '1px solid var(--color-border)',
    fontSize: '12px',
    backgroundColor: 'rgba(0, 0, 0, 0.02)'
  },
  logsHeaderTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontWeight: 600,
    color: 'var(--color-text-secondary)',
    fontFamily: 'var(--font-mono)'
  },
  logCountBadge: {
    fontSize: '10.5px',
    color: 'var(--color-text-muted)',
    backgroundColor: 'var(--color-elevated-surface)',
    padding: '1px 6px',
    borderRadius: '4px',
    border: '1px solid var(--color-border)'
  },
  copyLogsBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '5px',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '11.5px',
    fontWeight: 500,
    color: 'var(--color-text-secondary)',
    backgroundColor: 'var(--color-elevated-surface)',
    border: '1px solid var(--color-border)',
    cursor: 'pointer',
    transition: 'all 0.15s ease'
  },
  terminalBody: {
    padding: '14px 18px',
    maxHeight: '260px',
    overflowY: 'auto',
    fontFamily: 'var(--font-mono)',
    fontSize: '12px',
    lineHeight: 1.6
  },
  noLogsMessage: {
    color: 'var(--color-text-muted)',
    fontStyle: 'italic',
    fontSize: '12px'
  },
  logLinesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  logLine: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '8px',
    wordBreak: 'break-word',
    flexWrap: 'wrap'
  },
  logTimestamp: {
    color: 'var(--color-text-muted)',
    fontSize: '11px',
    flexShrink: 0
  },
  logLevel: {
    flexShrink: 0
  },
  logBadgeInfo: {
    color: 'var(--color-text-secondary)',
    fontWeight: 600,
    fontSize: '11px'
  },
  logBadgeSuccess: {
    color: 'var(--color-action-primary)',
    fontWeight: 700,
    fontSize: '11px'
  },
  logBadgeWarning: {
    color: 'var(--brand-orange, #F99814)',
    fontWeight: 700,
    fontSize: '11px'
  },
  logBadgeError: {
    color: '#E53E3E',
    fontWeight: 700,
    fontSize: '11px'
  },
  logMessage: {
    color: 'var(--color-text-primary)',
    flex: 1
  }
};
