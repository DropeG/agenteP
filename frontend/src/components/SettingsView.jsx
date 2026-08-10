import React from 'react';

export default function SettingsView() {
  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Configuración</h2>
      <p style={styles.subtitle}>Parámetros del sistema Agente P y conexiones de servicios.</p>

      <div style={styles.card}>
        <h3 style={styles.sectionTitle}>Conexiones Activas</h3>
        
        <div style={styles.settingRow}>
          <div>
            <div style={styles.settingLabel}>Canvas UC Integración</div>
            <div style={styles.settingDesc}>Sincronización automática de anuncios y syllabus via API</div>
          </div>
          <span style={styles.statusActive}>Conectado ●</span>
        </div>

        <div style={styles.settingRow}>
          <div>
            <div style={styles.settingLabel}>Base de Datos Cloud</div>
            <div style={styles.settingDesc}>Supabase PostgreSQL (Realtime Queue & Logs)</div>
          </div>
          <span style={styles.statusActive}>Conectado ●</span>
        </div>

        <div style={styles.settingRow}>
          <div>
            <div style={styles.settingLabel}>Motor IA local (Antigravity Bridge)</div>
            <div style={styles.settingDesc}>Zero-Cost Zero-API-Key LLM Solver</div>
          </div>
          <span style={styles.statusActive}>Activo ●</span>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '32px',
    maxWidth: '800px'
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
    color: 'var(--color-text-secondary)',
    marginBottom: '28px'
  },
  card: {
    backgroundColor: 'var(--color-elevated-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: '12px',
    padding: '24px'
  },
  sectionTitle: {
    fontSize: '15px',
    fontWeight: 600,
    color: 'var(--color-text-primary)',
    marginBottom: '16px'
  },
  settingRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 0',
    borderBottom: '1px solid var(--color-page-bg)'
  },
  settingLabel: {
    fontSize: '14px',
    fontWeight: 600,
    color: 'var(--color-text-primary)'
  },
  settingDesc: {
    fontSize: '12px',
    color: 'var(--color-text-muted)',
    marginTop: '2px'
  },
  statusActive: {
    fontSize: '12px',
    fontWeight: 600,
    color: 'var(--color-action-primary)'
  }
};
