import { useProcessStore } from '../store/useProcessStore';

export const ActivityManager: React.FC = () => {
  const { 
    document: doc, 
    addActivity, 
    updateActivity, 
    removeActivity, 
    addTask, 
    updateTask, 
    removeTask 
  } = useProcessStore();
  const { actividades } = doc.process;

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
                                <input
                                  type="text"
                                  className={`form-input form-input-task ${task.entradas.length === 0 ? 'input-warning-soft' : ''}`}
                                  placeholder="Ej. Acta de Inicio, Requisitos iniciales (Separados por coma)"
                                  value={formatCommaSeparated(task.entradas)}
                                  onChange={(e) => updateTask(activity.id, task.id, { entradas: parseCommaSeparated(e.target.value) })}
                                />
                              </div>

                              {/* Productos de Trabajo */}
                              <div className="form-group mb-2">
                                <label className="form-label-task">Entregables (Productos de Trabajo)</label>
                                <input
                                  type="text"
                                  className={`form-input form-input-task ${task.productosTrabajo.length === 0 ? 'input-warning-soft' : ''}`}
                                  placeholder="Ej. Matriz de Requisitos, Minuta de Entrevistas (Separados por coma)"
                                  value={formatCommaSeparated(task.productosTrabajo)}
                                  onChange={(e) => updateTask(activity.id, task.id, { productosTrabajo: parseCommaSeparated(e.target.value) })}
                                />
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
