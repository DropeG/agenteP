import React, { useState } from 'react';
import CourseSidebar from './CourseSidebar';
import { Clock, Terminal, CheckCircle2, AlertCircle, Loader2, User, ShieldAlert } from 'lucide-react';

const COURSE_PROFILES = {
  IIC2143: {
    description: "Este curso aborda los principios fundamentales del diseño, desarrollo y arquitectura de software a gran escala. Los estudiantes trabajan en equipos para construir aplicaciones web modernas utilizando metodologías ágiles, pruebas automatizadas y patrones de diseño.",
    formula: "NC = T * 0.05 + PP * 0.60 + E * 0.35",
    variables: [
      { name: "T", desc: "Promedio de Controles y Tareas cortas (5%)" },
      { name: "PP", desc: "Promedio de Proyectos prácticos en grupo (60%)" },
      { name: "E", desc: "Nota del Examen final presencial (35%)" }
    ],
    eximicion: "Se eximen los estudiantes con Nota de Presentación (NP) ≥ 5.0 y Nota de Proyecto (PP) ≥ 5.0, sin entregas de proyecto reprobadas (< 4.0).",
    dates: [
      { label: "Interrogación 1 (I1)", val: "14 de Mayo, 2026" },
      { label: "Entrega Final Proyecto", val: "28 de Junio, 2026" },
      { label: "Examen Final", val: "10 de Julio, 2026" }
    ],
    contacts: [
      { name: "Juan Pablo Sandoval Alcocer (Profesor)", email: "juanpablo.sandoval@uc.cl" },
      { name: "Francisco Ignacio Gazitúa Requena (Profesor)", email: "fco_gazitua_requena@uc.cl" }
    ]
  },
  IIC2713: {
    description: "Este curso estudia el rol estratégico de las tecnologías de información en las organizaciones modernas. Cubre arquitectura empresarial, modelado de procesos de negocio (BPM), integración de sistemas y gestión de proyectos TI.",
    formula: "NF = NE * 0.45 + NH * 0.40 + NP * 0.15",
    variables: [
      { name: "NE", desc: "Promedio de Evaluaciones e Interrogaciones (45%)" },
      { name: "NH", desc: "Promedio de Hitos del Proyecto Semestral (40%)" },
      { name: "NP", desc: "Participación activa y análisis de Casos (15%)" }
    ],
    eximicion: "Se eximen los estudiantes con Promedio de Evaluaciones (NE) ≥ 5.3 y Nota de Hitos (NH) ≥ 5.0.",
    dates: [
      { label: "Interrogación 1", val: "22 de Abril, 2026" },
      { label: "Demo Hito 5 Final", val: "18 de Junio, 2026" },
      { label: "Examen Final", val: "08 de Julio, 2026" }
    ],
    contacts: [
      { name: "Hernán Cabrera (Profesor Sec 1)", email: "hernan.cabrera@uc.cl" },
      { name: "Camilo Ruiz-Tagle (Profesor Sec 2)", email: "cjruiztagle@uc.cl" }
    ]
  },
  IIC2531: {
    description: "Asignatura avanzada enfocada en los principios de ciberseguridad, criptografía simétrica/asimétrica, seguridad en redes, vulnerabilidades web y análisis de exploits en entornos computacionales.",
    formula: "NF = I1 * 0.25 + I2 * 0.25 + T * 0.20 + EX * 0.30",
    variables: [
      { name: "I1 / I2", desc: "Interrogaciones teóricas y prácticas (50%)" },
      { name: "T", desc: "Tareas de Hacking Ético y Criptografía (20%)" },
      { name: "EX", desc: "Examen Final de Vulnerabilidades (30%)" }
    ],
    eximicion: "Se eximen los alumnos con Promedio de Interrogaciones ≥ 5.5 y sin entregas reprobadas en tareas.",
    dates: [
      { label: "Interrogación 1", val: "05 de Mayo, 2026" },
      { label: "Interrogación 2", val: "12 de Junio, 2026" },
      { label: "Examen Final", val: "07 de Julio, 2026" }
    ],
    contacts: [
      { name: "Equipo Docente Ciberseguridad UC", email: "seguridad.docente@ing.puc.cl" }
    ]
  },
  IIC2223: {
    description: "Estudio riguroso de la teoría de la computación: autómatas finitos, expresiones regulares, gramáticas libres de contexto, máquinas de Turing, decidibilidad y complejidad computacional (P vs NP).",
    formula: "NF = I1 * 0.30 + I2 * 0.30 + EX * 0.40",
    variables: [
      { name: "I1", desc: "Primera Interrogación Teórica (30%)" },
      { name: "I2", desc: "Segunda Interrogación Teórica (30%)" },
      { name: "EX", desc: "Examen Final Escrito (40%)" }
    ],
    eximicion: "Se eximen los alumnos con Promedio de Interrogaciones (I1 e I2) ≥ 5.0.",
    dates: [
      { label: "Interrogación 1", val: "28 de Abril, 2026" },
      { label: "Interrogación 2", val: "02 de Junio, 2026" },
      { label: "Examen Final", val: "09 de Julio, 2026" }
    ],
    contacts: [
      { name: "Coordinación Teoría de Autómatas DCC", email: "automatas@ing.puc.cl" }
    ]
  },
  ICP0156: {
    description: "Análisis político de la estructura institucional de Chile, el sistema de partidos, dinámicas del poder público, procesos electorales y transformaciones constitucionales contemporáneas.",
    formula: "NF = Ensayos * 0.40 + Pruebas * 0.40 + Asistencia * 0.20",
    variables: [
      { name: "Ensayos", desc: "Ensayos analíticos y reseñas críticas (40%)" },
      { name: "Pruebas", desc: "Evaluaciones parciales de contenidos (40%)" },
      { name: "Asistencia", desc: "Asistencia a lecturas y debates (20%)" }
    ],
    eximicion: "No requiere examen final si el Promedio General de Ensayos y Pruebas es ≥ 5.0.",
    dates: [
      { label: "Entrega Ensayo 1", val: "10 de Mayo, 2026" },
      { label: "Prueba de Contenidos", val: "15 de Junio, 2026" },
      { label: "Cierre de Curso", val: "03 de Julio, 2026" }
    ],
    contacts: [
      { name: "Instituto de Ciencia Política UC", email: "cienciapolitica@uc.cl" }
    ]
  },
  LET203G: {
    description: "Curso de formación general enfocado en el análisis intercultural occidental, literatura comparada, comunicación efectiva y pensamiento crítico en contextos globales.",
    formula: "NF = Portafolio * 0.50 + Presentación * 0.30 + Participación * 0.20",
    variables: [
      { name: "Portafolio", desc: "Portafolio de escrituras y reflexiones (50%)" },
      { name: "Presentación", desc: "Exposición oral del proyecto (30%)" },
      { name: "Participación", desc: "Debates semanales en clases (20%)" }
    ],
    eximicion: "Eximición automática con Nota de Portafolio ≥ 5.2.",
    dates: [
      { label: "Avance Portafolio", val: "18 de Mayo, 2026" },
      { label: "Exposición Oral", val: "22 de Junio, 2026" },
      { label: "Evaluación Final", val: "02 de Julio, 2026" }
    ],
    contacts: [
      { name: "Facultad de Letras UC", email: "letras@uc.cl" }
    ]
  }
};

export default function CourseWorkspaceView({ course, tasks, logs, onBackToDashboard }) {
  const [activeSubView, setActiveSubView] = useState('activity');
  const [consoleTab, setConsoleTab] = useState('timeline'); // 'timeline' | 'logs'

  // Filter tasks & logs for this specific course
  const courseTasks = tasks.filter(t => t.course_code === course.course_code);
  const courseLogs = logs.filter(l => !l.course_code || l.course_code === course.course_code);

  const courseProfile = COURSE_PROFILES[course.course_code] || {
    description: `Asignatura oficial UC (${course.course_code}) del presente semestre.`,
    formula: "NF = NP * 0.60 + E * 0.40",
    variables: [
      { name: "NP", desc: "Nota de Presentación (60%)" },
      { name: "E", desc: "Examen Final (40%)" }
    ],
    eximicion: "Se eximen los estudiantes con NP ≥ 5.0.",
    dates: [
      { label: "Interrogación 1", val: "15 de Mayo, 2026" },
      { label: "Examen Final", val: "05 de Julio, 2026" }
    ],
    contacts: [
      { name: "Docente del Curso", email: "contacto@uc.cl" }
    ]
  };

  const safeParseDate = (dateVal) => {
    if (!dateVal) return new Date();
    try {
      const d = new Date(dateVal);
      if (!isNaN(d.getTime())) return d;
    } catch (e) {}
    return new Date();
  };

  const groupTasksByDate = (taskList) => {
    const groups = { Today: [], Yesterday: [], 'Last Week': [], Past: [] };
    const now = new Date();
    const todayStr = now.toDateString();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();
    const lastWeekLimit = new Date(now);
    lastWeekLimit.setDate(now.getDate() - 7);

    taskList.forEach(task => {
      const taskDate = safeParseDate(task.created_at);
      const dateStr = taskDate.toDateString();
      if (dateStr === todayStr) groups.Today.push(task);
      else if (dateStr === yesterdayStr) groups.Yesterday.push(task);
      else if (taskDate >= lastWeekLimit) groups['Last Week'].push(task);
      else groups.Past.push(task);
    });

    return groups;
  };

  const timelineGroups = groupTasksByDate(courseTasks);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle2 size={16} color="var(--color-agent-completed)" />;
      case 'processing': return <Loader2 size={16} color="var(--color-agent-running)" className="spin" />;
      case 'failed': return <AlertCircle size={16} color="var(--color-agent-failed)" />;
      default: return <Clock size={16} color="var(--color-agent-waiting)" />;
    }
  };

  return (
    <div className="course-workspace-layout">
      {/* Secondary Course Sidebar (Tier 2) */}
      <CourseSidebar
        course={course}
        activeSubView={activeSubView}
        setActiveSubView={setActiveSubView}
        onBackToDashboard={onBackToDashboard}
      />

      {/* Workspace Main Area */}
      <div style={styles.workspaceBody}>
        {/* Top Breadcrumb Header */}
        <div style={styles.breadcrumbBar}>
          <span style={styles.breadcrumbLink} onClick={onBackToDashboard}>Mis Ramos</span>
          <span style={styles.breadcrumbSep}>/</span>
          <span style={styles.breadcrumbCurrent}>{course.course_code}</span>
          <span style={styles.breadcrumbSep}>/</span>
          <span style={styles.breadcrumbSub}>{activeSubView}</span>
        </div>

        {/* Dynamic Content Views */}
        <div style={styles.contentContainer}>

          {/* 1. ACTIVIDAD AGENTE (Timeline + Console Logs) */}
          {activeSubView === 'activity' && (
            <div>
              <div style={styles.viewHeader}>
                <h2 style={styles.viewTitle}>Actividad Agente & Consola</h2>
                <div style={styles.tabToggle}>
                  <button
                    onClick={() => setConsoleTab('timeline')}
                    style={{ ...styles.toggleBtn, ...(consoleTab === 'timeline' ? styles.toggleBtnActive : {}) }}
                  >
                    <Clock size={14} /> Timeline (Amie)
                  </button>
                  <button
                    onClick={() => setConsoleTab('logs')}
                    style={{ ...styles.toggleBtn, ...(consoleTab === 'logs' ? styles.toggleBtnActive : {}) }}
                  >
                    <Terminal size={14} /> Console (`JetBrains Mono`)
                  </button>
                </div>
              </div>

              {consoleTab === 'timeline' ? (
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
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  {getStatusIcon(task.status)}
                                  <span style={styles.taskType}>{task.task_type}</span>
                                </div>
                                <span style={styles.taskTime}>
                                  {task.created_at ? safeParseDate(task.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                </span>
                              </div>
                              <p style={styles.taskPrompt}>{task.prompt}</p>
                              {task.result && (
                                <div style={styles.resultBox}>
                                  <span style={styles.resultLabel}>Resultado:</span>
                                  <pre style={styles.resultJson}>{JSON.stringify(task.result, null, 2)}</pre>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                  {courseTasks.length === 0 && (
                    <div style={styles.emptyState}>No hay tareas registradas en la línea de tiempo para {course.course_code}.</div>
                  )}
                </div>
              ) : (
                <div style={styles.consoleContainer}>
                  <div style={styles.consoleHeader}>LOGS EN TIEMPO REAL - AGENTE P CORE ({course.course_code})</div>
                  <div style={styles.consoleBody}>
                    {courseLogs.length > 0 ? (
                      courseLogs.map((log, idx) => (
                        <div key={idx} style={styles.logLine}>
                          <span style={{ color: '#8A8278' }}>[{safeParseDate(log.created_at).toLocaleTimeString()}]</span>{' '}
                          <span style={{ color: 'var(--color-action-primary)', fontWeight: 600 }}>[{log.agent_name || 'System'}]:</span>{' '}
                          <span>{log.message}</span>
                        </div>
                      ))
                    ) : (
                      <div style={styles.logLine}>[SYSTEM]: Esperando nuevos logs de ejecución desde Supabase...</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 2. PROGRAMA DEL CURSO (Unique Course Syllabus Profile) */}
          {activeSubView === 'programa' && (
            <div>
              <div style={styles.viewHeader}>
                <h2 style={styles.viewTitle}>Programa del Curso & Reglas Academicas ({course.course_code})</h2>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                {/* Section 1: Overview */}
                <div style={styles.profileCard}>
                  <h3 style={styles.sectionHeader}>Descripción del Curso</h3>
                  <p style={styles.descriptionText}>{courseProfile.description}</p>
                </div>

                {/* Section 2: Formula & Variable Breakdown */}
                <div style={styles.profileCard}>
                  <h3 style={styles.sectionHeader}>Fórmula de Evaluación & Desglose de Variables</h3>
                  <div style={styles.formulaBox}>
                    <code>{courseProfile.formula}</code>
                  </div>
                  <div style={styles.variablesList}>
                    {courseProfile.variables.map((v, i) => (
                      <div key={i} style={styles.variableItem}>
                        <strong>{v.name}:</strong> {v.desc}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section 3: Eximición Rules */}
                <div style={{ ...styles.profileCard, borderColor: '#F99814', backgroundColor: '#FFFDF9' }}>
                  <h3 style={{ ...styles.sectionHeader, color: '#8B3F0A' }}>Reglas de Eximición de Examen</h3>
                  <div style={styles.eximicionBox}>
                    <ShieldAlert size={18} color="#F99814" style={{ flexShrink: 0 }} />
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#45240F' }}>
                      {courseProfile.eximicion}
                    </span>
                  </div>
                </div>

                {/* Section 4: Key Milestone Dates */}
                <div style={styles.profileCard}>
                  <h3 style={styles.sectionHeader}>Hitos y Fechas Clave del Semestre</h3>
                  <div style={styles.datesGrid}>
                    {courseProfile.dates.map((d, i) => (
                      <div key={i} style={styles.dateCard}>
                        <span style={styles.dateLabel}>{d.label}</span>
                        <span style={styles.dateVal}>{d.val}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section 5: Faculty Contacts */}
                <div style={styles.profileCard}>
                  <h3 style={styles.sectionHeader}>Contactos Docentes</h3>
                  <div style={styles.contactList}>
                    {courseProfile.contacts.map((c, i) => (
                      <div key={i} style={styles.contactItem}>
                        <User size={14} color="var(--color-action-primary)" />
                        <span>{c.name}</span>
                        <span style={styles.email}>{c.email}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* 3. ANUNCIOS */}
          {activeSubView === 'announcements' && (
            <div>
              <div style={styles.viewHeader}>
                <h2 style={styles.viewTitle}>Anuncios Canvas Ingestados ({course.course_code})</h2>
              </div>
              <div style={styles.emptyState}>Los anuncios leídos por <strong>El Guardián</strong> se sincronizan aquí en formato Markdown.</div>
            </div>
          )}

          {/* 4. TAREAS & EVALUACIONES */}
          {activeSubView === 'evaluations' && (
            <div>
              <div style={styles.viewHeader}>
                <h2 style={styles.viewTitle}>Tareas, Interrogaciones & Entregables ({course.course_code})</h2>
              </div>
              <div style={styles.emptyState}>Listado de evaluaciones extraídas y soluciones generadas por <strong>El Auxiliar</strong>.</div>
            </div>
          )}

          {/* 5. MATERIALES */}
          {activeSubView === 'materials' && (
            <div>
              <div style={styles.viewHeader}>
                <h2 style={styles.viewTitle}>Diapositivas & Resúmenes RAG ({course.course_code})</h2>
              </div>
              <div style={styles.emptyState}>Clases parseadas y resúmenes estructurados generados por <strong>El Estudiante</strong>.</div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

const styles = {
  workspaceBody: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: 'var(--color-page-bg)'
  },
  breadcrumbBar: {
    padding: '16px 32px',
    borderBottom: '1px solid var(--color-border)',
    backgroundColor: 'var(--color-elevated-surface)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '13px',
    fontWeight: 500
  },
  breadcrumbLink: {
    color: 'var(--color-action-primary)',
    cursor: 'pointer'
  },
  breadcrumbSep: {
    color: 'var(--color-text-muted)'
  },
  breadcrumbCurrent: {
    color: 'var(--color-text-primary)',
    fontWeight: 700,
    fontFamily: 'var(--font-mono)'
  },
  breadcrumbSub: {
    color: 'var(--color-text-secondary)',
    textTransform: 'capitalize'
  },
  contentContainer: {
    padding: '32px',
    flex: 1
  },
  viewHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px'
  },
  viewTitle: {
    fontSize: '22px',
    fontWeight: 700,
    color: 'var(--color-text-primary)',
    letterSpacing: '-0.02em'
  },
  tabToggle: {
    display: 'flex',
    gap: '4px',
    backgroundColor: 'var(--color-surface-bg)',
    padding: '4px',
    borderRadius: '8px',
    border: '1px solid var(--color-border)'
  },
  toggleBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    fontSize: '12px',
    fontWeight: 500,
    color: 'var(--color-text-secondary)',
    borderRadius: '6px'
  },
  toggleBtnActive: {
    backgroundColor: 'var(--color-elevated-surface)',
    color: 'var(--color-action-primary)',
    fontWeight: 600
  },
  timelineContainer: { display: 'flex', flexDirection: 'column', gap: '24px' },
  timelineGroup: { display: 'flex', flexDirection: 'column', gap: '12px' },
  groupHeader: { display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', paddingBottom: '6px' },
  groupTitle: { fontSize: '12px', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' },
  groupCount: { fontSize: '11px', fontFamily: 'var(--font-mono)', backgroundColor: 'var(--color-surface-bg)', padding: '2px 8px', borderRadius: '10px' },
  taskList: { display: 'flex', flexDirection: 'column', gap: '12px' },
  taskCard: { backgroundColor: 'var(--color-elevated-surface)', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '16px' },
  taskHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px' },
  taskType: { fontSize: '12px', fontWeight: 600, color: 'var(--color-text-primary)' },
  taskTime: { fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' },
  taskPrompt: { fontSize: '13px', color: 'var(--color-text-secondary)' },
  resultBox: { marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--color-border)' },
  resultLabel: { fontSize: '11px', fontWeight: 600, color: 'var(--color-text-muted)' },
  resultJson: { fontFamily: 'var(--font-mono)', fontSize: '11px', backgroundColor: 'var(--color-surface-bg)', padding: '8px', borderRadius: '4px' },
  consoleContainer: { backgroundColor: 'var(--color-bg-console)', borderRadius: '8px', border: '1px solid var(--color-border)', height: '400px', display: 'flex', flexDirection: 'column' },
  consoleHeader: { backgroundColor: '#141210', padding: '10px 16px', fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' },
  consoleBody: { padding: '16px', fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--color-text-console)', flex: 1, overflowY: 'auto' },
  logLine: { marginBottom: '6px' },
  profileCard: { backgroundColor: 'var(--color-elevated-surface)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '24px' },
  sectionHeader: { fontSize: '15px', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '12px', marginTop: '4px' },
  formulaBox: { backgroundColor: 'var(--color-surface-bg)', padding: '12px 16px', borderRadius: '8px', fontFamily: 'var(--font-mono)', color: 'var(--color-action-primary)', fontSize: '14px' },
  contactList: { display: 'flex', flexDirection: 'column', gap: '8px' },
  contactItem: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--color-text-primary)' },
  email: { marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--color-action-primary)' },
  descriptionText: { fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: 1.5 },
  variablesList: { marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '6px' },
  variableItem: { fontSize: '13px', color: 'var(--color-text-primary)' },
  eximicionBox: { display: 'flex', alignItems: 'center', gap: '10px' },
  datesGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginTop: '8px' },
  dateCard: { backgroundColor: 'var(--color-surface-bg)', padding: '12px', borderRadius: '8px', border: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', gap: '4px' },
  dateLabel: { fontSize: '12px', fontWeight: 600, color: 'var(--color-text-muted)' },
  dateVal: { fontSize: '13px', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--color-action-primary)' },
  emptyState: { padding: '48px 16px', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '14px', backgroundColor: 'var(--color-elevated-surface)', borderRadius: '8px', border: '1px solid var(--color-border)' }
};
