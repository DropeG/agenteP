import React from 'react';
import { ArrowLeft, Network, Server, Code, FileJson, Layout, Calendar, Clock, BookOpen, Activity, AlertCircle } from 'lucide-react';

export default function SystemArchitectureView({ onBack }) {
  return (
    <div style={styles.container} className="architecture-view">
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
            <Network size={24} color="var(--brand-turquoise, var(--color-action-primary))" />
            <h1 style={styles.title}>Arquitectura del Sistema</h1>
          </div>
          <p style={styles.subtitle}>
            Mapa del funcionamiento interno de Agente P, crons y skills.
          </p>
        </div>
      </div>

      <div style={styles.graphContainer}>
        {/* Layer 1: Orígenes */}
        <div style={styles.layer}>
          <h3 style={styles.layerTitle}>1. Orígenes</h3>
          <Node icon={<Server size={18} />} title="Canvas UC" desc="API Externa" type="external" />
          <Node icon={<Calendar size={18} />} title="Outlook" desc="API Externa" type="external" />
        </div>

        <ArrowConnector />

        {/* Layer 2: Crons & Worker */}
        <div style={styles.layer}>
          <h3 style={styles.layerTitle}>2. Ingesta & Procesos</h3>
          <Node icon={<Clock size={18} />} title="Guardian" desc="Ingesta de Anuncios" type="cron" />
          <Node icon={<Clock size={18} />} title="Sync Tasks" desc="Ingesta de Evaluaciones" type="cron" />
          <Node icon={<Activity size={18} />} title="Worker Local" desc="Bucle de Tareas" type="cron" />
        </div>

        <ArrowConnector />

        {/* Layer 3: Skills (Razonamiento) */}
        <div style={styles.layer}>
          <h3 style={styles.layerTitle}>3. Razonamiento Agentil</h3>
          <Node icon={<Code size={18} />} title="Profile Course" desc="Clasifica Syllabus" type="skill" />
          <Node icon={<Code size={18} />} title="Daily Briefing" desc="Extrae Fechas" type="skill" />
          <Node icon={<BookOpen size={18} />} title="Study Summarizer" desc="Resume Material" type="skill" />
          <Node icon={<AlertCircle size={18} />} title="Focus Map" desc="Mapas de Estudio" type="skill" />
        </div>

        <ArrowConnector />

        {/* Layer 4: Estado Local (Cerebro) */}
        <div style={styles.layer}>
          <h3 style={styles.layerTitle}>4. Estado Local (Cerebro)</h3>
          <Node icon={<FileJson size={18} />} title="tasks.json" desc="Base de evaluaciones" type="data" />
          <Node icon={<FileJson size={18} />} title="calendar.json" desc="Fechas confirmadas" type="data" />
          <Node icon={<FileJson size={18} />} title="course_profile.json" desc="Esquema del curso" type="data" />
          <Node icon={<FileJson size={18} />} title="summary.json" desc="Resúmenes diarios" type="data" />
        </div>

        <ArrowConnector />

        {/* Layer 5: Frontend */}
        <div style={styles.layer}>
          <h3 style={styles.layerTitle}>5. Vistas UI</h3>
          <Node icon={<Layout size={18} />} title="Mis Ramos" desc="Grid Principal" type="view" />
          <Node icon={<Calendar size={18} />} title="Calendario UI" desc="Vista Mensual" type="view" />
          <Node icon={<Layout size={18} />} title="Resumen Diario" desc="Panel de Control" type="view" />
        </div>
      </div>
    </div>
  );
}

// Subcomponents

function Node({ icon, title, desc, type }) {
  // Styles based on the type, utilizing the requested minimal palette
  let typeStyles = {};
  switch (type) {
    case 'cron':
      typeStyles = {
        borderColor: 'var(--brand-orange, #F99814)',
        borderWidth: '2px',
        backgroundColor: 'var(--color-elevated-surface)'
      };
      break;
    case 'skill':
      typeStyles = {
        borderColor: 'var(--brand-turquoise, #08ACB1)',
        borderWidth: '2px',
        backgroundColor: 'var(--color-elevated-surface)'
      };
      break;
    case 'data':
      typeStyles = {
        borderColor: 'var(--brand-hat-brown, #8B3F0A)',
        borderStyle: 'dashed',
        borderWidth: '1.5px',
        backgroundColor: 'var(--color-page-bg)'
      };
      break;
    case 'external':
      typeStyles = {
        borderColor: 'var(--color-border)',
        backgroundColor: 'var(--color-page-bg)',
        color: 'var(--color-text-secondary)'
      };
      break;
    case 'view':
      typeStyles = {
        borderColor: 'var(--color-text-primary)',
        borderWidth: '2px',
        backgroundColor: 'var(--color-text-primary)',
        color: 'var(--color-page-bg)'
      };
      break;
    default:
      break;
  }

  const isDarkView = type === 'view';

  return (
    <div style={{ ...styles.node, ...typeStyles }}>
      <div style={{ ...styles.nodeIconWrapper, color: isDarkView ? 'var(--color-page-bg)' : 'inherit' }}>
        {icon}
      </div>
      <div style={styles.nodeText}>
        <h4 style={{ ...styles.nodeTitle, color: isDarkView ? 'var(--color-page-bg)' : 'var(--color-text-primary)' }}>
          {title}
        </h4>
        <p style={{ ...styles.nodeDesc, color: isDarkView ? 'rgba(250, 247, 242, 0.7)' : 'var(--color-text-muted)' }}>
          {desc}
        </p>
      </div>
    </div>
  );
}

function ArrowConnector() {
  return (
    <div style={styles.arrowContainer}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="var(--color-border)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  );
}

const styles = {
  container: {
    padding: '32px',
    maxWidth: '1200px',
    margin: '0 auto',
    width: '100%',
    boxSizing: 'border-box',
  },
  header: {
    marginBottom: '40px'
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
  graphContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'var(--color-surface-bg)',
    padding: '40px',
    borderRadius: '16px',
    border: '1px solid var(--color-border)',
    overflowX: 'auto', // In case of smaller screens
  },
  layer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    minWidth: '200px',
  },
  layerTitle: {
    fontSize: '11px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: 'var(--color-text-muted)',
    marginBottom: '8px',
    textAlign: 'center'
  },
  arrowContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    margin: '0 12px',
    opacity: 0.6
  },
  node: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    borderRadius: '10px',
    border: '1px solid var(--color-border)',
    backgroundColor: 'var(--color-elevated-surface)',
    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
  },
  nodeIconWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  nodeText: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px'
  },
  nodeTitle: {
    fontSize: '13px',
    fontWeight: 600,
    color: 'var(--color-text-primary)'
  },
  nodeDesc: {
    fontSize: '11px',
    color: 'var(--color-text-muted)'
  }
};
