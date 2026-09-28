import React, { useState, useMemo, useEffect } from 'react';
import { RotateCcw, Table, Award, CheckCircle2, AlertCircle } from 'lucide-react';
import {
  GRADE_SCALE,
  getInitialGradesState,
  calculateOverallCourseGrade,
  buildFallbackScheme
} from '../utils/gradeEngine';
import GradeCell from './GradeCell';

export default function CourseGradesView({ course }) {
  // Resolve scheme: specific grading_scheme.json or synthesized fallback
  const scheme = useMemo(() => {
    if (course?.grading_scheme) return course.grading_scheme;
    return buildFallbackScheme(course);
  }, [course]);

  // Initial grades all start at 1.0
  const initialGrades = useMemo(() => getInitialGradesState(scheme), [scheme]);

  // Local storage persistence key per course
  const storageKey = useMemo(() => `agenteP_grades_${course?.course_code}`, [course]);

  // State of grades
  const [gradesState, setGradesState] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          const parsed = JSON.parse(saved);
          // Ensure all scheme items exist in state with at least 1.0
          const merged = { ...initialGrades };
          for (const k of Object.keys(initialGrades)) {
            if (parsed[k] !== undefined && parsed[k] !== null) {
              merged[k] = parsed[k];
            }
          }
          return merged;
        }
      } catch (e) {
        console.error('Error loading saved grades:', e);
      }
    }
    return initialGrades;
  });

  // Sync state if course changes
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        const merged = { ...initialGrades };
        for (const k of Object.keys(initialGrades)) {
          if (parsed[k] !== undefined && parsed[k] !== null) {
            merged[k] = parsed[k];
          }
        }
        setGradesState(merged);
      } else {
        setGradesState(initialGrades);
      }
    } catch {
      setGradesState(initialGrades);
    }
  }, [course, storageKey, initialGrades]);

  // Handle grade change for an individual cell
  const handleCellChange = (itemId, val) => {
    setGradesState(prev => {
      const next = { ...prev, [itemId]: val };
      try {
        localStorage.setItem(storageKey, JSON.stringify(next));
      } catch (e) {
        console.error('Error saving grade:', e);
      }
      return next;
    });
  };

  // Reset all grades to 1.0
  const handleReset = () => {
    setGradesState(initialGrades);
    try {
      localStorage.removeItem(storageKey);
    } catch (e) {
      console.error('Error resetting grades:', e);
    }
  };

  // Compute calculated grades in real time
  const overallResult = useMemo(
    () => calculateOverallCourseGrade(scheme, gradesState),
    [scheme, gradesState]
  );

  if (!course) return null;

  const finalGradeDisplay = overallResult.rawScore !== null
    ? overallResult.rawScore.toFixed(2)
    : '1.00';
  const isPassing = overallResult.rawScore !== null && overallResult.rawScore >= 3.95;

  return (
    <div style={styles.container} className="course-grades-view">
      {/* Top Header */}
      <div style={styles.header}>
        <div>
          <div style={styles.codeRow}>
            <span style={styles.codeBadge}>{course.course_code}</span>
            <span style={styles.subTitle}>Planilla de Notas</span>
          </div>
          <h1 style={styles.courseTitle}>{course.course_name}</h1>
        </div>

        {/* Right Header: Final Grade Badge & Reset */}
        <div style={styles.headerRight}>
          <div
            style={{
              ...styles.finalGradePill,
              borderColor: isPassing ? 'var(--color-agent-completed)' : 'var(--color-border)',
              backgroundColor: isPassing ? 'rgba(42, 138, 86, 0.08)' : 'var(--color-surface-bg)'
            }}
          >
            <span style={styles.finalGradeLabel}>Nota Final</span>
            <span
              style={{
                ...styles.finalGradeValue,
                color: isPassing ? 'var(--color-agent-completed)' : 'var(--color-text-primary)'
              }}
            >
              {finalGradeDisplay}
            </span>
          </div>

          <button
            onClick={handleReset}
            style={styles.resetButton}
            title="Restablecer todas las notas a 1.0"
          >
            <RotateCcw size={14} />
            <span>Restablecer a 1.0</span>
          </button>
        </div>
      </div>

      <div style={styles.helperNotice}>
        <span>
          Todas las notas inician en <strong>1.0</strong>. Modifica las casillas con tus calificaciones para calcular automáticamente los promedios y la nota final.
        </span>
      </div>

      {/* Spreadsheet Card Template */}
      <div style={styles.sheetCard}>
        {overallResult.categories.map((catResult, idx) => {
          const catDef = scheme.categories.find(c => c.id === catResult.id);
          const catScoreDisplay = catResult.score !== null ? catResult.score.toFixed(2) : '1.00';
          const isCatPassing = catResult.score !== null && catResult.score >= 3.95;

          return (
            <div key={catResult.id} style={styles.categorySection}>
              {/* Category Header Bar */}
              <div style={styles.categoryBar}>
                <div style={styles.categoryLeft}>
                  <span style={styles.categoryName}>{catResult.name}</span>
                  {catResult.weight != null && (
                    <span style={styles.categoryWeight}>{catResult.weight}%</span>
                  )}
                  {catDef?.formula_description && (
                    <span style={styles.formulaHint}>({catDef.formula_description})</span>
                  )}
                </div>

                <div style={styles.categorySubtotalBox}>
                  <span style={styles.subtotalLabel}>Nota {catResult.short_name || catResult.name}:</span>
                  <span
                    style={{
                      ...styles.subtotalValue,
                      color: isCatPassing ? 'var(--color-agent-completed)' : 'var(--color-text-primary)'
                    }}
                  >
                    {catScoreDisplay}
                  </span>
                </div>
              </div>

              {/* Case A: Direct Items Grid */}
              {catResult.items && (
                <div style={styles.itemsGrid}>
                  {catResult.items.map(item => (
                    <GradeCell
                      key={item.id}
                      item={item}
                      value={gradesState[item.id] !== undefined ? gradesState[item.id] : 1.0}
                      onChange={(val) => handleCellChange(item.id, val)}
                    />
                  ))}
                </div>
              )}

              {/* Case B: Subcategories (e.g. Quizzes, Modelación, Debate) */}
              {catResult.subcategories && (
                <div style={styles.subcategoriesContainer}>
                  {catResult.subcategories.map(sub => {
                    const subScoreDisplay = sub.score !== null ? sub.score.toFixed(2) : '1.00';
                    const isSubPassing = sub.score !== null && sub.score >= 3.95;

                    return (
                      <div key={sub.id} style={styles.subCategoryBlock}>
                        <div style={styles.subCategoryBar}>
                          <div style={styles.subBarLeft}>
                            <span style={styles.subTitleText}>{sub.name}</span>
                            {sub.formula_description && (
                              <span style={styles.subFormulaText}>· {sub.formula_description}</span>
                            )}
                          </div>
                          <div style={styles.subBarRight}>
                            <span style={styles.subScoreLabel}>Nota {sub.short_name || sub.name}:</span>
                            <span
                              style={{
                                ...styles.subScoreVal,
                                color: isSubPassing ? 'var(--color-agent-completed)' : 'var(--color-text-primary)'
                              }}
                            >
                              {subScoreDisplay}
                            </span>
                          </div>
                        </div>

                        <div style={styles.itemsGrid}>
                          {sub.items.map(item => (
                            <GradeCell
                              key={item.id}
                              item={item}
                              value={gradesState[item.id] !== undefined ? gradesState[item.id] : 1.0}
                              onChange={(val) => handleCellChange(item.id, val)}
                            />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {/* Spreadsheet Footer: Total Course Breakdown */}
        <div style={styles.sheetFooter}>
          <div style={styles.footerFormula}>
            <span style={styles.footerFormulaTitle}>Cálculo Final:</span>
            <div style={styles.footerFormulaItems}>
              {overallResult.categories.map((c, i) => (
                <span key={c.id} style={styles.formulaPart}>
                  {c.short_name || c.name} ({c.weight}%)
                  {i < overallResult.categories.length - 1 ? ' + ' : ''}
                </span>
              ))}
            </div>
          </div>

          <div style={styles.footerTotalBox}>
            <span style={styles.footerTotalLabel}>Nota Final:</span>
            <span
              style={{
                ...styles.footerTotalValue,
                color: isPassing ? 'var(--color-agent-completed)' : 'var(--color-text-primary)'
              }}
            >
              {finalGradeDisplay}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '32px',
    maxWidth: '1100px',
    margin: '0 auto',
    width: '100%',
    boxSizing: 'border-box'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '16px',
    marginBottom: '16px'
  },
  codeRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '4px'
  },
  codeBadge: {
    fontFamily: 'var(--font-mono)',
    fontSize: '12px',
    fontWeight: 700,
    backgroundColor: 'var(--color-surface-bg)',
    color: 'var(--color-action-primary)',
    padding: '3px 8px',
    borderRadius: '6px',
    border: '1px solid var(--color-border)'
  },
  subTitle: {
    fontSize: '13px',
    color: 'var(--color-text-secondary)',
    fontWeight: 500
  },
  courseTitle: {
    fontSize: '22px',
    fontWeight: 700,
    color: 'var(--color-text-primary)',
    letterSpacing: '-0.02em',
    margin: 0
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  finalGradePill: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '8px 16px',
    borderRadius: '8px',
    border: '1px solid var(--color-border)'
  },
  finalGradeLabel: {
    fontSize: '12px',
    fontWeight: 600,
    color: 'var(--color-text-secondary)',
    textTransform: 'uppercase',
    letterSpacing: '0.04em'
  },
  finalGradeValue: {
    fontFamily: 'var(--font-mono)',
    fontSize: '20px',
    fontWeight: 800,
    lineHeight: 1
  },
  resetButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 12px',
    fontSize: '13px',
    fontWeight: 500,
    borderRadius: '6px',
    border: '1px solid var(--color-border)',
    backgroundColor: 'var(--color-elevated-surface)',
    color: 'var(--color-text-secondary)',
    cursor: 'pointer',
    transition: 'all 120ms ease'
  },
  helperNotice: {
    fontSize: '12px',
    color: 'var(--color-text-muted)',
    backgroundColor: 'var(--color-surface-bg)',
    padding: '8px 14px',
    borderRadius: '6px',
    border: '1px solid var(--color-border)',
    marginBottom: '20px',
    lineHeight: 1.4
  },
  sheetCard: {
    backgroundColor: 'var(--color-elevated-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
  },
  categorySection: {
    borderBottom: '1px solid var(--color-border)',
    padding: '18px 20px'
  },
  categoryBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '10px',
    marginBottom: '14px'
  },
  categoryLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexWrap: 'wrap'
  },
  categoryName: {
    fontSize: '15px',
    fontWeight: 700,
    color: 'var(--color-text-primary)'
  },
  categoryWeight: {
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    fontWeight: 600,
    backgroundColor: 'var(--color-surface-bg)',
    color: 'var(--color-action-primary)',
    padding: '2px 7px',
    borderRadius: '4px',
    border: '1px solid var(--color-border)'
  },
  formulaHint: {
    fontSize: '11px',
    color: 'var(--color-text-muted)'
  },
  categorySubtotalBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: 'var(--color-surface-bg)',
    padding: '4px 10px',
    borderRadius: '6px',
    border: '1px solid var(--color-border)'
  },
  subtotalLabel: {
    fontSize: '12px',
    fontWeight: 500,
    color: 'var(--color-text-secondary)'
  },
  subtotalValue: {
    fontFamily: 'var(--font-mono)',
    fontSize: '15px',
    fontWeight: 700
  },
  itemsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 120px))',
    gap: '10px'
  },
  cellCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '8px',
    borderRadius: '6px',
    border: '1px solid var(--color-border)',
    transition: 'border-color 120ms ease, background-color 120ms ease'
  },
  cellHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
    marginBottom: '6px',
    width: '100%'
  },
  cellTitle: {
    fontSize: '12px',
    fontWeight: 600,
    color: 'var(--color-text-primary)',
    textAlign: 'center',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  cellWeight: {
    fontSize: '10px',
    fontFamily: 'var(--font-mono)',
    color: 'var(--color-text-muted)'
  },
  inputWrapper: {
    width: '100%'
  },
  cellInput: {
    width: '100%',
    padding: '6px 4px',
    textAlign: 'center',
    fontSize: '15px',
    fontWeight: 700,
    fontFamily: 'var(--font-mono)',
    borderRadius: '4px',
    border: '1px solid var(--color-border)',
    backgroundColor: 'var(--color-surface-bg)',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 120ms ease'
  },
  cellFooterTag: {
    fontSize: '9px',
    fontWeight: 600,
    color: 'var(--color-warning)',
    marginTop: '4px',
    textTransform: 'uppercase'
  },
  cellFooterTagExempt: {
    fontSize: '9px',
    fontWeight: 600,
    color: 'var(--color-agent-completed)',
    marginTop: '4px',
    textTransform: 'uppercase'
  },
  subcategoriesContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
    marginTop: '4px'
  },
  subCategoryBlock: {
    backgroundColor: 'var(--color-surface-bg)',
    borderRadius: '8px',
    padding: '12px',
    border: '1px solid var(--color-border)'
  },
  subCategoryBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '8px',
    marginBottom: '10px'
  },
  subBarLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  subTitleText: {
    fontSize: '13px',
    fontWeight: 600,
    color: 'var(--color-text-primary)'
  },
  subFormulaText: {
    fontSize: '11px',
    color: 'var(--color-text-muted)'
  },
  subBarRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  subScoreLabel: {
    fontSize: '11px',
    color: 'var(--color-text-secondary)'
  },
  subScoreVal: {
    fontFamily: 'var(--font-mono)',
    fontSize: '13px',
    fontWeight: 700
  },
  sheetFooter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '16px',
    padding: '16px 20px',
    backgroundColor: 'var(--color-surface-bg)'
  },
  footerFormula: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '12px',
    color: 'var(--color-text-secondary)'
  },
  footerFormulaTitle: {
    fontWeight: 600,
    color: 'var(--color-text-primary)'
  },
  footerFormulaItems: {
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    color: 'var(--color-text-muted)'
  },
  formulaPart: {},
  footerTotalBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  footerTotalLabel: {
    fontSize: '14px',
    fontWeight: 700,
    color: 'var(--color-text-primary)'
  },
  footerTotalValue: {
    fontFamily: 'var(--font-mono)',
    fontSize: '22px',
    fontWeight: 800
  }
};
