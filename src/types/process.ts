export interface ITask {
  id: string;
  nombre: string;
  entradas: string[];
  productosTrabajo: string[];
  stakeholders: string[];
  objetivos: string[];
  controles: string[];
  restricciones: string[];
}

export interface IActivity {
  id: string;
  nombre: string;
  descripcion: string;
  tareas: ITask[];
}

export interface IProcessData {
  id: string;
  nombre: string;
  proposito: string;
  resultadosEsperados: string[];
  actividades: IActivity[];
}

export interface IProcessFile {
  schemaVersion: string;
  timestamp: number;
  process: IProcessData;
}

export interface IValidationIssue {
  id: string;
  type: 'CRITICAL' | 'WARNING';
  message: string;
  elementId?: string; // ID of the activity or task causing the warning/critical issue
}
