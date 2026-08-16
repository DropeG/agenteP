/**
 * Loads canonical tasks.json files across all courses in the workspace using Vite's eager import.meta.glob
 */
const taskModules = import.meta.glob('../../../agents/workspace/*/tasks.json', { eager: true });

// Build a map of course_code -> tasks array
const tasksByCourse = {};

for (const [path, mod] of Object.entries(taskModules)) {
  // Extract course code from path: ../../../agents/workspace/{COURSE_CODE}/tasks.json
  const match = path.match(/agents\/workspace\/([^/]+)\/tasks\.json/i);
  if (match && match[1]) {
    const courseCode = match[1].toUpperCase();
    const tasksArray = mod.default || mod;
    if (Array.isArray(tasksArray)) {
      tasksByCourse[courseCode] = tasksArray;
    }
  }
}

/**
 * Format an ISO date string to a clean Spanish readable format: "28 ago en 20:00"
 */
export function formatTaskDate(isoString) {
  if (!isoString) return 'Sin fecha';
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;

    const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day} ${month} en ${hours}:${minutes}`;
  } catch {
    return isoString;
  }
}

/**
 * Compute relative days string (e.g. "En 3 días", "Vence hoy", "Cerrado")
 */
export function getRelativeTimeString(isoString) {
  if (!isoString) return '';
  try {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'Cerrado';
    if (diffDays === 0) return 'Vence hoy';
    if (diffDays === 1) return 'Vence mañana';
    return `En ${diffDays} días`;
  } catch {
    return '';
  }
}

/**
 * Loads and groups tasks for a specific course into upcoming and past
 */
export function loadCourseTasks(courseCode) {
  if (!courseCode) return { upcoming: [], past: [] };

  const rawTasks = tasksByCourse[courseCode.toUpperCase()] || [];
  const now = new Date();

  const upcoming = [];
  const past = [];

  for (const task of rawTasks) {
    const dueDate = task.dates?.due_at ? new Date(task.dates.due_at) : null;
    const lockDate = task.dates?.lock_at ? new Date(task.dates.lock_at) : null;
    const isClosed = task.status === 'closed';
    const isPastDue = (dueDate && dueDate < now && isClosed) || (lockDate && lockDate < now);

    if (isClosed || isPastDue) {
      past.push({
        ...task,
        formattedDue: formatTaskDate(task.dates?.due_at),
        formattedUnlock: formatTaskDate(task.dates?.unlock_at),
        formattedLock: formatTaskDate(task.dates?.lock_at),
        relativeTime: 'Cerrado'
      });
    } else {
      const daysDiff = dueDate ? Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : 999;
      upcoming.push({
        ...task,
        formattedDue: formatTaskDate(task.dates?.due_at),
        formattedUnlock: formatTaskDate(task.dates?.unlock_at),
        formattedLock: formatTaskDate(task.dates?.lock_at),
        relativeTime: getRelativeTimeString(task.dates?.due_at),
        urgent: daysDiff <= 3
      });
    }
  }

  // Sort upcoming by due date ascending
  upcoming.sort((a, b) => {
    const da = a.dates?.due_at ? new Date(a.dates.due_at).getTime() : Infinity;
    const db = b.dates?.due_at ? new Date(b.dates.due_at).getTime() : Infinity;
    return da - db;
  });

  // Sort past by due date descending
  past.sort((a, b) => {
    const da = a.dates?.due_at ? new Date(a.dates.due_at).getTime() : 0;
    const db = b.dates?.due_at ? new Date(b.dates.due_at).getTime() : 0;
    return db - da;
  });

  return { upcoming, past };
}

/**
 * Returns count of upcoming tasks for a course
 */
export function getCoursePendingCount(courseCode) {
  if (!courseCode) return 0;
  const { upcoming } = loadCourseTasks(courseCode);
  return upcoming.length;
}
