import React, { useState, useEffect, useRef } from 'react';

export default function GradeCell({ item, value, onChange }) {
  // Local text buffer for smooth editing without interruption
  const [text, setText] = useState(() => (value != null ? String(value) : '1.0'));
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  // Keep in sync with parent value when not actively typing
  useEffect(() => {
    if (!isFocused) {
      setText(value != null ? String(value) : '1.0');
    }
  }, [value, isFocused]);

  const commitValue = () => {
    const raw = text.trim().replace(',', '.');
    if (raw === '') {
      onChange(1.0);
      setText('1.0');
      return;
    }
    const num = parseFloat(raw);
    if (isNaN(num)) {
      const fallback = value != null ? value : 1.0;
      onChange(fallback);
      setText(String(fallback));
      return;
    }
    // Clamp within Chilean scale 1.0 - 7.0 and round to 2 decimals
    const clamped = Math.max(1.0, Math.min(7.0, Math.round(num * 100) / 100));
    onChange(clamped);
    setText(String(clamped));
  };

  const handleFocus = (e) => {
    setIsFocused(true);
    e.target.select();
  };

  const handleBlur = () => {
    setIsFocused(false);
    commitValue();
  };

  const handleChange = (e) => {
    const nextVal = e.target.value;
    // Allow digits, decimal dot, decimal comma
    if (/^[0-9.,]*$/.test(nextVal)) {
      setText(nextVal);
      // Real-time optimistic update if valid float between 1.0 and 7.0
      const formatted = nextVal.replace(',', '.');
      const num = parseFloat(formatted);
      if (!isNaN(num) && num >= 1.0 && num <= 7.0) {
        onChange(num);
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      commitValue();

      // Excel/Sheets behavior: focus next grade cell on Enter
      const card = inputRef.current?.closest('.course-grades-view');
      if (card) {
        const inputs = Array.from(card.querySelectorAll('input.grade-cell-input'));
        const index = inputs.indexOf(inputRef.current);
        if (index >= 0 && index < inputs.length - 1) {
          inputs[index + 1].focus();
        } else {
          inputRef.current?.blur();
        }
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setText(value != null ? String(value) : '1.0');
      inputRef.current?.blur();
    }
  };

  const numVal = parseFloat(text.replace(',', '.'));
  const isPassing = !isNaN(numVal) && numVal >= 3.95;

  return (
    <div
      style={{
        ...styles.cellCard,
        opacity: item.isDropped ? 0.6 : 1,
        backgroundColor: item.isDropped ? 'var(--color-surface-bg)' : 'var(--color-elevated-surface)',
        borderColor: isFocused ? 'var(--color-action-primary)' : 'var(--color-border)'
      }}
      className="grade-cell-container"
    >
      {/* Cell Title & Weight */}
      <div style={styles.cellHeader}>
        <span
          style={{
            ...styles.cellTitle,
            textDecoration: item.isDropped ? 'line-through' : 'none'
          }}
          title={item.name}
        >
          {item.short_name || item.name}
        </span>
        {item.weight != null && (
          <span style={styles.cellWeight}>{item.weight}%</span>
        )}
      </div>

      {/* Spreadsheet Input */}
      <div style={styles.inputBox}>
        <input
          ref={inputRef}
          type="text"
          inputMode="decimal"
          value={text}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className="grade-cell-input"
          style={{
            ...styles.input,
            color: isPassing ? 'var(--color-agent-completed)' : 'var(--color-text-primary)'
          }}
          placeholder="1.0"
        />
      </div>

      {/* State Tags */}
      {item.isDropped && (
        <span style={styles.droppedTag}>Eliminada</span>
      )}
      {item.isExempted && (
        <span style={styles.exemptedTag}>Eximido</span>
      )}
    </div>
  );
}

const styles = {
  cellCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '8px 6px',
    borderRadius: '8px',
    border: '1px solid var(--color-border)',
    transition: 'border-color 150ms ease, box-shadow 150ms ease, background-color 150ms ease',
    minWidth: '85px',
    boxSizing: 'border-box'
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
  inputBox: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center'
  },
  input: {
    width: '100%',
    maxWidth: '75px',
    height: '32px',
    textAlign: 'center',
    fontSize: '16px',
    fontWeight: 700,
    fontFamily: 'var(--font-mono)',
    borderRadius: '6px',
    border: '1px solid var(--color-border)',
    backgroundColor: 'var(--color-surface-bg)',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 120ms ease, background-color 120ms ease'
  },
  droppedTag: {
    fontSize: '9px',
    fontWeight: 600,
    color: 'var(--color-warning)',
    marginTop: '4px',
    textTransform: 'uppercase',
    letterSpacing: '0.02em'
  },
  exemptedTag: {
    fontSize: '9px',
    fontWeight: 600,
    color: 'var(--color-agent-completed)',
    marginTop: '4px',
    textTransform: 'uppercase',
    letterSpacing: '0.02em'
  }
};
