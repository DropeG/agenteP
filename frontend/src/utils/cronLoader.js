import defaultCronData from '../../../agents/workspace/cron_status.json';

/**
 * Loads and normalizes registered cron jobs and background tasks from agents/workspace/cron_status.json
 * @returns {Array<Object>} Array of sanitized cron job metadata and logs
 */
export function loadCronStatuses() {
  try {
    if (!defaultCronData || typeof defaultCronData !== 'object') {
      return [];
    }

    return Object.values(defaultCronData)
      .filter((job) => Boolean(job && typeof job === 'object'))
      .map((job) => ({
        id: job.id || '',
        name: job.name || job.id || 'Tarea Programada',
        description: job.description || '',
        schedule: job.schedule || '* * * * *',
        schedule_label: job.schedule_label || '',
        target_script: job.target_script || null,
        status: job.status || 'idle', // 'success' | 'running' | 'error' | 'idle'
        last_run: job.last_run || null,
        next_run: job.next_run || null,
        logs: Array.isArray(job.logs) ? job.logs : []
      }));
  } catch (err) {
    console.warn('Error loading cron statuses:', err);
    return [];
  }
}
