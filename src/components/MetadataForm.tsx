import React from 'react';
import { useProcessStore } from '../store/useProcessStore';

export const MetadataForm: React.FC = () => {
  const { document: doc, updateMetadata, moveOutcomeUp, moveOutcomeDown } = useProcessStore();
  const { nombre, proposito, resultadosEsperados } = doc.process;

  const handleFieldChange = (field: 'nombre' | 'proposito', value: string) => {
    updateMetadata({ [field]: value });
  };

  const handleOutcomeChange = (index: number, value: string) => {
    const newOutcomes = [...resultadosEsperados];
    newOutcomes[index] = value;
    updateMetadata({ resultadosEsperados: newOutcomes });
  };

  const handleAddOutcome = () => {
    updateMetadata({ resultadosEsperados: [...resultadosEsperados, ''] });
  };

  const handleRemoveOutcome = (index: number) => {
    const newOutcomes = resultadosEsperados.filter((_, idx) => idx !== index);
    updateMetadata({ resultadosEsperados: newOutcomes });
  };

  return (
    <div className="metadata-form-container card">
      <div className="card-header">
        <h2 className="card-title">1. Información General del Proceso</h2>
        <p className="card-subtitle">Especifique las propiedades raíz obligatorias según la norma ISO 24774</p>
      </div>

      <div className="card-body">
        {/* Nombre */}
        <div className="form-group">
          <label htmlFor="process-name" className="form-label required-label">
            Nombre del Proceso
          </label>
          <input
            id="process-name"
            type="text"
            className={`form-input ${!nombre.trim() ? 'input-error' : ''}`}
            placeholder="Ej. Proceso de Gestión de Requisitos de Software"
            value={nombre}
            onChange={(e) => handleFieldChange('nombre', e.target.value)}
          />
        </div>

        {/* Propósito */}
        <div className="form-group">
          <label htmlFor="process-purpose" className="form-label required-label">
            Propósito del Proceso
          </label>
          <textarea
            id="process-purpose"
            className={`form-textarea ${!proposito.trim() ? 'input-error' : ''}`}
            placeholder="Ej. Definir la razón de ser fundamental del proceso y el valor que genera..."
            rows={4}
            value={proposito}
            onChange={(e) => handleFieldChange('proposito', e.target.value)}
          />
        </div>

        {/* Resultados Esperados */}
        <div className="form-group">
          <label className="form-label required-label">
            Resultados Esperados (Outcomes)
          </label>
          <p className="field-desc">El estándar exige especificar al menos un resultado esperado para el proceso.</p>
          
          <div className="outcomes-list">
            {resultadosEsperados.map((outcome, idx) => (
              <div key={idx} className="outcome-item animate-fade-in">
                <input
                  type="text"
                  className={`form-input ${!outcome.trim() ? 'input-error' : ''}`}
                  placeholder={`Ej. Resultado Esperado ${idx + 1}`}
                  value={outcome}
                  onChange={(e) => handleOutcomeChange(idx, e.target.value)}
                />
                 <button
                   type="button"
                   onClick={() => moveOutcomeUp(idx)}
                   className="icon-btn btn-secondary"
                   title="Mover arriba"
                 >
                   ▲
                 </button>
                 <button
                   type="button"
                   onClick={() => moveOutcomeDown(idx)}
                   className="icon-btn btn-secondary"
                   title="Mover abajo"
                 >
                   ▼
                 </button>
                 <button
                   type="button"
                   onClick={() => handleRemoveOutcome(idx)}
                   className="icon-btn btn-danger"
                   title="Eliminar este resultado"
                 >
                   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                     <polyline points="3 6 5 6 21 6" />
                     <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                     <line x1="10" y1="11" x2="10" y2="17" />
                     <line x1="14" y1="11" x2="14" y2="17" />
                   </svg>
                 </button>
              </div>
            ))}
            
            {resultadosEsperados.length === 0 && (
              <div className="empty-state-text">
                No hay resultados definidos. Presione el botón de abajo para agregar uno.
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleAddOutcome}
            className="btn btn-secondary btn-sm mt-2"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Agregar Resultado Esperado
          </button>
        </div>
      </div>
    </div>
  );
};
