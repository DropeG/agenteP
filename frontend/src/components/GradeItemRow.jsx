import React from 'react';
import { Minus, Plus, X } from 'lucide-react';

export default function GradeItemRow({
  item,
  value,
  onChange,
  onClear,
  isDropped = false,
  isExempted = false
}) {
  const handleInputChange = (e) => {
    const raw = e.target.value.replace(',', '.');
    if (raw === '') {
      onChange(null);
      return;
    }
    const num = parseFloat(raw);
    if (!isNaN(num)) {
      // Clamp within 1.0 to 7.0
      const clamped = Math.max(1.0, Math.min(7.0, num));
      onChange(clamped);
    }
  };

  const handleStep = (delta) => {
    const current = value !== null && value !== undefined ? value : 4.0;
    const nextVal = Math.max(1.0, Math.min(7.0, Math.round((current + delta) * 10) / 10));
    onChange(nextVal);
  };

  const hasGrade = value !== null && value !== undefined;

  return (
    <div
      style={{
        ...styles.row,
        opacity: isDropped ? 0.6 : 1,
        backgroundColor: isDropped ? 'var(--color-surface-bg)' : 'var(--color-elevated-surface)'
      }}
      className="grade-item-row"
    >
      {/* Left: Item Identifiers & Name */}
      <div style={styles.leftCol}>
        <span style={styles.shortBadge}>{item.short_name || item.id.toUpperCase()}</span>
        <div style={styles.infoCol}>
          <div style={styles.nameRow}>
            <span
              style={{
                ...styles.itemName,
                textDecoration: isDropped ? 'line-through' : 'none'
              }}
            >
              {item.name}
            </span>
            {item.weight != null && (
              <span style={styles.weightBadge}>{item.weight}%</span>
            )}
          </div>

          {/* Badges */}
          <div style={styles.badgeRow}>
            {isDropped && (
              <span style={styles.droppedTag}>Descartada (peor nota)</span>
            )}
            {isExempted && (
              <span style={styles.exemptedTag}>Eximido</span>
            )}
            {item.is_exam && (
              <span style={styles.examTag}>Examen</span>
            )}
          </div>
        </div>
      </div>

      {/* Right: Grade Stepper and Input */}
      <div style={styles.rightCol}>
        <div style={styles.inputContainer}>
          <button
            type="button"
            onClick={() => handleStep(-0.1)}
            style={styles.stepBtn}
            title="Bajar 0.1 décimas"
            disabled={value !== null && value <= 1.0}
          >
            <Minus size={13} />
          </button>

          <input
            type="number"
            step="0.1"
            min="1.0"
            max="7.0"
            placeholder="-"
            value={hasGrade ? value.toFixed(1) : ''}
            onChange={handleInputChange}
            style={{
              ...styles.gradeInput,
              color: hasGrade
                ? value >= 3.95
                  ? 'var(--color-agent-completed)'
                  : 'var(--color-agent-failed)'
                : 'var(--color-text-muted)'
            }}
          />

          <button
            type="button"
            onClick={() => handleStep(0.1)}
            style={styles.stepBtn}
            title="Subir 0.1 décimas"
            disabled={value !== null && value >= 7.0}
          >
            <Plus size={13} />
          </button>
        </div>

        {hasGrade && (
          <button
            type="button"
            onClick={onClear}
            style={styles.clearBtn}
            title="Quitar nota (dejar pendiente)"
          >
            <X size={14} />
          </button>
        )}
      </div>
    </div>
  );
}

const styles = {
  row: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid var(--color-border)',
    marginBottom: '8px',
    transition: 'background-color 150ms ease, border-color 150ms ease'
  },
  leftCol: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flex: 1
  },
  shortBadge: {
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    fontWeight: 700,
    backgroundColor: 'var(--color-surface-bg)',
    color: 'var(--color-action-primary)',
    padding: '3px 7px',
    borderRadius: '6px',
    border: '1px solid var(--color-border)',
    letterSpacing: '0.04em'
  },
  infoCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px'
  },
  nameRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  itemName: {
    fontSize: '13px',
    fontWeight: 500,
    color: 'var(--color-text-primary)'
  },
  weightBadge: {
    fontSize: '11px',
    fontFamily: 'var(--font-mono)',
    color: 'var(--color-text-muted)',
    backgroundColor: 'var(--color-surface-bg)',
    padding: '1px 5px',
    borderRadius: '4px'
  },
  badgeRow: {
    display: 'flex',
    gap: '6px'
  },
  droppedTag: {
    fontSize: '10px',
    fontWeight: 600,
    color: 'var(--color-warning)',
    backgroundColor: 'rgba(249, 152, 20, 0.12)',
    padding: '1px 6px',
    borderRadius: '4px'
  },
  exemptedTag: {
    fontSize: '10px',
    fontWeight: 600,
    color: 'var(--color-agent-completed)',
    backgroundColor: 'rgba(42, 138, 86, 0.12)',
    padding: '1px 6px',
    borderRadius: '4px'
  },
  examTag: {
    fontSize: '10px',
    fontWeight: 600,
    color: 'var(--color-action-secondary)',
    backgroundColor: 'rgba(139, 63, 10, 0.12)',
    padding: '1px 6px',
    borderRadius: '4px'
  },
  rightCol: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  inputContainer: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'var(--color-surface-bg)',
    borderRadius: '6px',
    border: '1px solid var(--color-border)',
    overflow: 'hidden'
  },
  stepBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '26px',
    height: '28px',
    border: 'none',
    backgroundColor: 'transparent',
    color: 'var(--color-text-secondary)',
    cursor: 'pointer',
    transition: 'background-color 120ms ease'
  },
  gradeInput: {
    width: '46px',
    height: '28px',
    textAlign: 'center',
    fontSize: '14px',
    fontWeight: 700,
    fontFamily: 'var(--font-mono)',
    border: 'none',
    backgroundColor: 'transparent',
    outline: 'none',
    padding: 0
  },
  clearBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '26px',
    height: '26px',
    borderRadius: '50%',
    border: 'none',
    backgroundColor: 'transparent',
    color: 'var(--color-text-muted)',
    cursor: 'pointer',
    transition: 'color 120ms ease, background-color 120ms ease'
  }
};
