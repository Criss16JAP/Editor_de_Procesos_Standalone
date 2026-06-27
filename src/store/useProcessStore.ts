import { create } from 'zustand';
import { IProcessFile, IProcessData, IActivity, ITask, IValidationIssue } from '../types/process';

const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export const createEmptyProcess = (): IProcessFile => ({
  schemaVersion: '1.0.0',
  timestamp: Date.now(),
  process: {
    id: generateId(),
    nombre: '',
    proposito: '',
    resultadosEsperados: [],
    actividades: []
  }
});

export const validateProcess = (doc: IProcessFile): IValidationIssue[] => {
  const issues: IValidationIssue[] = [];
  const { nombre, proposito, resultadosEsperados, actividades } = doc.process;

  // 1. Validaciones Críticas (Bloqueo Total)
  if (!nombre || nombre.trim() === '') {
    issues.push({
      id: 'crit-name',
      type: 'CRITICAL',
      message: 'Falta información obligatoria: El estándar ISO 24774 exige que todo proceso declare formalmente su Nombre.'
    });
  }

  if (!proposito || proposito.trim() === '') {
    issues.push({
      id: 'crit-purpose',
      type: 'CRITICAL',
      message: 'Falta información obligatoria: El estándar ISO 24774 exige que todo proceso declare formalmente su Propósito.'
    });
  }

  const validOutcomes = resultadosEsperados.filter(outcome => outcome && outcome.trim() !== '');
  if (validOutcomes.length === 0) {
    issues.push({
      id: 'crit-outcomes',
      type: 'CRITICAL',
      message: 'Falta información obligatoria: El estándar ISO 24774 exige que todo proceso declare formalmente al menos un Resultado Esperado antes de ser persistido.'
    });
  }

  // 2. Advertencias Estructurales (Advertencia Visual)
  actividades.forEach((activity) => {
    if (activity.tareas.length === 0) {
      issues.push({
        id: `warn-activity-${activity.id}`,
        type: 'WARNING',
        message: `La actividad '${activity.nombre || 'Sin nombre'}' se encuentra vacía. Para garantizar un modelado consistente, incorpore las tareas requeridas para su ejecución.`,
        elementId: activity.id
      });
    }

    activity.tareas.forEach((task) => {
      const hasInputs = task.entradas.filter(i => i && i.trim() !== '').length > 0;
      const hasOutputs = task.productosTrabajo.filter(o => o && o.trim() !== '').length > 0;

      if (!hasInputs || !hasOutputs) {
        issues.push({
          id: `warn-task-${task.id}`,
          type: 'WARNING',
          message: `La tarea '${task.nombre || 'Sin nombre'}' requiere especificar al menos un insumo (Entrada) y un entregable (Producto de Trabajo) para mantener la coherencia operacional.`,
          elementId: task.id
        });
      }
    });
  });

  return issues;
};

export interface IProcessState {
  document: IProcessFile;
  validationIssues: IValidationIssue[];
  pdfOrientation: 'PORTRAIT' | 'LANDSCAPE';
  isDirty: boolean;
  isExportable: boolean;

  resetStore: () => void;
  loadProcess: (doc: IProcessFile) => void;
  updateMetadata: (fields: Partial<Pick<IProcessData, 'nombre' | 'proposito' | 'resultadosEsperados'>>) => void;
  
  // Actividades
  addActivity: () => void;
  updateActivity: (activityId: string, data: Partial<Omit<IActivity, 'id' | 'tareas'>>) => void;
  removeActivity: (activityId: string) => void;
  reorderActivities: (activeId: string, overId: string) => void;

  // Tareas
  addTask: (activityId: string) => void;
  updateTask: (activityId: string, taskId: string, data: Partial<Omit<ITask, 'id'>>) => void;
  removeTask: (activityId: string, taskId: string) => void;
  reorderTasks: (activityId: string, activeId: string, overId: string) => void;

  setPdfOrientation: (orientation: 'PORTRAIT' | 'LANDSCAPE') => void;
  runValidation: () => void;
  // Reordering methods
  moveOutcomeUp: (index: number) => void;
  moveOutcomeDown: (index: number) => void;
  moveActivityUp: (index: number) => void;
  moveActivityDown: (index: number) => void;
  moveTaskUp: (activityId: string, taskIndex: number) => void;
  moveTaskDown: (activityId: string, taskIndex: number) => void;
  // IO collection
  getAllInputs: () => string[];
  getAllOutputs: () => string[];
}

export const useProcessStore = create<IProcessState>((set, get) => {
  const initialDoc = createEmptyProcess();
  const initialIssues = validateProcess(initialDoc);

  const syncValidation = (doc: IProcessFile) => {
    const issues = validateProcess(doc);
    const hasCritical = issues.some(issue => issue.type === 'CRITICAL');
    return {
      validationIssues: issues,
      isExportable: !hasCritical
    };
  };

  return {
    document: initialDoc,
    validationIssues: initialIssues,
    pdfOrientation: 'PORTRAIT',
    isDirty: false,
    isExportable: false,

    resetStore: () => {
      const doc = createEmptyProcess();
      const val = syncValidation(doc);
      set({
        document: doc,
        validationIssues: val.validationIssues,
        isExportable: val.isExportable,
        isDirty: false
      });
    },

    loadProcess: (doc: IProcessFile) => {
      const val = syncValidation(doc);
      set({
        document: doc,
        validationIssues: val.validationIssues,
        isExportable: val.isExportable,
        isDirty: false
      });
    },

    updateMetadata: (fields) => {
      const currentDoc = get().document;
      const updatedDoc: IProcessFile = {
        ...currentDoc,
        timestamp: Date.now(),
        process: {
          ...currentDoc.process,
          ...fields
        }
      };
      const val = syncValidation(updatedDoc);
      set({
        document: updatedDoc,
        validationIssues: val.validationIssues,
        isExportable: val.isExportable,
        isDirty: true
      });
    },

    addActivity: () => {
      const currentDoc = get().document;
      const newActivity: IActivity = {
        id: generateId(),
        nombre: '',
        descripcion: '',
        tareas: []
      };
      const updatedDoc: IProcessFile = {
        ...currentDoc,
        timestamp: Date.now(),
        process: {
          ...currentDoc.process,
          actividades: [...currentDoc.process.actividades, newActivity]
        }
      };
      const val = syncValidation(updatedDoc);
      set({
        document: updatedDoc,
        validationIssues: val.validationIssues,
        isExportable: val.isExportable,
        isDirty: true
      });
    },

    updateActivity: (activityId, data) => {
      const currentDoc = get().document;
      const updatedActividades = currentDoc.process.actividades.map(act => {
        if (act.id === activityId) {
          return { ...act, ...data };
        }
        return act;
      });
      const updatedDoc: IProcessFile = {
        ...currentDoc,
        timestamp: Date.now(),
        process: {
          ...currentDoc.process,
          actividades: updatedActividades
        }
      };
      const val = syncValidation(updatedDoc);
      set({
        document: updatedDoc,
        validationIssues: val.validationIssues,
        isExportable: val.isExportable,
        isDirty: true
      });
    },

    removeActivity: (activityId) => {
      const currentDoc = get().document;
      const updatedActividades = currentDoc.process.actividades.filter(act => act.id !== activityId);
      const updatedDoc: IProcessFile = {
        ...currentDoc,
        timestamp: Date.now(),
        process: {
          ...currentDoc.process,
          actividades: updatedActividades
        }
      };
      const val = syncValidation(updatedDoc);
      set({
        document: updatedDoc,
        validationIssues: val.validationIssues,
        isExportable: val.isExportable,
        isDirty: true
      });
    },

    reorderActivities: (activeId, overId) => {
      const currentDoc = get().document;
      const actividades = [...currentDoc.process.actividades];
      const activeIdx = actividades.findIndex(a => a.id === activeId);
      const overIdx = actividades.findIndex(a => a.id === overId);
      
      if (activeIdx !== -1 && overIdx !== -1) {
        const [moved] = actividades.splice(activeIdx, 1);
        actividades.splice(overIdx, 0, moved);
        
        const updatedDoc: IProcessFile = {
          ...currentDoc,
          timestamp: Date.now(),
          process: {
            ...currentDoc.process,
            actividades
          }
        };
        const val = syncValidation(updatedDoc);
        set({
          document: updatedDoc,
          validationIssues: val.validationIssues,
          isExportable: val.isExportable,
          isDirty: true
        });
      }
    },

    addTask: (activityId) => {
      const currentDoc = get().document;
      const newTask: ITask = {
        id: generateId(),
        nombre: '',
        entradas: [],
        productosTrabajo: [],
        stakeholders: [],
        objetivos: [],
        controles: [],
        restricciones: []
      };
      const updatedActividades = currentDoc.process.actividades.map(act => {
        if (act.id === activityId) {
          return {
            ...act,
            tareas: [...act.tareas, newTask]
          };
        }
        return act;
      });
      const updatedDoc: IProcessFile = {
        ...currentDoc,
        timestamp: Date.now(),
        process: {
          ...currentDoc.process,
          actividades: updatedActividades
        }
      };
      const val = syncValidation(updatedDoc);
      set({
        document: updatedDoc,
        validationIssues: val.validationIssues,
        isExportable: val.isExportable,
        isDirty: true
      });
    },

    updateTask: (activityId, taskId, data) => {
      const currentDoc = get().document;
      const updatedActividades = currentDoc.process.actividades.map(act => {
        if (act.id === activityId) {
          const updatedTareas = act.tareas.map(task => {
            if (task.id === taskId) {
              return { ...task, ...data };
            }
            return task;
          });
          return { ...act, tareas: updatedTareas };
        }
        return act;
      });
      const updatedDoc: IProcessFile = {
        ...currentDoc,
        timestamp: Date.now(),
        process: {
          ...currentDoc.process,
          actividades: updatedActividades
        }
      };
      const val = syncValidation(updatedDoc);
      set({
        document: updatedDoc,
        validationIssues: val.validationIssues,
        isExportable: val.isExportable,
        isDirty: true
      });
    },

    removeTask: (activityId, taskId) => {
      const currentDoc = get().document;
      const updatedActividades = currentDoc.process.actividades.map(act => {
        if (act.id === activityId) {
          return {
            ...act,
            tareas: act.tareas.filter(task => task.id !== taskId)
          };
        }
        return act;
      });
      const updatedDoc: IProcessFile = {
        ...currentDoc,
        timestamp: Date.now(),
        process: {
          ...currentDoc.process,
          actividades: updatedActividades
        }
      };
      const val = syncValidation(updatedDoc);
      set({
        document: updatedDoc,
        validationIssues: val.validationIssues,
        isExportable: val.isExportable,
        isDirty: true
      });
    },

    reorderTasks: (activityId, activeId, overId) => {
      const currentDoc = get().document;
      const updatedActividades = currentDoc.process.actividades.map(act => {
        if (act.id === activityId) {
          const tareas = [...act.tareas];
          const activeIdx = tareas.findIndex(t => t.id === activeId);
          const overIdx = tareas.findIndex(t => t.id === overId);
          
          if (activeIdx !== -1 && overIdx !== -1) {
            const [moved] = tareas.splice(activeIdx, 1);
            tareas.splice(overIdx, 0, moved);
            return { ...act, tareas };
          }
        }
        return act;
      });
      const updatedDoc: IProcessFile = {
        ...currentDoc,
        timestamp: Date.now(),
        process: {
          ...currentDoc.process,
          actividades: updatedActividades
        }
      };
      const val = syncValidation(updatedDoc);
      set({
        document: updatedDoc,
        validationIssues: val.validationIssues,
        isExportable: val.isExportable,
        isDirty: true
      });
    },

    setPdfOrientation: (orientation) => {
      set({ pdfOrientation: orientation });
    },

    // Reorder Outcomes (Resultados Esperados)
    moveOutcomeUp: (index) => {
      const doc = get().document;
      const outcomes = [...doc.process.resultadosEsperados];
      if (index > 0 && index < outcomes.length) {
        const [moved] = outcomes.splice(index, 1);
        outcomes.splice(index - 1, 0, moved);
        const updatedDoc = { ...doc, timestamp: Date.now(), process: { ...doc.process, resultadosEsperados: outcomes } };
        const val = syncValidation(updatedDoc);
        set({ document: updatedDoc, validationIssues: val.validationIssues, isExportable: val.isExportable, isDirty: true });
      }
    },
    moveOutcomeDown: (index) => {
      const doc = get().document;
      const outcomes = [...doc.process.resultadosEsperados];
      if (index >= 0 && index < outcomes.length - 1) {
        const [moved] = outcomes.splice(index, 1);
        outcomes.splice(index + 1, 0, moved);
        const updatedDoc = { ...doc, timestamp: Date.now(), process: { ...doc.process, resultadosEsperados: outcomes } };
        const val = syncValidation(updatedDoc);
        set({ document: updatedDoc, validationIssues: val.validationIssues, isExportable: val.isExportable, isDirty: true });
      }
    },

    // Reorder Activities
    moveActivityUp: (index) => {
      const doc = get().document;
      const actividades = [...doc.process.actividades];
      if (index > 0 && index < actividades.length) {
        const [moved] = actividades.splice(index, 1);
        actividades.splice(index - 1, 0, moved);
        const updatedDoc = { ...doc, timestamp: Date.now(), process: { ...doc.process, actividades } };
        const val = syncValidation(updatedDoc);
        set({ document: updatedDoc, validationIssues: val.validationIssues, isExportable: val.isExportable, isDirty: true });
      }
    },
    moveActivityDown: (index) => {
      const doc = get().document;
      const actividades = [...doc.process.actividades];
      if (index >= 0 && index < actividades.length - 1) {
        const [moved] = actividades.splice(index, 1);
        actividades.splice(index + 1, 0, moved);
        const updatedDoc = { ...doc, timestamp: Date.now(), process: { ...doc.process, actividades } };
        const val = syncValidation(updatedDoc);
        set({ document: updatedDoc, validationIssues: val.validationIssues, isExportable: val.isExportable, isDirty: true });
      }
    },

    // Reorder Tasks within an Activity
    moveTaskUp: (activityId, taskIndex) => {
      const doc = get().document;
      const updatedActividades = doc.process.actividades.map(act => {
        if (act.id === activityId) {
          const tareas = [...act.tareas];
          if (taskIndex > 0 && taskIndex < tareas.length) {
            const [moved] = tareas.splice(taskIndex, 1);
            tareas.splice(taskIndex - 1, 0, moved);
          }
          return { ...act, tareas };
        }
        return act;
      });
      const updatedDoc = { ...doc, timestamp: Date.now(), process: { ...doc.process, actividades: updatedActividades } };
      const val = syncValidation(updatedDoc);
      set({ document: updatedDoc, validationIssues: val.validationIssues, isExportable: val.isExportable, isDirty: true });
    },
    moveTaskDown: (activityId, taskIndex) => {
      const doc = get().document;
      const updatedActividades = doc.process.actividades.map(act => {
        if (act.id === activityId) {
          const tareas = [...act.tareas];
          if (taskIndex >= 0 && taskIndex < tareas.length - 1) {
            const [moved] = tareas.splice(taskIndex, 1);
            tareas.splice(taskIndex + 1, 0, moved);
          }
          return { ...act, tareas };
        }
        return act;
      });
      const updatedDoc = { ...doc, timestamp: Date.now(), process: { ...doc.process, actividades: updatedActividades } };
      const val = syncValidation(updatedDoc);
      set({ document: updatedDoc, validationIssues: val.validationIssues, isExportable: val.isExportable, isDirty: true });
    },

    // Get all unique inputs across tasks
    getAllInputs: () => {
      const doc = get().document;
      const inputsSet = new Set<string>();
      doc.process.actividades.forEach(act => {
        act.tareas.forEach(task => {
          task.entradas.forEach(inp => {
            if (inp && inp.trim() !== '') inputsSet.add(inp.trim());
          });
        });
      });
      return Array.from(inputsSet);
    },
    // Get all unique outputs across tasks
    getAllOutputs: () => {
      const doc = get().document;
      const outputsSet = new Set<string>();
      doc.process.actividades.forEach(act => {
        act.tareas.forEach(task => {
          task.productosTrabajo.forEach(out => {
            if (out && out.trim() !== '') outputsSet.add(out.trim());
          });
        });
      });
      return Array.from(outputsSet);
    },

    runValidation: () => {
      const currentDoc = get().document;
      const val = syncValidation(currentDoc);
      set({
        validationIssues: val.validationIssues,
        isExportable: val.isExportable
      });
    }
  };
});
