import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import CourseGrid from './components/CourseGrid';
import DetailPanel from './components/DetailPanel';
import CourseWorkspaceView from './components/CourseWorkspaceView';
import SettingsView from './components/SettingsView';
import { supabase } from './supabase';

const INITIAL_COURSES = [
  { course_code: 'IIC2143', course_name: 'Ingeniería de Software' }
];

export default function App() {
  const [activeView, setActiveView] = useState('ramos');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [logs, setLogs] = useState([]);
  const [fetchError, setFetchError] = useState(null);

  // Fetch initial tasks & logs from Supabase + Poll every 3s
  useEffect(() => {
    async function fetchData() {
      try {
        const tasksRes = await fetch(`/api/supabase/tasks?select=*&order=id.desc`);
        if (!tasksRes.ok) throw new Error(`Tasks fetch failed: ${tasksRes.statusText || tasksRes.status}`);
        const tasksData = await tasksRes.json();
        if (tasksData && tasksData.length > 0) setTasks(tasksData);

        const logsRes = await fetch(`/api/supabase/logs?select=*&order=id.desc&limit=50`);
        if (!logsRes.ok) throw new Error(`Logs fetch failed: ${logsRes.statusText || logsRes.status}`);
        const logsData = await logsRes.json();
        if (logsData && logsData.length > 0) setLogs(logsData);

        setFetchError(null);
      } catch (err) {
        console.error('Error fetching Supabase data:', err);
        setFetchError(err.message || 'Network Error blocked Supabase fetch');
      }
    }

    fetchData();
    const pollInterval = setInterval(fetchData, 3000);

    // Subscribe to realtime updates
    const tasksSubscription = supabase
      .channel('tasks-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, payload => {
        if (payload.eventType === 'INSERT') {
          setTasks(prev => [payload.new, ...prev]);
        } else if (payload.eventType === 'UPDATE') {
          setTasks(prev => prev.map(t => t.id === payload.new.id ? payload.new : t));
        }
      })
      .subscribe();

    const logsSubscription = supabase
      .channel('logs-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'logs' }, payload => {
        setLogs(prev => [payload.new, ...prev.slice(0, 49)]);
      })
      .subscribe();

    return () => {
      clearInterval(pollInterval);
      supabase.removeChannel(tasksSubscription);
      supabase.removeChannel(logsSubscription);
    };
  }, []);

  // Compute active task counts per course
  const taskCounts = tasks.reduce((acc, task) => {
    if (task.status === 'pending' || task.status === 'processing') {
      acc[task.course_code] = (acc[task.course_code] || 0) + 1;
    }
    return acc;
  }, {});

  const handleViewChange = (view) => {
    setActiveView(view);
    setSelectedCourse(null);
  };

  return (
    <div style={styles.appShell}>
      <Sidebar
        activeView={activeView}
        setActiveView={handleViewChange}
        collapsed={selectedCourse !== null}
        onBackToRamos={() => setSelectedCourse(null)}
      />

      <main className={`main-content ${selectedCourse ? 'has-course' : ''}`}>
        {fetchError && (
          <div style={{ padding: '16px', background: '#FEE2E2', color: '#991B1B', margin: '16px', borderRadius: '8px', fontWeight: 'bold' }}>
            ⚠️ Supabase Fetch Error: {fetchError}. Check browser DevTools console or adblocker.
          </div>
        )}
        {selectedCourse ? (
          <CourseWorkspaceView
            course={selectedCourse}
            tasks={tasks}
            logs={logs}
            onBackToDashboard={() => setSelectedCourse(null)}
          />
        ) : (
          <>
            {activeView === 'ramos' && (
              <CourseGrid
                courses={INITIAL_COURSES}
                onSelectCourse={setSelectedCourse}
                taskCounts={taskCounts}
              />
            )}
            {activeView === 'settings' && <SettingsView />}
          </>
        )}
      </main>
    </div>
  );
}

const styles = {
  appShell: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: 'var(--color-page-bg)'
  },
  mainContent: {
    marginLeft: '240px',
    flex: 1,
    minHeight: '100vh'
  }
};
