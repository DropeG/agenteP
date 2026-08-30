import React, { useState } from 'react';
import { AlertCircle, Info, CheckCircle2, ExternalLink, ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import summariesData from '../../../agents/workspace/daily_summaries.json';

export default function SummaryView() {
  // Get all available dates from the JSON, sorted descending
  const availableDates = Object.keys(summariesData || {}).sort((a, b) => new Date(b) - new Date(a));
  
  // Default to today's date (local timezone format YYYY-MM-DD)
  const getTodayString = () => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  };

  const todayStr = getTodayString();
  
  // If today isn't in availableDates, add it to the logical list so we can show an empty state for today
  const allDates = availableDates.includes(todayStr) ? availableDates : [todayStr, ...availableDates].sort((a, b) => new Date(b) - new Date(a));

  const [selectedDate, setSelectedDate] = useState(allDates[0] || todayStr);

  const currentIndex = allDates.indexOf(selectedDate);
  const canGoPrevious = currentIndex < allDates.length - 1; // "Previous" in time means going to an older date (higher index)
  const canGoNext = currentIndex > 0; // "Next" in time means going to a newer date (lower index)

  const handlePreviousDay = () => {
    if (canGoPrevious) setSelectedDate(allDates[currentIndex + 1]);
  };

  const handleNextDay = () => {
    if (canGoNext) setSelectedDate(allDates[currentIndex - 1]);
  };

  // Get data for selected date, or fallback to empty
  const dayData = summariesData[selectedDate] || {};
  const { critical = [], informative = [], discarded = [], last_updated } = dayData;

  const hasContent = critical.length > 0 || informative.length > 0;

  // Format the visual date title (e.g. "Sábado 29 de Agosto")
  const formatDisplayDate = (dateStr) => {
    // Add T12:00:00 to prevent timezone shifting the day backward
    const d = new Date(`${dateStr}T12:00:00`);
    const formatted = d.toLocaleDateString('es-CL', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
    // Capitalize first letter
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  };

  const formatLastUpdated = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleDateString('es-CL', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div style={styles.container} className="summary-view-container">
      <div style={styles.header}>
        <div style={styles.dateNavigation}>
          <button 
            style={{...styles.navButton, opacity: canGoPrevious ? 1 : 0.3, cursor: canGoPrevious ? 'pointer' : 'default'}} 
            onClick={handlePreviousDay}
            disabled={!canGoPrevious}
            title="Día anterior"
          >
            <ChevronLeft size={20} />
          </button>
          
          <h2 style={styles.title}>
            Resumen del {formatDisplayDate(selectedDate)}
          </h2>
          
          <button 
            style={{...styles.navButton, opacity: canGoNext ? 1 : 0.3, cursor: canGoNext ? 'pointer' : 'default'}} 
            onClick={handleNextDay}
            disabled={!canGoNext}
            title="Día siguiente"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        <p style={styles.subtitle}>
          {last_updated ? `Última actualización a las ${formatLastUpdated(last_updated)}` : 'Sin datos procesados para este día'}
        </p>
      </div>

      {!hasContent ? (
        <div style={styles.emptyState}>
          <CheckCircle2 size={48} color="var(--color-border-hover)" style={{ marginBottom: '16px' }} />
          <h3 style={styles.emptyTitle}>Todo al día</h3>
          <p style={styles.emptyText}>No hubo anuncios relevantes para esta fecha.</p>
          {discarded.length > 0 && (
            <p style={styles.discardedBadge}>El agente filtró {discarded.length} anuncios irrelevantes.</p>
          )}
        </div>
      ) : (
        <div style={styles.content}>
          {critical.length > 0 && (
            <section style={styles.section}>
              <h3 style={styles.sectionTitleCritical}>
                <AlertCircle size={18} />
                Requiere Atención
              </h3>
              <div style={styles.cardList}>
                {critical.map((item, idx) => (
                  <div key={idx} style={styles.criticalCard}>
                    <div style={styles.cardHeader}>
                      <span style={styles.courseBadgeCritical}>{item.course}</span>
                      <div style={styles.headerRight}>
                        <span style={styles.cardType}>{item.type === 'date_change' ? 'Cambio de Fecha' : 'Urgente'}</span>
                        {item.url && (
                          <a href={item.url} target="_blank" rel="noopener noreferrer" style={styles.linkIconCritical} title="Ver en Canvas">
                            <ExternalLink size={14} />
                          </a>
                        )}
                      </div>
                    </div>
                    <h4 style={styles.cardTitle}>{item.title}</h4>
                    <p style={styles.cardDetails}>{item.details}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {informative.length > 0 && (
            <section style={styles.section}>
              <h3 style={styles.sectionTitle}>
                <Info size={18} />
                Novedades
              </h3>
              <div style={styles.cardList}>
                {informative.map((item, idx) => (
                  <div key={idx} style={styles.informativeCard}>
                    <div style={styles.cardHeader}>
                      <span style={styles.courseBadge}>{item.course}</span>
                      {item.url && (
                        <a href={item.url} target="_blank" rel="noopener noreferrer" style={styles.linkIcon} title="Ver en Canvas">
                          <ExternalLink size={14} />
                        </a>
                      )}
                    </div>
                    <h4 style={styles.cardTitle}>{item.title}</h4>
                    <p style={styles.cardDetails}>{item.details}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {discarded.length > 0 && (
            <section style={styles.section}>
              <h3 style={styles.sectionTitleMuted}>
                Otros Anuncios (Baja Relevancia)
              </h3>
              <div style={styles.cardList}>
                {discarded.map((item, idx) => (
                  <div key={idx} style={styles.discardedCard}>
                    <div style={styles.cardHeader}>
                      <span style={styles.courseBadgeMuted}>{item.course}</span>
                      {item.url && (
                        <a href={item.url} target="_blank" rel="noopener noreferrer" style={styles.linkIconMuted} title="Ver en Canvas">
                          <ExternalLink size={12} />
                        </a>
                      )}
                    </div>
                    <h4 style={styles.cardTitleMuted}>{item.title}</h4>
                    <p style={styles.cardDetailsMuted}>{item.details}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: '32px',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto'
  },
  header: {
    marginBottom: '32px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  dateNavigation: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '8px'
  },
  navButton: {
    background: 'none',
    border: 'none',
    color: 'var(--color-text-secondary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4px',
    borderRadius: '50%',
    transition: 'background-color 0.2s',
  },
  title: {
    fontSize: '24px',
    fontWeight: 700,
    color: 'var(--color-text-primary)',
    letterSpacing: '-0.02em',
    minWidth: '300px',
    textAlign: 'center'
  },
  subtitle: {
    fontSize: '14px',
    color: 'var(--color-text-secondary)'
  },
  emptyState: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center'
  },
  emptyTitle: {
    fontSize: '18px',
    fontWeight: 600,
    color: 'var(--color-text-primary)',
    marginBottom: '8px'
  },
  emptyText: {
    fontSize: '14px',
    color: 'var(--color-text-secondary)',
    marginBottom: '16px'
  },
  discardedBadge: {
    fontSize: '12px',
    color: 'var(--color-text-muted)',
    backgroundColor: 'var(--color-surface-bg)',
    padding: '4px 12px',
    borderRadius: '16px'
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: '32px',
    paddingBottom: '32px'
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: 600,
    color: 'var(--color-text-primary)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    borderBottom: '1px solid var(--color-border)',
    paddingBottom: '8px'
  },
  sectionTitleCritical: {
    fontSize: '16px',
    fontWeight: 600,
    color: 'var(--brand-orange)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    borderBottom: '1px solid var(--color-border)',
    paddingBottom: '8px'
  },
  sectionTitleMuted: {
    fontSize: '14px',
    fontWeight: 600,
    color: 'var(--color-text-muted)',
    borderBottom: '1px dashed var(--color-border)',
    paddingBottom: '8px',
    marginTop: '16px'
  },
  cardList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '16px'
  },
  criticalCard: {
    backgroundColor: 'var(--color-elevated-surface)',
    border: '1px solid var(--brand-orange)',
    borderRadius: '8px',
    padding: '16px',
    boxShadow: '0 2px 8px rgba(249, 152, 20, 0.1)'
  },
  informativeCard: {
    backgroundColor: 'var(--color-elevated-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: '8px',
    padding: '16px'
  },
  discardedCard: {
    backgroundColor: 'var(--color-page-bg)',
    border: '1px dashed var(--color-border)',
    borderRadius: '8px',
    padding: '12px',
    opacity: 0.8
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px'
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  linkIconCritical: {
    color: 'var(--brand-orange)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.8,
    transition: 'opacity 0.2s'
  },
  linkIcon: {
    color: 'var(--color-text-secondary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.6,
    transition: 'opacity 0.2s'
  },
  linkIconMuted: {
    color: 'var(--color-text-muted)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.4,
    transition: 'opacity 0.2s'
  },
  courseBadge: {
    fontSize: '11px',
    fontWeight: 600,
    color: 'var(--color-text-secondary)',
    backgroundColor: 'var(--color-surface-bg)',
    padding: '2px 8px',
    borderRadius: '4px',
    letterSpacing: '0.02em'
  },
  courseBadgeCritical: {
    fontSize: '11px',
    fontWeight: 700,
    color: 'white',
    backgroundColor: 'var(--brand-orange)',
    padding: '2px 8px',
    borderRadius: '4px',
    letterSpacing: '0.02em'
  },
  courseBadgeMuted: {
    fontSize: '10px',
    fontWeight: 600,
    color: 'var(--color-text-muted)',
    backgroundColor: 'transparent',
    border: '1px solid var(--color-border)',
    padding: '2px 6px',
    borderRadius: '4px',
    letterSpacing: '0.02em'
  },
  cardType: {
    fontSize: '11px',
    fontWeight: 500,
    color: 'var(--brand-orange)'
  },
  cardTitle: {
    fontSize: '15px',
    fontWeight: 600,
    color: 'var(--color-text-primary)',
    marginBottom: '6px',
    lineHeight: 1.3
  },
  cardTitleMuted: {
    fontSize: '13px',
    fontWeight: 600,
    color: 'var(--color-text-muted)',
    marginBottom: '4px',
    lineHeight: 1.3
  },
  cardDetails: {
    fontSize: '13px',
    color: 'var(--color-text-secondary)',
    lineHeight: 1.5
  },
  cardDetailsMuted: {
    fontSize: '12px',
    color: 'var(--color-text-muted)',
    lineHeight: 1.4
  }
};
