import React, { useState, useEffect } from 'react';

const themes = [
  { id: '', name: 'Agente P', bg: '#FAF7F2', accent: '#08ACB1' },
  { id: 'light', name: 'Light', bg: '#FFFFFF', accent: '#2563EB' },
  { id: 'dark', name: 'Dark', bg: '#111827', accent: '#3B82F6' },
  { id: 'monokai', name: 'Monokai', bg: '#272822', accent: '#A6E22E' },
  { id: 'dracula', name: 'Dracula', bg: '#282A36', accent: '#FF79C6' },
  { id: 'owca', name: 'O.W.C.A.', bg: '#000000', accent: '#00FF00' },
  { id: 'coffee', name: 'Coffee', bg: '#20161F', accent: '#DDA77B' },
];

export function ThemeSelector() {
  const [activeTheme, setActiveTheme] = useState('');

  useEffect(() => {
    const savedTheme = localStorage.getItem('agente_p_theme') || '';
    setActiveTheme(savedTheme);
  }, []);

  const handleThemeChange = (themeId) => {
    setActiveTheme(themeId);
    localStorage.setItem('agente_p_theme', themeId);
    
    if (themeId) {
      document.documentElement.setAttribute('data-theme', themeId);
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  };

  return (
    <div style={{ padding: '24px', backgroundColor: 'var(--color-surface-bg)', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
      <h3 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: '600' }}>Tema de la Interfaz</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '16px' }}>
        {themes.map((theme) => {
          const isActive = activeTheme === theme.id;
          return (
            <button
              key={theme.id}
              onClick={() => handleThemeChange(theme.id)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                padding: '12px',
                borderRadius: '8px',
                border: `2px solid ${isActive ? 'var(--color-action-primary)' : 'var(--color-border)'}`,
                backgroundColor: 'var(--color-elevated-surface)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <div
                style={{
                  width: '100%',
                  height: '40px',
                  borderRadius: '6px',
                  backgroundColor: theme.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid var(--color-border)'
                }}
              >
                <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: theme.accent }}></div>
              </div>
              <span style={{ fontSize: '14px', fontWeight: isActive ? '600' : '400', color: 'var(--color-text-primary)' }}>
                {theme.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
