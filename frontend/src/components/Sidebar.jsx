import React, { useState } from 'react';
import { BookOpen, Calendar, Settings, Menu, X } from 'lucide-react';

export default function Sidebar({ activeView, setActiveView, collapsed = false, onBackToRamos }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSelect = (view) => {
    if (onBackToRamos) {
      onBackToRamos();
    }
    setActiveView(view);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Top Header */}
      <div className="mobile-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="/agente-p-logo.png" alt="Agente P" style={{ width: '36px', height: '36px', objectFit: 'contain' }} />
          <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text-primary)' }}>Agente P</span>
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)} style={{ padding: '6px' }}>
          {mobileOpen ? <X size={22} color="var(--color-text-primary)" /> : <Menu size={22} color="var(--color-text-primary)" />}
        </button>
      </div>

      {/* Primary Global Sidebar (Tier 1) */}
      <aside className={`sidebar-container ${collapsed ? 'sidebar-collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
        {/* Brand Header & Logo */}
        <div 
          onClick={() => handleSelect('ramos')}
          style={{
            ...styles.brandContainer,
            ...(collapsed ? styles.brandContainerCollapsed : {}),
            cursor: 'pointer'
          }}
          title="Mis Ramos"
        >
          <div style={collapsed ? styles.logoWrapperCollapsed : styles.logoWrapper}>
            <img 
              src="/agente-p-logo.png" 
              alt="Agente P Logo" 
              style={styles.logoImage} 
            />
          </div>
          {!collapsed && (
            <div style={styles.brandTitleGroup}>
              <h1 style={styles.brandTitle}>Agente P</h1>
            </div>
          )}
        </div>

        {/* Navigation Menu */}
        <nav style={styles.nav}>
          <button
            onClick={() => handleSelect('ramos')}
            title="Mis Ramos"
            style={{
              ...styles.navItem,
              ...(collapsed ? styles.navItemCollapsed : {}),
              ...(activeView === 'ramos' ? styles.navItemActive : {})
            }}
          >
            <BookOpen size={18} style={styles.navIcon} />
            {!collapsed && <span>Mis Ramos</span>}
          </button>

          <button
            onClick={() => handleSelect('calendar')}
            title="Calendario"
            style={{
              ...styles.navItem,
              ...(collapsed ? styles.navItemCollapsed : {}),
              ...(activeView === 'calendar' ? styles.navItemActive : {})
            }}
          >
            <Calendar size={18} style={styles.navIcon} />
            {!collapsed && <span>Calendario</span>}
          </button>

          <button
            onClick={() => handleSelect('settings')}
            title="Configuración"
            style={{
              ...styles.navItem,
              ...(collapsed ? styles.navItemCollapsed : {}),
              ...(activeView === 'settings' ? styles.navItemActive : {})
            }}
          >
            <Settings size={18} style={styles.navIcon} />
            {!collapsed && <span>Configuración</span>}
          </button>
        </nav>

        {/* Footer Editorial Credits */}
        <div style={{
          ...styles.footer,
          ...(collapsed ? styles.footerCollapsed : {})
        }}>
          <a
            href="https://github.com/DropeG"
            target="_blank"
            rel="noopener noreferrer"
            className="sidebar-credit-link"
            title="GitHub: @DropeG"
            style={styles.creditLink}
          >
            {collapsed ? '©' : '© DROPE'}
          </a>
          {!collapsed && <span style={styles.footerVersion}>v1.0</span>}
        </div>
      </aside>
    </>
  );
}

const styles = {
  brandContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '32px',
    padding: '0 8px'
  },
  brandContainerCollapsed: {
    justifyContent: 'center',
    padding: 0,
    marginBottom: '24px'
  },
  logoWrapper: {
    width: '64px',
    height: '64px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  logoWrapperCollapsed: {
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  logoImage: {
    width: '100%',
    height: '100%',
    objectFit: 'contain'
  },
  brandTitleGroup: {
    display: 'flex',
    flexDirection: 'column'
  },
  brandTitle: {
    fontSize: '20px',
    fontWeight: 700,
    color: 'var(--color-text-primary)',
    letterSpacing: '-0.02em',
    lineHeight: 1.2
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    flex: 1
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 12px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 500,
    color: 'var(--color-text-secondary)',
    transition: 'all 0.15s ease',
    textAlign: 'left'
  },
  navItemCollapsed: {
    justifyContent: 'center',
    padding: '10px'
  },
  navItemActive: {
    backgroundColor: 'var(--color-elevated-surface)',
    color: 'var(--color-action-primary)',
    fontWeight: 600,
    border: '1px solid var(--color-border)'
  },
  navIcon: {
    flexShrink: 0
  },
  footer: {
    paddingTop: '16px',
    borderTop: '1px solid var(--color-border)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '11px',
    color: 'var(--color-text-muted)'
  },
  footerCollapsed: {
    justifyContent: 'center',
    paddingTop: '12px'
  },
  creditLink: {
    color: 'var(--color-text-muted)',
    fontSize: '12px',
    fontWeight: 600,
    letterSpacing: '0.02em',
    textDecoration: 'none',
    transition: 'color 0.15s ease'
  },
  footerVersion: {
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    color: 'var(--color-text-muted)'
  }
};
