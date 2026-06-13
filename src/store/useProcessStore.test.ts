import { describe, it, expect, beforeEach } from 'vitest';
import { useProcessStore } from './useProcessStore';

describe('useProcessStore - Lógica de Negocio y Validación', () => {
  beforeEach(() => {
    // Restaurar el estado inicial antes de cada prueba
    useProcessStore.getState().resetStore();
  });

  it('debe inicializarse con un lienzo vacío y validaciones críticas de campos obligatorios', () => {
    const state = useProcessStore.getState();
    
    expect(state.document.process.nombre).toBe('');
    expect(state.document.process.proposito).toBe('');
    expect(state.document.process.resultadosEsperados).toEqual([]);
    expect(state.isExportable).toBe(false);
    
    // Debe contener 3 problemas críticos (nombre, propósito, resultados esperados)
    const criticalIssues = state.validationIssues.filter(i => i.type === 'CRITICAL');
    expect(criticalIssues.length).toBe(3);
  });

  it('debe validar dinámicamente y habilitar la exportación cuando se completan los metadatos obligatorios', () => {
    // 1. Agregar nombre
    useProcessStore.getState().updateMetadata({ nombre: 'Proceso de Prueba' });
    let state = useProcessStore.getState();
    expect(state.validationIssues.some(i => i.id === 'crit-name')).toBe(false);
    expect(state.isExportable).toBe(false);

    // 2. Agregar propósito
    useProcessStore.getState().updateMetadata({ proposito: 'Definir un proceso para pruebas' });
    state = useProcessStore.getState();
    expect(state.validationIssues.some(i => i.id === 'crit-purpose')).toBe(false);
    expect(state.isExportable).toBe(false);

    // 3. Agregar resultado esperado
    useProcessStore.getState().updateMetadata({ resultadosEsperados: ['Resultado 1'] });
    state = useProcessStore.getState();
    expect(state.validationIssues.some(i => i.id === 'crit-outcomes')).toBe(false);
    
    // Todos los metadatos obligatorios están completos -> Habilitar exportación
    expect(state.isExportable).toBe(true);
    expect(state.validationIssues.filter(i => i.type === 'CRITICAL').length).toBe(0);
  });

  it('debe permitir gestionar actividades mediante operaciones CRUD básicas', () => {
    // Agregar actividad
    useProcessStore.getState().addActivity();
    let state = useProcessStore.getState();
    expect(state.document.process.actividades.length).toBe(1);
    
    const activityId = state.document.process.actividades[0].id;
    expect(state.document.process.actividades[0].nombre).toBe('');

    // Actualizar actividad
    useProcessStore.getState().updateActivity(activityId, { 
      nombre: 'Elucidar requisitos', 
      descripcion: 'Recolección inicial' 
    });
    state = useProcessStore.getState();
    expect(state.document.process.actividades[0].nombre).toBe('Elucidar requisitos');
    expect(state.document.process.actividades[0].descripcion).toBe('Recolección inicial');

    // Eliminar actividad
    useProcessStore.getState().removeActivity(activityId);
    state = useProcessStore.getState();
    expect(state.document.process.actividades.length).toBe(0);
  });

  it('debe permitir asociar tareas a una actividad y gestionar sus atributos CRUD', () => {
    // Agregar actividad y tarea
    useProcessStore.getState().addActivity();
    let state = useProcessStore.getState();
    const activityId = state.document.process.actividades[0].id;

    useProcessStore.getState().addTask(activityId);
    state = useProcessStore.getState();
    expect(state.document.process.actividades[0].tareas.length).toBe(1);
    
    const taskId = state.document.process.actividades[0].tareas[0].id;
    expect(state.document.process.actividades[0].tareas[0].nombre).toBe('');

    // Actualizar tarea con entradas y productos de trabajo
    useProcessStore.getState().updateTask(activityId, taskId, {
      nombre: 'Entrevistar usuarios',
      entradas: ['Lista de usuarios'],
      productosTrabajo: ['Transcripción de entrevista']
    });
    state = useProcessStore.getState();
    const task = state.document.process.actividades[0].tareas[0];
    expect(task.nombre).toBe('Entrevistar usuarios');
    expect(task.entradas).toEqual(['Lista de usuarios']);
    expect(task.productosTrabajo).toEqual(['Transcripción de entrevista']);

    // Eliminar tarea
    useProcessStore.getState().removeTask(activityId, taskId);
    state = useProcessStore.getState();
    expect(state.document.process.actividades[0].tareas.length).toBe(0);
  });

  it('debe disparar advertencias (WARNING) cuando actividades o tareas están incompletas', () => {
    // Completar metadatos raíz para aislar las advertencias
    useProcessStore.getState().updateMetadata({
      nombre: 'Proceso de Prueba',
      proposito: 'Pruebas de advertencias',
      resultadosEsperados: ['Resultado exitoso']
    });

    // 1. Agregar actividad vacía (debe disparar advertencia por falta de tareas)
    useProcessStore.getState().addActivity();
    let state = useProcessStore.getState();
    const activityId = state.document.process.actividades[0].id;
    
    let activityWarnings = state.validationIssues.filter(i => i.id === `warn-activity-${activityId}`);
    expect(activityWarnings.length).toBe(1);
    // Pero la exportación no se bloquea por advertencias de calidad
    expect(state.isExportable).toBe(true);

    // 2. Agregar tarea vacía a la actividad (debe quitar advertencia de actividad pero agregar una en la tarea por falta de entradas/productos de trabajo)
    useProcessStore.getState().addTask(activityId);
    state = useProcessStore.getState();
    activityWarnings = state.validationIssues.filter(i => i.id === `warn-activity-${activityId}`);
    expect(activityWarnings.length).toBe(0); // Ya no está vacía la actividad

    const taskId = state.document.process.actividades[0].tareas[0].id;
    let taskWarnings = state.validationIssues.filter(i => i.id === `warn-task-${taskId}`);
    expect(taskWarnings.length).toBe(1);

    // 3. Completar entradas y productos de la tarea (debe limpiar todas las advertencias)
    useProcessStore.getState().updateTask(activityId, taskId, {
      nombre: 'Tarea completa',
      entradas: ['Insumo'],
      productosTrabajo: ['Entregable']
    });
    state = useProcessStore.getState();
    expect(state.validationIssues.length).toBe(0);
  });
});
