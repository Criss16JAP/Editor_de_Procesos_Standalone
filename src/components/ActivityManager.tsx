import { useProcessStore } from '../store/useProcessStore';

const DEFAULT_IO_OPTIONS = [
  'Documento de Requisitos (SRS)',
  'Especificación de Diseño',
  'Código Fuente / Repositorio',
  'Plan de Pruebas',
  'Casos de Prueba',
  'Manual de Usuario',
  'Plan de Proyecto',
  'Modelo Entidad-Relación',
  'Script de Base de Datos',
  'Acta de Aceptación',
  'Prototipo de Interfaz',
  'Guía Metodológica'
];

export const ActivityManager: React.FC = () => {
  const { 
    document: doc,
    addActivity,
    updateActivity,
    removeActivity,
    addTask,
    updateTask,
    removeTask,
    moveActivityUp,
    moveActivityDown,
    moveTaskUp,
    moveTaskDown,
    getAllInputs,
    getAllOutputs,
  } = useProcessStore();
  const { actividades } = doc.process;

  const getCombinedIOOptions = () => {
    const custom = new Set<string>();
    getAllInputs().forEach(x => custom.add(x));
    getAllOutputs().forEach(x => custom.add(x));
    const combined = new Set([...DEFAULT_IO_OPTIONS, ...Array.from(custom)]);
    return Array.from(combined).sort((a, b) => a.localeCompare(b));
  };

  const handleRemoveActivity = (id: string, name: string) => {
    if (window.confirm(`¿Está seguro de eliminar la actividad "${name || 'Sin nombre'}" y todas sus tareas?`)) {
      removeActivity(id);
    }
  };

  const handleRemoveTask = (activityId: string, taskId: string, taskName: string) => {
    if (window.confirm(`¿Está seguro de eliminar la tarea "${taskName || 'Sin nombre'}"?`)) {
      removeTask(activityId, taskId);
    }
  };

  // Helper para convertir string separado por comas a string[]
  const parseCommaSeparated = (val: string): string[] => {
    return val.split(',')
      .map(item => item.trim())
      .filter(item => item !== '');
  };

  // Helper para convertir string[] a string separado por comas
  const formatCommaSeparated = (arr: string[]): string => {
    return arr.join(', ');
  };

  return (
    <div className="activity-manager-container card">
      <div className="card-header flex justify-between align-center">
        <div>
          <h2 className="card-title">2. Actividades y Tareas del Proceso</h2>
          <p className="card-subtitle">Organice la estructura del proceso mediante actividades contenedoras y tareas de ejecución</p>
        </div>
        <button
          type="button"
          onClick={addActivity}
          className="btn btn-primary"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Nueva Actividad
        </button>
      </div>

      <div className="card-body">
        {actividades.length === 0 ? (
          <div className="empty-state">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="empty-icon">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
            <p className="empty-title">Sin actividades registradas</p>
            <p className="empty-desc">Las actividades agrupan conjuntos de tareas lógicas y secuenciales. Comience agregando una nueva actividad.</p>
          </div>
        ) : (
          <div className="activities-list">
            {actividades.map((activity, actIdx) => (
              <div key={activity.id} className="activity-card animate-fade-in">
                <div className="activity-card-header">
                  <div className="activity-card-title-group">
                    <span className="badge badge-activity">Actividad {actIdx + 1}</span>
                    <button type="button" onClick={() => moveActivityUp(actIdx)} className="icon-btn btn-secondary" title="Mover arriba">▲</button>
                    <button type="button" onClick={() => moveActivityDown(actIdx)} className="icon-btn btn-secondary" title="Mover abajo">▼</button>
                    <input
                      type="text"
                      className="activity-title-input"
                      placeholder="Nombre de la Actividad (Ej. Elucidación de Requisitos)"
                      value={activity.nombre}
                      onChange={(e) => updateActivity(activity.id, { nombre: e.target.value })}
                    />
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => handleRemoveActivity(activity.id, activity.nombre)}
                    className="icon-btn btn-danger-soft"
                    title="Eliminar esta actividad"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </button>
                </div>

                <div className="activity-card-body">
                  <div className="form-group">
                    <textarea
                      className="activity-desc-textarea"
                      placeholder="Descripción de la actividad..."
                      rows={2}
                      value={activity.descripcion}
                      onChange={(e) => updateActivity(activity.id, { descripcion: e.target.value })}
                    />
                  </div>

                  {/* Tareas */}
                  <div className="tasks-section">
                    <div className="tasks-section-header">
                      <h4 className="tasks-title">Tareas de la Actividad</h4>
                      <button
                        type="button"
                        onClick={() => addTask(activity.id)}
                        className="btn btn-secondary btn-xs"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                          <line x1="12" y1="5" x2="12" y2="19" />
                          <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        Agregar Tarea
                      </button>
                    </div>

                    <div className="tasks-list">
                      {activity.tareas.length === 0 ? (
                        <div className="empty-tasks-text">
                          No hay tareas definidas en esta actividad. Incorpore al menos una tarea.
                        </div>
                      ) : (
                        activity.tareas.map((task, tIdx) => (
                          <div key={task.id} className="task-card">
                            <div className="task-card-header">
                              <div className="task-card-title-group">
                                <span className="badge badge-task">Tarea {tIdx + 1}</span>
                                <input
                                  type="text"
                                  className="task-title-input"
                                  placeholder="Nombre de la Tarea (Ej. Entrevistar Stakeholders)"
                                  value={task.nombre}
                                  onChange={(e) => updateTask(activity.id, task.id, { nombre: e.target.value })}
                                />
                                <button type="button" onClick={() => moveTaskUp(activity.id, tIdx)} className="icon-btn btn-secondary" title="Mover arriba">▲</button>
                                <button type="button" onClick={() => moveTaskDown(activity.id, tIdx)} className="icon-btn btn-secondary" title="Mover abajo">▼</button>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleRemoveTask(activity.id, task.id, task.nombre)}
                                className="icon-btn btn-danger-soft-xs"
                                title="Eliminar tarea"
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="3 6 5 6 21 6" />
                                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                </svg>
                              </button>
                            </div>

                            <div className="task-card-body grid grid-cols-2 gap-3">
                              {/* Entradas */}
                              <div className="form-group mb-2">
                                <label className="form-label-task">Insumos (Entradas)</label>
                                <div className="selected-tags flex flex-wrap gap-1 mb-2">
                                  {task.entradas.length === 0 ? (
                                    <span className="text-muted text-xs">Sin insumos seleccionados</span>
                                  ) : (
                                    task.entradas.map((inp) => (
                                      <span key={inp} className="badge-tag flex align-center gap-1">
                                        {inp}
                                        <button
                                          type="button"
                                          className="tag-remove-btn"
                                          onClick={() => {
                                            const updated = task.entradas.filter(item => item !== inp);
                                            updateTask(activity.id, task.id, { entradas: updated });
                                          }}
                                        >
                                          ×
                                        </button>
                                      </span>
                                    ))
                                  )}
                                </div>
                                <div className="flex gap-1">
                                  <select
                                    className="form-select form-input-task"
                                    value=""
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      if (val && !task.entradas.includes(val)) {
                                        const updated = [...task.entradas, val];
                                        updateTask(activity.id, task.id, { entradas: updated });
                                      }
                                    }}
                                  >
                                    <option value="" disabled>-- Seleccionar Insumo --</option>
                                    {getCombinedIOOptions().map((opt, i) => (
                                      <option key={i} value={opt}>{opt}</option>
                                    ))}
                                  </select>
                                  <button
                                    type="button"
                                    className="btn btn-xs btn-secondary"
                                    onClick={() => {
                                      const newVal = window.prompt('Nuevo valor de entrada/insumo');
                                      if (newVal && newVal.trim() !== '') {
                                        const trimmed = newVal.trim();
                                        if (!task.entradas.includes(trimmed)) {
                                          const updated = [...task.entradas, trimmed];
                                          updateTask(activity.id, task.id, { entradas: updated });
                                        }
                                      }
                                    }}
                                  >
                                    +
                                  </button>
                                </div>
                              </div>

                              {/* Productos de Trabajo */}
                              <div className="form-group mb-2">
                                <label className="form-label-task">Entregables (Productos de Trabajo)</label>
                                <div className="selected-tags flex flex-wrap gap-1 mb-2">
                                  {task.productosTrabajo.length === 0 ? (
                                    <span className="text-muted text-xs">Sin entregables seleccionados</span>
                                  ) : (
                                    task.productosTrabajo.map((out) => (
                                      <span key={out} className="badge-tag flex align-center gap-1">
                                        {out}
                                        <button
                                          type="button"
                                          className="tag-remove-btn"
                                          onClick={() => {
                                            const updated = task.productosTrabajo.filter(item => item !== out);
                                            updateTask(activity.id, task.id, { productosTrabajo: updated });
                                          }}
                                        >
                                          ×
                                        </button>
                                      </span>
                                    ))
                                  )}
                                </div>
                                <div className="flex gap-1">
                                  <select
                                    className="form-select form-input-task"
                                    value=""
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      if (val && !task.productosTrabajo.includes(val)) {
                                        const updated = [...task.productosTrabajo, val];
                                        updateTask(activity.id, task.id, { productosTrabajo: updated });
                                      }
                                    }}
                                  >
                                    <option value="" disabled>-- Seleccionar Entregable --</option>
                                    {getCombinedIOOptions().map((opt, i) => (
                                      <option key={i} value={opt}>{opt}</option>
                                    ))}
                                  </select>
                                  <button
                                    type="button"
                                    className="btn btn-xs btn-secondary"
                                    onClick={() => {
                                      const newVal = window.prompt('Nuevo valor de entregable/salida');
                                      if (newVal && newVal.trim() !== '') {
                                        const trimmed = newVal.trim();
                                        if (!task.productosTrabajo.includes(trimmed)) {
                                          const updated = [...task.productosTrabajo, trimmed];
                                          updateTask(activity.id, task.id, { productosTrabajo: updated });
                                        }
                                      }
                                    }}
                                  >
                                    +
                                  </button>
                                </div>
                              </div>

                              {/* Roles Involucrados */}
                              <div className="form-group mb-2">
                                <label className="form-label-task">Roles (Stakeholders)</label>
                                <input
                                  type="text"
                                  className="form-input form-input-task"
                                  placeholder="Ej. Analista, Cliente (Separados por coma)"
                                  value={formatCommaSeparated(task.stakeholders)}
                                  onChange={(e) => updateTask(activity.id, task.id, { stakeholders: parseCommaSeparated(e.target.value) })}
                                />
                              </div>

                              {/* Objetivos */}
                              <div className="form-group mb-2">
                                <label className="form-label-task">Objetivos de la Tarea</label>
                                <input
                                  type="text"
                                  className="form-input form-input-task"
                                  placeholder="Ej. Consolidar expectativas del negocio (Separados por coma)"
                                  value={formatCommaSeparated(task.objetivos)}
                                  onChange={(e) => updateTask(activity.id, task.id, { objetivos: parseCommaSeparated(e.target.value) })}
                                />
                              </div>

                              {/* Controles */}
                              <div className="form-group mb-2">
                                <label className="form-label-task">Controles o Directrices</label>
                                <input
                                  type="text"
                                  className="form-input form-input-task"
                                  placeholder="Ej. Guía metodológica, Plantilla de Elucidación (Separados por coma)"
                                  value={formatCommaSeparated(task.controles)}
                                  onChange={(e) => updateTask(activity.id, task.id, { controles: parseCommaSeparated(e.target.value) })}
                                />
                              </div>

                              {/* Restricciones */}
                              <div className="form-group mb-2">
                                <label className="form-label-task">Restricciones</label>
                                <input
                                  type="text"
                                  className="form-input form-input-task"
                                  placeholder="Ej. Disponibilidad del cliente, Plazo de 3 días (Separados por coma)"
                                  value={formatCommaSeparated(task.restricciones)}
                                  onChange={(e) => updateTask(activity.id, task.id, { restricciones: parseCommaSeparated(e.target.value) })}
                                />
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
