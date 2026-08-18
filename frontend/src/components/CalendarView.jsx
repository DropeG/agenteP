import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Clock, MapPin, FileText, Tag, X, Calendar as CalendarIcon, BookOpen } from 'lucide-react';
import rawEvents from '../../../agents/workspace/calendar.json';

import { loadWorkspaceCourses } from '../utils/courseLoader';

// Build dynamic course code to course full name mapping
const workspaceCourses = loadWorkspaceCourses();
const COURSE_NAMES = workspaceCourses.reduce((acc, c) => {
  if (c.course_code && c.course_name) {
    acc[c.course_code.toUpperCase()] = c.course_name;
  }
  return acc;
}, {});

const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const WEEKDAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

export default function CalendarView() {
  const [currentDate, setCurrentDate] = useState(() => {
    const today = new Date();
    if (today.getFullYear() === 2026) return today;
    return new Date(2026, 7, 1); // Default to August 2026
  });

  const [selectedEvent, setSelectedEvent] = useState(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = (new Date(year, month, 1).getDay() + 6) % 7; // Mon=0 .. Sun=6
  const totalCells = firstDayOfWeek + daysInMonth;
  const numRows = Math.ceil(totalCells / 7);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date(2026, 7, 1));
  };

  const getEventsForDay = (dayNumber) => {
    return rawEvents.filter(e => {
      if (!e.date && !e.start_at) return false;
      const d = new Date(e.start_at || e.date);
      return d.getFullYear() === year && d.getMonth() === month && d.getDate() === dayNumber;
    });
  };

  const isToday = (dayNumber) => {
    const today = new Date();
    return today.getFullYear() === year && today.getMonth() === month && today.getDate() === dayNumber;
  };

  // Perry Accent helper (≤5% Perry colors: Turquoise #08ACB1, Orange #F99814, Hat Brown #8B3F0A)
  const getEventTypeBadgeStyle = (typeStr) => {
    const t = (typeStr || '').toLowerCase();
    if (t.includes('interrogac') || t.includes('examen')) {
      return styles.badgeCritical; // Perry Orange/Hat Brown accent
    }
    if (t.includes('control') || t.includes('actividad')) {
      return styles.badgeTeal; // Perry Turquoise accent
    }
    return styles.badgeNormal;
  };

  const getCourseFullName = (code) => {
    return COURSE_NAMES[code] || code;
  };

  return (
    <div style={styles.container}>
      {/* Header Bar */}
      <header style={styles.header}>
        <div style={styles.titleGroup}>
          <div style={styles.titleIconWrapper}>
            <CalendarIcon size={20} color="var(--color-text-primary)" />
          </div>
          <h2 style={styles.title}>Calendario</h2>
        </div>

        <div style={styles.navControls}>
          <button onClick={handleToday} style={styles.todayButton} title="Ir al mes actual">
            Hoy
          </button>
          <div style={styles.monthSelector}>
            <button onClick={handlePrevMonth} style={styles.iconNavBtn} aria-label="Mes anterior">
              <ChevronLeft size={18} />
            </button>
            <span style={styles.monthTitle}>
              {MONTH_NAMES[month]} {year}
            </span>
            <button onClick={handleNextMonth} style={styles.iconNavBtn} aria-label="Mes siguiente">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Ultra-Clean Floating Grid Container */}
      <div style={styles.gridContainer}>
        {/* Weekday Row Header */}
        <div style={styles.weekdayRow}>
          {WEEKDAYS.map(day => (
            <div key={day} style={styles.weekdayHeader}>
              {day}
            </div>
          ))}
        </div>

        {/* Dynamic Floating Days Grid */}
        <div style={{
          ...styles.floatingGrid,
          gridTemplateRows: `repeat(${numRows}, 1fr)`
        }}>
          {/* Empty Days Before 1st of Month */}
          {Array.from({ length: firstDayOfWeek }).map((_, idx) => (
            <div key={`empty-${idx}`} style={styles.emptyCard} />
          ))}

          {/* Month Days Cards */}
          {Array.from({ length: daysInMonth }).map((_, idx) => {
            const dayNum = idx + 1;
            const dayEvents = getEventsForDay(dayNum);
            const activeToday = isToday(dayNum);

            return (
              <div
                key={dayNum}
                style={{
                  ...styles.dayCard,
                  ...(activeToday ? styles.todayCard : {})
                }}
              >
                {/* Day Header */}
                <div style={styles.dayCardHeader}>
                  <span style={{
                    ...styles.dayNumber,
                    ...(activeToday ? styles.todayNumber : {})
                  }}>
                    {dayNum}
                  </span>
                  {dayEvents.length > 0 && (
                    <span style={styles.eventCountDot}>
                      {dayEvents.length} {dayEvents.length === 1 ? 'evaluación' : 'evaluaciones'}
                    </span>
                  )}
                </div>

                {/* Day Events Container */}
                <div style={styles.eventsWrapper}>
                  {dayEvents.map(event => (
                    <button
                      key={event.id}
                      onClick={() => setSelectedEvent(event)}
                      style={{
                        ...styles.eventChip,
                        ...getEventTypeBadgeStyle(event.type)
                      }}
                      title={`${event.course_code}: ${getCourseFullName(event.course_code)} - ${event.title}`}
                    >
                      <div style={styles.eventChipHeader}>
                        <span style={styles.eventSigla}>{event.course_code}</span>
                        <span style={styles.eventCourseName}>{getCourseFullName(event.course_code)}</span>
                      </div>
                      <div style={styles.eventTitle}>{event.title}</div>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Event Inspection Drawer / Modal */}
      {selectedEvent && (
        <div style={styles.drawerOverlay} onClick={() => setSelectedEvent(null)}>
          <div style={styles.drawerCard} onClick={e => e.stopPropagation()}>
            <div style={styles.drawerHeader}>
              <div style={styles.drawerBadgeGroup}>
                <span style={styles.courseSiglaBadge}>{selectedEvent.course_code}</span>
                <span style={getEventTypeBadgeStyle(selectedEvent.type)}>
                  {(selectedEvent.type || 'Evaluación').toUpperCase()}
                </span>
              </div>
              <button onClick={() => setSelectedEvent(null)} style={styles.closeBtn} aria-label="Cerrar">
                <X size={18} />
              </button>
            </div>

            <div style={styles.courseFullNameHeader}>
              <BookOpen size={16} style={{ flexShrink: 0 }} />
              <span>{getCourseFullName(selectedEvent.course_code)}</span>
            </div>

            <h3 style={styles.drawerTitle}>{selectedEvent.title}</h3>

            <div style={styles.drawerBody}>
              <div style={styles.detailRow}>
                <Clock size={16} style={styles.detailIcon} />
                <div>
                  <strong>Fecha y Hora:</strong>
                  <p style={styles.detailText}>
                    {new Date(selectedEvent.start_at || selectedEvent.date).toLocaleString('es-CL', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>

              {selectedEvent.location && (
                <div style={styles.detailRow}>
                  <MapPin size={16} style={styles.detailIcon} />
                  <div>
                    <strong>Ubicación / Sala:</strong>
                    <p style={styles.detailText}>{selectedEvent.location}</p>
                  </div>
                </div>
              )}

              {selectedEvent.details && (
                <div style={styles.detailRow}>
                  <FileText size={16} style={styles.detailIcon} />
                  <div>
                    <strong>Módulos / Contenido:</strong>
                    <p style={styles.detailText}>{selectedEvent.details}</p>
                  </div>
                </div>
              )}

              <div style={styles.detailRow}>
                <Tag size={16} style={styles.detailIcon} />
                <div>
                  <strong>Origen del Registro:</strong>
                  <p style={styles.detailText}>
                    {selectedEvent.source === 'syllabus' ? 'Programa del Curso (Syllabus)' : 'Canvas UC'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: '24px',
    height: 'calc(100vh - 48px)',
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box',
    color: 'var(--color-text-primary)',
    backgroundColor: 'var(--color-page-bg)'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
    flexShrink: 0
  },
  titleGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  titleIconWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    backgroundColor: 'var(--color-surface-bg)',
    border: '1px solid var(--color-border)'
  },
  title: {
    fontSize: '22px',
    fontWeight: 700,
    letterSpacing: '-0.02em',
    color: 'var(--color-text-primary)',
    margin: 0
  },
  navControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  todayButton: {
    padding: '6px 14px',
    borderRadius: '8px',
    border: '1px solid var(--color-border)',
    backgroundColor: 'var(--color-elevated-surface)',
    color: 'var(--color-text-primary)',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.15s ease'
  },
  monthSelector: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: 'var(--color-elevated-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: '8px',
    padding: '4px 8px'
  },
  iconNavBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4px',
    borderRadius: '4px',
    color: 'var(--color-text-primary)',
    cursor: 'pointer',
    backgroundColor: 'transparent',
    border: 'none'
  },
  monthTitle: {
    fontSize: '14px',
    fontWeight: 600,
    minWidth: '130px',
    textAlign: 'center',
    fontFamily: 'var(--font-sans)'
  },
  gridContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    minHeight: 0,
    gap: '8px'
  },
  weekdayRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '8px',
    flexShrink: 0
  },
  weekdayHeader: {
    padding: '6px',
    textAlign: 'center',
    fontSize: '11px',
    fontWeight: 700,
    color: 'var(--color-text-secondary)',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    fontFamily: 'var(--font-mono)'
  },
  floatingGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '8px',
    flex: 1,
    minHeight: 0
  },
  emptyCard: {
    backgroundColor: 'transparent',
    borderRadius: '10px',
    height: '100%',
    minHeight: 0
  },
  dayCard: {
    backgroundColor: 'var(--color-elevated-surface)',
    borderRadius: '10px',
    border: '1px solid var(--color-border)',
    height: '100%',
    minHeight: 0,
    padding: '8px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    boxSizing: 'border-box',
    overflow: 'hidden',
    transition: 'border-color 0.15s ease'
  },
  todayCard: {
    borderColor: '#08ACB1',
    boxShadow: '0 0 0 1px #08ACB1',
    backgroundColor: '#FFFFFF'
  },
  dayCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexShrink: 0
  },
  dayNumber: {
    fontSize: '13px',
    fontWeight: 700,
    fontFamily: 'var(--font-mono)',
    color: 'var(--color-text-primary)'
  },
  todayNumber: {
    color: '#08ACB1'
  },
  eventCountDot: {
    fontSize: '9px',
    fontWeight: 600,
    color: 'var(--color-text-muted)'
  },
  eventsWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
    overflowY: 'auto',
    flex: 1
  },
  eventChip: {
    display: 'flex',
    flexDirection: 'column',
    padding: '6px 8px',
    borderRadius: '6px',
    border: '1px solid var(--color-border)',
    fontSize: '11px',
    textAlign: 'left',
    cursor: 'pointer',
    width: '100%',
    lineHeight: 1.2,
    flexShrink: 0,
    transition: 'transform 0.1s ease, box-shadow 0.1s ease'
  },
  eventChipHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginBottom: '2px'
  },
  eventSigla: {
    fontFamily: 'var(--font-mono)',
    fontWeight: 700,
    fontSize: '10px',
    letterSpacing: '0.02em'
  },
  eventCourseName: {
    fontSize: '10px',
    fontWeight: 500,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    opacity: 0.8
  },
  eventTitle: {
    fontWeight: 600,
    fontSize: '11px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    width: '100%'
  },
  // Perry Accent Badges (≤5% acentos)
  badgeCritical: {
    backgroundColor: '#FFF7ED',
    borderColor: '#F99814',
    color: '#8B3F0A'
  },
  badgeTeal: {
    backgroundColor: '#F0FDFA',
    borderColor: '#08ACB1',
    color: '#068E93'
  },
  badgeNormal: {
    backgroundColor: 'var(--color-surface-bg)',
    borderColor: 'var(--color-border)',
    color: 'var(--color-text-primary)'
  },
  // Modal / Drawer Overlay
  drawerOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(69, 36, 15, 0.35)',
    backdropFilter: 'blur(3px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    padding: '16px'
  },
  drawerCard: {
    backgroundColor: 'var(--color-elevated-surface)',
    borderRadius: '14px',
    border: '1px solid var(--color-border)',
    padding: '24px',
    width: '100%',
    maxWidth: '480px',
    boxShadow: '0 20px 25px -5px rgba(69, 36, 15, 0.1)'
  },
  drawerHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px'
  },
  drawerBadgeGroup: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center'
  },
  courseSiglaBadge: {
    fontSize: '12px',
    fontWeight: 700,
    fontFamily: 'var(--font-mono)',
    padding: '4px 8px',
    borderRadius: '6px',
    backgroundColor: 'var(--color-text-primary)',
    color: 'var(--color-page-bg)'
  },
  courseFullNameHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '13px',
    fontWeight: 600,
    color: '#08ACB1',
    marginBottom: '8px'
  },
  closeBtn: {
    padding: '4px',
    borderRadius: '6px',
    color: 'var(--color-text-secondary)',
    cursor: 'pointer',
    backgroundColor: 'transparent',
    border: 'none'
  },
  drawerTitle: {
    fontSize: '20px',
    fontWeight: 700,
    color: 'var(--color-text-primary)',
    marginBottom: '20px',
    lineHeight: 1.2
  },
  drawerBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  detailRow: {
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-start',
    fontSize: '13px'
  },
  detailIcon: {
    color: 'var(--color-text-secondary)',
    marginTop: '2px',
    flexShrink: 0
  },
  detailText: {
    margin: '2px 0 0 0',
    color: 'var(--color-text-secondary)'
  }
};
