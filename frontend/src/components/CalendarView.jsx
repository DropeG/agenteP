import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  MapPin, 
  FileText, 
  Tag, 
  X, 
  Calendar as CalendarIcon, 
  BookOpen,
  CalendarDays,
  List,
  History,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
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
const MOBILE_WEEKDAYS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

export default function CalendarView() {
  const [currentDate, setCurrentDate] = useState(() => {
    const today = new Date();
    if (today.getFullYear() === 2026) return today;
    return new Date(2026, 7, 1); // Default to August 2026
  });

  const [selectedDay, setSelectedDay] = useState(() => {
    const today = new Date();
    if (today.getFullYear() === 2026 && today.getMonth() === 7) {
      return today.getDate();
    }
    return 1;
  });

  const [viewMode, setViewMode] = useState('month'); // 'month' | 'agenda'
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showPastAgendaEvents, setShowPastAgendaEvents] = useState(false);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = (new Date(year, month, 1).getDay() + 6) % 7; // Mon=0 .. Sun=6
  const totalCells = firstDayOfWeek + daysInMonth;
  const numRows = Math.ceil(totalCells / 7);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDay(1);
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDay(1);
  };

  const handleToday = () => {
    const today = new Date();
    if (today.getFullYear() === 2026) {
      setCurrentDate(today);
      setSelectedDay(today.getDate());
    } else {
      setCurrentDate(new Date(2026, 7, 1));
      setSelectedDay(1);
    }
  };

  const getEventsForDay = (dayNumber) => {
    return rawEvents.filter(e => {
      if (!e.date && !e.start_at) return false;
      const d = new Date(e.start_at || e.date);
      return d.getFullYear() === year && d.getMonth() === month && d.getDate() === dayNumber;
    }).sort((a, b) => new Date(a.start_at || a.date) - new Date(b.start_at || b.date));
  };

  const isToday = (dayNumber) => {
    const today = new Date();
    return today.getFullYear() === year && today.getMonth() === month && today.getDate() === dayNumber;
  };

  // Group all events in active month by day for Agenda view
  const monthEventsGrouped = useMemo(() => {
    const eventsInMonth = rawEvents.filter(e => {
      if (!e.date && !e.start_at) return false;
      const d = new Date(e.start_at || e.date);
      return d.getFullYear() === year && d.getMonth() === month;
    }).sort((a, b) => new Date(a.start_at || a.date) - new Date(b.start_at || b.date));

    const map = new Map();
    eventsInMonth.forEach(evt => {
      const d = new Date(evt.start_at || evt.date);
      const day = d.getDate();
      if (!map.has(day)) {
        map.set(day, []);
      }
      map.get(day).push(evt);
    });

    const sortedDays = Array.from(map.keys()).sort((a, b) => a - b);
    return sortedDays.map(day => ({
      day,
      events: map.get(day)
    }));
  }, [year, month]);

  const today = useMemo(() => new Date(), []);
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;
  const isPastMonth = year < today.getFullYear() || (year === today.getFullYear() && month < today.getMonth());
  const todayDate = today.getDate();

  const { pastGroups, upcomingGroups, pastEventsCount, upcomingEventsCount } = useMemo(() => {
    if (!isCurrentMonth) {
      return {
        pastGroups: isPastMonth ? monthEventsGrouped : [],
        upcomingGroups: isPastMonth ? [] : monthEventsGrouped,
        pastEventsCount: isPastMonth ? monthEventsGrouped.reduce((acc, g) => acc + g.events.length, 0) : 0,
        upcomingEventsCount: isPastMonth ? 0 : monthEventsGrouped.reduce((acc, g) => acc + g.events.length, 0)
      };
    }

    const past = [];
    const upcoming = [];
    let pCount = 0;
    let uCount = 0;

    monthEventsGrouped.forEach(group => {
      if (group.day < todayDate) {
        past.push(group);
        pCount += group.events.length;
      } else {
        upcoming.push(group);
        uCount += group.events.length;
      }
    });

    return {
      pastGroups: past,
      upcomingGroups: upcoming,
      pastEventsCount: pCount,
      upcomingEventsCount: uCount
    };
  }, [monthEventsGrouped, isCurrentMonth, isPastMonth, todayDate]);

  const getDayDotIndicators = (dayNum) => {
    const events = getEventsForDay(dayNum);
    if (events.length === 0) return { hasCritical: false, hasNormal: false, count: 0 };
    const hasCritical = events.some(e => {
      const t = (e.type || '').toLowerCase();
      return t.includes('interrogac') || t.includes('examen');
    });
    const hasNormal = events.some(e => {
      const t = (e.type || '').toLowerCase();
      return !t.includes('interrogac') && !t.includes('examen');
    });
    return { hasCritical, hasNormal, count: events.length };
  };

  const getSelectedDateTitle = (dayNum) => {
    const d = new Date(year, month, dayNum);
    const weekday = d.toLocaleDateString('es-CL', { weekday: 'long' });
    const capWeekday = weekday.charAt(0).toUpperCase() + weekday.slice(1);
    return `${capWeekday}, ${dayNum} de ${MONTH_NAMES[month]}`;
  };

  const formatEventTime = (event) => {
    if (!event.start_at && !event.date) return 'Sin hora';
    const d = new Date(event.start_at || event.date);
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');
    if (hours === '00' && minutes === '00') {
      return 'Todo el día';
    }
    return `${hours}:${minutes} hrs`;
  };

  // Perry Accent helper (≤5% Perry colors: Turquoise #08ACB1, Orange #F99814, Hat Brown #8B3F0A)
  const getEventTypeBadgeStyle = (typeStr) => {
    const t = (typeStr || '').toLowerCase();
    if (t.includes('interrogac') || t.includes('examen')) {
      return styles.badgeCritical; // Perry Orange/Hat Brown accent
    }
    if (t.includes('control') || t.includes('actividad') || t.includes('proyecto')) {
      return styles.badgeTeal; // Perry Turquoise accent
    }
    return styles.badgeNormal;
  };

  const getCourseFullName = (code) => {
    return COURSE_NAMES[code] || code;
  };

  const renderAgendaGroup = (group, isPast = false) => {
    const isCurrentDay = isToday(group.day);

    return (
      <div 
        key={`agenda-group-${group.day}`} 
        style={{
          ...styles.agendaDayGroup,
          ...(isPast ? styles.agendaDayGroupPast : {})
        }}
      >
        <div style={styles.agendaDayGroupHeader}>
          <div style={{
            ...styles.agendaDayNumberBadge,
            ...(isCurrentDay ? styles.agendaDayNumberToday : {})
          }}>
            {group.day}
          </div>
          <span style={styles.agendaDayNameText}>
            {getSelectedDateTitle(group.day)}
          </span>
          {isCurrentDay && (
            <span style={styles.agendaTodayBadge}>HOY</span>
          )}
        </div>

        <div style={styles.agendaCardsStack}>
          {group.events.map(event => (
            <button
              key={event.id}
              onClick={() => setSelectedEvent(event)}
              className="calendar-mobile-event-card"
              style={{
                ...styles.mobileEventCard,
                ...(isPast ? styles.mobileEventCardPast : {})
              }}
            >
              <div style={styles.mobileCardHeader}>
                <div style={styles.mobileCardSiglaGroup}>
                  <span style={styles.mobileCardSigla}>{event.course_code}</span>
                  <span style={styles.mobileCardCourseName}>{getCourseFullName(event.course_code)}</span>
                </div>
                <span style={{
                  ...styles.mobileCardTypeBadge,
                  ...getEventTypeBadgeStyle(event.type)
                }}>
                  {(event.type || 'Evaluación').toUpperCase()}
                </span>
              </div>

              <div style={styles.mobileCardTitle}>{event.title}</div>

              <div style={styles.mobileCardMeta}>
                <div style={styles.mobileMetaItem}>
                  <Clock size={13} style={{ flexShrink: 0 }} />
                  <span>{formatEventTime(event)}</span>
                </div>
                {event.location && (
                  <div style={styles.mobileMetaItem}>
                    <MapPin size={13} style={{ flexShrink: 0 }} />
                    <span>{event.location}</span>
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div style={styles.container} className="calendar-container">
      {/* Header Bar */}
      <header style={styles.header} className="calendar-header-mobile-wrap">
        {/* Row 1: Title & View Toggle */}
        <div className="calendar-header-title-row" style={styles.headerTitleRow}>
          <div style={styles.titleGroup}>
            <div style={styles.titleIconWrapper}>
              <CalendarIcon size={20} color="var(--color-text-primary)" />
            </div>
            <h2 style={styles.title}>Calendario</h2>
          </div>

          {/* View Toggle: Mes / Agenda (Segmented Control) */}
          <div className="calendar-view-toggle" style={styles.segmentedToggle}>
            <button
              onClick={() => setViewMode('month')}
              style={{
                ...styles.segmentedBtn,
                ...(viewMode === 'month' ? styles.segmentedBtnActive : {})
              }}
              className={`calendar-toggle-btn ${viewMode === 'month' ? 'active' : ''}`}
              title="Vista Mes"
              aria-label="Vista Mes"
            >
              <CalendarDays size={14} />
              <span>Mes</span>
            </button>
            <button
              onClick={() => setViewMode('agenda')}
              style={{
                ...styles.segmentedBtn,
                ...(viewMode === 'agenda' ? styles.segmentedBtnActive : {})
              }}
              className={`calendar-toggle-btn ${viewMode === 'agenda' ? 'active' : ''}`}
              title="Vista Agenda"
              aria-label="Vista Agenda"
            >
              <List size={14} />
              <span>Agenda</span>
            </button>
          </div>
        </div>

        {/* Row 2: Date Navigation Controls */}
        <div style={styles.navControls} className="calendar-header-nav-row">
          <div style={styles.monthSelector} className="calendar-month-selector">
            <button onClick={handlePrevMonth} style={styles.iconNavBtn} aria-label="Mes anterior">
              <ChevronLeft size={18} />
            </button>
            <span style={styles.monthTitle} className="calendar-month-title">
              {MONTH_NAMES[month]} {year}
            </span>
            <button onClick={handleNextMonth} style={styles.iconNavBtn} aria-label="Mes siguiente">
              <ChevronRight size={18} />
            </button>
          </div>
          <button onClick={handleToday} style={styles.todayButton} className="calendar-today-btn" title="Ir al mes actual">
            Hoy
          </button>
        </div>
      </header>

      {viewMode === 'month' ? (
        <>
          {/* MOBILE EXPERIENCE: Google Calendar Replica (Screens <768px) */}
          <div className="calendar-mobile-view" style={styles.mobileContainer}>
            {/* 1. Top: Mini Month Calendar Grid */}
            <div style={styles.mobileMonthCard}>
              <div style={styles.mobileWeekdayRow}>
                {MOBILE_WEEKDAYS.map((day, idx) => (
                  <div key={`${day}-${idx}`} style={styles.mobileWeekdayHeader}>
                    {day}
                  </div>
                ))}
              </div>

              <div style={styles.mobileMonthGrid}>
                {/* Empty Days Before 1st of Month */}
                {Array.from({ length: firstDayOfWeek }).map((_, idx) => (
                  <div key={`m-empty-${idx}`} style={styles.mobileEmptyDay} />
                ))}

                {/* Days of Month */}
                {Array.from({ length: daysInMonth }).map((_, idx) => {
                  const dayNum = idx + 1;
                  const isSelected = selectedDay === dayNum;
                  const activeToday = isToday(dayNum);
                  const { hasCritical, hasNormal, count } = getDayDotIndicators(dayNum);

                  return (
                    <button
                      key={`m-day-${dayNum}`}
                      onClick={() => setSelectedDay(dayNum)}
                      className="calendar-mobile-day-btn"
                      style={{
                        ...styles.mobileDayBtn,
                        ...(isSelected ? styles.mobileDayBtnSelected : {})
                      }}
                      aria-label={`${dayNum} de ${MONTH_NAMES[month]}, ${count} evaluaciones`}
                    >
                      <div style={{
                        ...styles.mobileDayCircle,
                        ...(isSelected ? styles.mobileDayCircleSelected : {}),
                        ...(activeToday && !isSelected ? styles.mobileDayCircleToday : {})
                      }}>
                        {dayNum}
                      </div>

                      {/* Event Dot Indicators */}
                      <div style={styles.mobileDotRow}>
                        {hasCritical && <span style={styles.dotCritical} />}
                        {hasNormal && <span style={styles.dotNormal} />}
                        {!hasCritical && !hasNormal && <span style={styles.dotPlaceholder} />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Bottom: Selected Day Agenda */}
            <div style={styles.mobileDayAgendaSection}>
              <div style={styles.mobileAgendaHeader}>
                <div style={styles.mobileAgendaDateTitle}>
                  {getSelectedDateTitle(selectedDay)}
                </div>
                {getEventsForDay(selectedDay).length > 0 && (
                  <span style={styles.mobileAgendaCountBadge}>
                    {getEventsForDay(selectedDay).length} {getEventsForDay(selectedDay).length === 1 ? 'evaluación' : 'evaluaciones'}
                  </span>
                )}
              </div>

              <div style={styles.mobileAgendaCardsList}>
                {getEventsForDay(selectedDay).length > 0 ? (
                  getEventsForDay(selectedDay).map(event => (
                    <button
                      key={event.id}
                      onClick={() => setSelectedEvent(event)}
                      className="calendar-mobile-event-card"
                      style={styles.mobileEventCard}
                    >
                      <div style={styles.mobileCardHeader}>
                        <div style={styles.mobileCardSiglaGroup}>
                          <span style={styles.mobileCardSigla}>{event.course_code}</span>
                          <span style={styles.mobileCardCourseName}>{getCourseFullName(event.course_code)}</span>
                        </div>
                        <span style={{
                          ...styles.mobileCardTypeBadge,
                          ...getEventTypeBadgeStyle(event.type)
                        }}>
                          {(event.type || 'Evaluación').toUpperCase()}
                        </span>
                      </div>

                      <div style={styles.mobileCardTitle}>{event.title}</div>

                      <div style={styles.mobileCardMeta}>
                        <div style={styles.mobileMetaItem}>
                          <Clock size={13} style={{ flexShrink: 0 }} />
                          <span>{formatEventTime(event)}</span>
                        </div>
                        {event.location && (
                          <div style={styles.mobileMetaItem}>
                            <MapPin size={13} style={{ flexShrink: 0 }} />
                            <span>{event.location}</span>
                          </div>
                        )}
                      </div>
                    </button>
                  ))
                ) : (
                  <div style={styles.mobileEmptyState}>
                    <div style={styles.mobileEmptyIconBox}>
                      <CalendarIcon size={24} color="var(--color-text-muted)" />
                    </div>
                    <div style={styles.mobileEmptyTitle}>Sin evaluaciones para este día</div>
                    <div style={styles.mobileEmptySubtitle}>
                      Toca un día con punto indicador en el calendario para ver sus actividades y fechas de entrega.
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* DESKTOP EXPERIENCE: Full 7-Column Floating Grid (Screens >=768px) */}
          <div className="calendar-desktop-view" style={styles.gridContainer}>
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
        </>
      ) : (
        /* AGENDA VIEW: Continuous Chronological Feed (Shared & Responsive for Mobile & Desktop) */
        <div className="calendar-agenda-view" style={styles.agendaContainer}>
          <div style={styles.agendaViewWrapper}>
            {isPastMonth && monthEventsGrouped.length > 0 && (
              <div style={styles.agendaPastMonthBanner}>
                <History size={14} style={{ flexShrink: 0 }} />
                <span>Mes finalizado • Evaluaciones históricas</span>
              </div>
            )}

            {isCurrentMonth && pastEventsCount > 0 && (
              <div style={styles.agendaPastSection}>
                <button
                  type="button"
                  onClick={() => setShowPastAgendaEvents(prev => !prev)}
                  className="agenda-past-toggle-btn"
                  style={styles.agendaPastToggleBtn}
                  aria-expanded={showPastAgendaEvents}
                >
                  <div style={styles.agendaPastToggleLeft}>
                    <History size={14} style={{ flexShrink: 0 }} />
                    <span>
                      {showPastAgendaEvents ? 'Ocultar' : 'Ver'} evaluaciones anteriores de este mes ({pastEventsCount})
                    </span>
                  </div>
                  {showPastAgendaEvents ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>

                {showPastAgendaEvents && (
                  <div style={styles.agendaPastListWrapper}>
                    {pastGroups.map(group => renderAgendaGroup(group, true))}
                  </div>
                )}
              </div>
            )}

            {isCurrentMonth && pastEventsCount > 0 && upcomingEventsCount > 0 && (
              <div style={styles.agendaSectionDivider}>
                <span style={styles.agendaSectionDividerText}>Próximas evaluaciones</span>
                <div style={styles.agendaDividerLine} />
              </div>
            )}

            {/* Main upcoming / active events list */}
            {isCurrentMonth ? (
              upcomingGroups.length > 0 ? (
                upcomingGroups.map(group => renderAgendaGroup(group, false))
              ) : (
                <div style={styles.mobileEmptyState}>
                  <div style={styles.mobileEmptyIconBox}>
                    <CalendarIcon size={24} color="var(--color-text-muted)" />
                  </div>
                  <div style={styles.mobileEmptyTitle}>No hay más evaluaciones este mes</div>
                  <div style={styles.mobileEmptySubtitle}>
                    {pastEventsCount > 0 
                      ? 'Ya concluyeron todas las evaluaciones programadas para este mes.' 
                      : 'No se encontraron eventos programados para lo que resta de mes.'}
                  </div>
                </div>
              )
            ) : isPastMonth ? (
              pastGroups.length > 0 ? (
                pastGroups.map(group => renderAgendaGroup(group, true))
              ) : (
                <div style={styles.mobileEmptyState}>
                  <div style={styles.mobileEmptyIconBox}>
                    <CalendarIcon size={24} color="var(--color-text-muted)" />
                  </div>
                  <div style={styles.mobileEmptyTitle}>No hay evaluaciones en este mes</div>
                  <div style={styles.mobileEmptySubtitle}>
                    Usa las flechas de navegación superiores para revisar otros meses.
                  </div>
                </div>
              )
            ) : (
              upcomingGroups.length > 0 ? (
                upcomingGroups.map(group => renderAgendaGroup(group, false))
              ) : (
                <div style={styles.mobileEmptyState}>
                  <div style={styles.mobileEmptyIconBox}>
                    <CalendarIcon size={24} color="var(--color-text-muted)" />
                  </div>
                  <div style={styles.mobileEmptyTitle}>No hay evaluaciones en este mes</div>
                  <div style={styles.mobileEmptySubtitle}>
                    Usa las flechas de navegación superiores para revisar otros meses.
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      )}

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
  headerTitleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px'
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
  headerControlsGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  segmentedToggle: {
    display: 'inline-flex',
    alignItems: 'center',
    backgroundColor: 'var(--color-surface-bg)',
    border: '1px solid var(--color-border)',
    borderRadius: '8px',
    padding: '3px',
    gap: '2px'
  },
  segmentedBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '5px 10px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: 600,
    color: 'var(--color-text-secondary)',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    transition: 'all 0.15s ease'
  },
  segmentedBtnActive: {
    backgroundColor: 'var(--color-elevated-surface)',
    color: 'var(--color-text-primary)',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)'
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
    borderColor: 'var(--color-action-primary)',
    boxShadow: '0 0 0 1px var(--color-action-primary)',
    backgroundColor: 'var(--color-elevated-surface)'
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
    color: 'var(--color-action-primary)'
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

  /* Mobile Experience (Google Calendar Pattern) Styles */
  mobileContainer: {
    flex: 1,
    flexDirection: 'column',
    gap: '14px',
    minHeight: 0
  },
  mobileMonthCard: {
    backgroundColor: 'var(--color-elevated-surface)',
    borderRadius: '12px',
    border: '1px solid var(--color-border)',
    padding: '12px 8px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  mobileWeekdayRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    textAlign: 'center'
  },
  mobileWeekdayHeader: {
    fontSize: '11px',
    fontWeight: 700,
    color: 'var(--color-text-muted)',
    fontFamily: 'var(--font-mono)',
    paddingBottom: '4px'
  },
  mobileMonthGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    rowGap: '6px'
  },
  mobileEmptyDay: {
    width: '100%',
    aspectRatio: '1 / 1',
    minHeight: '40px'
  },
  mobileDayBtn: {
    padding: '4px 2px'
  },
  mobileDayBtnSelected: {
    backgroundColor: 'transparent'
  },
  mobileDayCircle: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '13px',
    fontWeight: 600,
    fontFamily: 'var(--font-mono)',
    color: 'var(--color-text-primary)',
    transition: 'all 0.15s ease'
  },
  mobileDayCircleSelected: {
    backgroundColor: 'var(--color-text-primary)',
    color: 'var(--color-page-bg)',
    fontWeight: 700
  },
  mobileDayCircleToday: {
    border: '1.5px solid var(--color-action-primary)',
    color: 'var(--color-action-primary)',
    fontWeight: 700
  },
  mobileDotRow: {
    height: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '3px'
  },
  dotCritical: {
    width: '5px',
    height: '5px',
    borderRadius: '50%',
    backgroundColor: 'var(--color-warning)'
  },
  dotNormal: {
    width: '5px',
    height: '5px',
    borderRadius: '50%',
    backgroundColor: 'var(--color-action-primary)'
  },
  dotPlaceholder: {
    width: '5px',
    height: '5px',
    borderRadius: '50%',
    backgroundColor: 'transparent'
  },

  /* Mobile Day Agenda Section */
  mobileDayAgendaSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    flex: 1
  },
  mobileAgendaHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 4px'
  },
  mobileAgendaDateTitle: {
    fontSize: '14px',
    fontWeight: 700,
    color: 'var(--color-text-primary)'
  },
  mobileAgendaCountBadge: {
    fontSize: '11px',
    fontWeight: 600,
    color: 'var(--color-text-secondary)',
    fontFamily: 'var(--font-mono)'
  },
  mobileAgendaCardsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  mobileEventCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    padding: '12px 14px',
    borderRadius: '10px',
    backgroundColor: 'var(--color-elevated-surface)',
    border: '1px solid var(--color-border)',
    textAlign: 'left',
    cursor: 'pointer',
    width: '100%',
    boxSizing: 'border-box'
  },
  mobileCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '8px'
  },
  mobileCardSiglaGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    minWidth: 0
  },
  mobileCardSigla: {
    fontFamily: 'var(--font-mono)',
    fontWeight: 700,
    fontSize: '12px',
    color: 'var(--color-action-primary)',
    letterSpacing: '0.02em',
    flexShrink: 0
  },
  mobileCardCourseName: {
    fontSize: '11px',
    fontWeight: 500,
    color: 'var(--color-text-secondary)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  mobileCardTypeBadge: {
    fontSize: '10px',
    fontWeight: 700,
    padding: '2px 6px',
    borderRadius: '4px',
    fontFamily: 'var(--font-mono)',
    letterSpacing: '0.04em',
    flexShrink: 0
  },
  mobileCardTitle: {
    fontSize: '14px',
    fontWeight: 600,
    color: 'var(--color-text-primary)',
    lineHeight: 1.3
  },
  mobileCardMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '12px',
    color: 'var(--color-text-secondary)',
    marginTop: '2px'
  },
  mobileMetaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px'
  },

  /* Continuous Agenda View (Desktop & Mobile) */
  agendaContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
    minHeight: 0,
    padding: '4px 0 24px 0'
  },
  agendaViewWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    width: '100%',
    maxWidth: '760px',
    margin: '0 auto',
    boxSizing: 'border-box'
  },
  mobileAgendaViewWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    width: '100%',
    maxWidth: '760px',
    margin: '0 auto',
    boxSizing: 'border-box'
  },
  agendaDayGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  agendaDayGroupHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '4px 2px'
  },
  agendaDayNumberBadge: {
    width: '26px',
    height: '26px',
    borderRadius: '50%',
    backgroundColor: 'var(--color-surface-bg)',
    border: '1px solid var(--color-border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: 700,
    fontFamily: 'var(--font-mono)',
    color: 'var(--color-text-primary)'
  },
  agendaDayNumberToday: {
    backgroundColor: 'var(--color-action-primary)',
    color: 'var(--color-elevated-surface)',
    borderColor: 'var(--color-action-primary)'
  },
  agendaTodayBadge: {
    fontSize: '10px',
    fontWeight: 700,
    fontFamily: 'var(--font-mono)',
    padding: '2px 6px',
    borderRadius: '4px',
    backgroundColor: 'var(--color-action-primary)',
    color: 'var(--color-elevated-surface)',
    letterSpacing: '0.04em'
  },
  agendaDayNameText: {
    fontSize: '13px',
    fontWeight: 700,
    color: 'var(--color-text-primary)'
  },
  agendaCardsStack: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  agendaDayGroupPast: {
    opacity: 0.72
  },
  mobileEventCardPast: {
    backgroundColor: 'var(--color-surface-bg)',
    borderColor: 'var(--color-border)'
  },
  agendaPastSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginBottom: '4px'
  },
  agendaPastToggleBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: '10px 14px',
    backgroundColor: 'var(--color-surface-bg)',
    border: '1px solid var(--color-border)',
    borderRadius: '10px',
    color: 'var(--color-text-secondary)',
    fontSize: '12px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background-color 0.15s ease, border-color 0.15s ease'
  },
  agendaPastToggleLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  agendaPastListWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
    padding: '4px 0 8px 0'
  },
  agendaSectionDivider: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    margin: '4px 0 2px 0'
  },
  agendaSectionDividerText: {
    fontSize: '11px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: 'var(--color-text-muted)',
    fontFamily: 'var(--font-mono)',
    whiteSpace: 'nowrap'
  },
  agendaDividerLine: {
    flex: 1,
    height: '1px',
    backgroundColor: 'var(--color-border)'
  },
  agendaPastMonthBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
    backgroundColor: 'var(--color-surface-bg)',
    borderRadius: '8px',
    border: '1px solid var(--color-border)',
    color: 'var(--color-text-muted)',
    fontSize: '12px',
    fontWeight: 500
  },

  /* Mobile Empty State */
  mobileEmptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '32px 16px',
    backgroundColor: 'var(--color-elevated-surface)',
    borderRadius: '12px',
    border: '1px dashed var(--color-border)',
    textAlign: 'center',
    gap: '8px'
  },
  mobileEmptyIconBox: {
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    backgroundColor: 'var(--color-surface-bg)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '4px'
  },
  mobileEmptyTitle: {
    fontSize: '14px',
    fontWeight: 600,
    color: 'var(--color-text-primary)',
    margin: 0
  },
  mobileEmptySubtitle: {
    fontSize: '12px',
    color: 'var(--color-text-muted)',
    maxWidth: '260px',
    lineHeight: 1.4,
    margin: 0
  },

  // Perry Accent Badges (≤5% acentos)
  badgeCritical: {
    backgroundColor: 'var(--color-surface-bg)',
    borderColor: 'var(--color-warning)',
    color: 'var(--color-warning)'
  },
  badgeTeal: {
    backgroundColor: 'var(--color-surface-bg)',
    borderColor: 'var(--color-action-primary)',
    color: 'var(--color-action-primary)'
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
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: '0 20px 25px -5px rgba(69, 36, 15, 0.1)',
    boxSizing: 'border-box'
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
    color: 'var(--color-action-primary)',
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
