import React, { useMemo } from 'react';
import { ArrowLeft, Info, CheckSquare } from 'lucide-react';
import { getCoursePendingCount } from '../utils/taskLoader';

export default function CourseSubSidebar({ course, onBack, activeTab = 'general', onSelectTab }) {
  const pendingCount = useMemo(
    () => (course ? getCoursePendingCount(course.course_code) : 0),
    [course]
  );

  if (!course) return null;

  return (
    <aside className="course-sidebar">
      {/* Back button */}
      <div className="course-sidebar-header">
        <button onClick={onBack} className="course-back-button" title="Volver a Ramos">
          <ArrowLeft size={16} />
          <span className="course-back-text-full">Volver a Ramos</span>
          <span className="course-back-text-short">Ramos</span>
        </button>
      </div>

      {/* Course Code & Name Badge */}
      <div className="course-sidebar-badge">
        <span className="course-sidebar-code">{course.course_code}</span>
        <h2 className="course-sidebar-name">{course.course_name}</h2>
      </div>

      {/* Sub-navigation Items */}
      <nav className="course-sidebar-nav">
        <button 
          onClick={() => onSelectTab && onSelectTab('general')}
          className={`course-nav-item ${activeTab === 'general' ? 'active' : ''}`}
          title="General"
        >
          <Info size={16} />
          <span>General</span>
        </button>
        <button 
          onClick={() => onSelectTab && onSelectTab('tasks')}
          className={`course-nav-item ${activeTab === 'tasks' ? 'active' : ''}`}
          title="Tareas"
        >
          <CheckSquare size={16} />
          <span className="course-nav-tab-label">Tareas</span>
          <span className="course-nav-badge">{pendingCount}</span>
        </button>
      </nav>
    </aside>
  );
}

