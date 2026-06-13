import React, { useRef } from 'react';
import { useProcessStore } from '../store/useProcessStore';
import { exportToProFile, importFromProFile } from '../utils/fileAdapter';

export const MainToolbar: React.FC = () => {
  const { document: doc, isExportable, resetStore, loadProcess } = useProcessStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleNew = () => {
    if (window.confirm('¿Está seguro de que desea iniciar un nuevo proceso? Se perderán los cambios no guardados.')) {
      resetStore();
    }
  };

  const handleSave = () => {
    if (isExportable) {
      exportToProFile(doc);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    try {
      const loadedData = await importFromProFile(file);
      loadProcess(loadedData);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Error al cargar el archivo.');
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = ''; // Reset input
      }
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="main-toolbar">
      <div className="toolbar-logo">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="logo-icon">
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
          <polyline points="14 2 14 8 20 8" />
          <path d="M16 13H8" />
          <path d="M16 17H8" />
          <path d="M10 9H8" />
        </svg>
        <span className="logo-text">Editor de Procesos <span className="logo-badge">ISO 24774</span></span>
      </div>
      
      <div className="toolbar-actions">
        <button 
          onClick={handleNew} 
          className="toolbar-btn btn-secondary"
          title="Crear un nuevo lienzo de modelado vacío"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Nuevo
        </button>

        <button 
          onClick={triggerFileSelect} 
          className="toolbar-btn btn-secondary"
          title="Cargar una descripción de proceso guardada (.pro)"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          Cargar .pro
        </button>
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept=".pro" 
          style={{ display: 'none' }} 
        />

        <button 
          onClick={handleSave} 
          className={`toolbar-btn btn-primary ${!isExportable ? 'btn-disabled' : ''}`}
          disabled={!isExportable}
          title={isExportable ? 'Exportar proceso a un archivo local .pro' : 'No se puede exportar: faltan campos obligatorios'}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
            <polyline points="17 21 17 13 7 13 7 21" />
            <polyline points="7 3 7 8 15 8" />
          </svg>
          Guardar .pro
        </button>
      </div>
    </div>
  );
};
