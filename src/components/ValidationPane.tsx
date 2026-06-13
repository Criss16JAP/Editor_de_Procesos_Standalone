import React from 'react';
import { useProcessStore } from '../store/useProcessStore';

export const ValidationPane: React.FC = () => {
  const { validationIssues } = useProcessStore();

  const criticalIssues = validationIssues.filter(issue => issue.type === 'CRITICAL');
  const warningIssues = validationIssues.filter(issue => issue.type === 'WARNING');

  return (
    <div className="validation-pane-container card">
      <div className="card-header">
        <h2 className="card-title flex align-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          Diagnóstico e Integridad (ISO 24774)
        </h2>
        <p className="card-subtitle">Validaciones semánticas y estructurales en tiempo real</p>
      </div>

      <div className="card-body">
        {/* Status indicator */}
        <div className="status-indicator-wrapper">
          {criticalIssues.length > 0 ? (
            <div className="status-badge badge-error">
              <span className="status-dot dot-error"></span>
              Exportación Bloqueada
            </div>
          ) : warningIssues.length > 0 ? (
            <div className="status-badge badge-warning">
              <span className="status-dot dot-warning"></span>
              Estructura Incompleta
            </div>
          ) : (
            <div className="status-badge badge-success">
              <span className="status-dot dot-success"></span>
              Proceso Válido y Consistente
            </div>
          )}
        </div>

        {/* Critical issues */}
        {criticalIssues.length > 0 && (
          <div className="issues-group">
            <h4 className="issues-group-title text-danger">Errores Críticos ({criticalIssues.length})</h4>
            <div className="issues-list">
              {criticalIssues.map(issue => (
                <div key={issue.id} className="issue-item border-danger animate-fade-in">
                  <div className="issue-icon-wrapper text-danger">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                  </div>
                  <div className="issue-message">{issue.message}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Warnings */}
        {warningIssues.length > 0 && (
          <div className="issues-group">
            <h4 className="issues-group-title text-warning">Advertencias de Calidad ({warningIssues.length})</h4>
            <div className="issues-list">
              {warningIssues.map(issue => (
                <div key={issue.id} className="issue-item border-warning animate-fade-in">
                  <div className="issue-icon-wrapper text-warning">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                      <line x1="12" y1="9" x2="12" y2="13" />
                      <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                  </div>
                  <div className="issue-message">{issue.message}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {validationIssues.length === 0 && (
          <div className="validation-success-state">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="success-icon">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <p className="success-title">¡Cumple con la norma ISO 24774!</p>
            <p className="success-desc">Todos los campos obligatorios están diligenciados y el flujo estructural cumple con las reglas semánticas mínimas. Listo para exportar.</p>
          </div>
        )}
      </div>
    </div>
  );
};
