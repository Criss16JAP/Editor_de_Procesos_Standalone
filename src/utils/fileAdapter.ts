import { IProcessFile } from '../types/process';

export const exportToProFile = (data: IProcessFile): void => {
  try {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // Normalizar el nombre del archivo
    const rawName = data.process.nombre.trim();
    const cleanName = rawName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const fileName = `${cleanName || 'proceso_sin_nombre'}.pro`;
    
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    
    // Limpieza
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error al exportar el archivo:', error);
    throw new Error('No se pudo exportar la descripción del proceso.');
  }
};

export const importFromProFile = (file: File): Promise<IProcessFile> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        if (!text) {
          throw new Error('El archivo está vacío.');
        }
        
        const parsed = JSON.parse(text) as IProcessFile;
        
        // Validar la estructura mínima requerida
        if (!parsed.schemaVersion) {
          throw new Error('El archivo no tiene una versión de esquema válida (schemaVersion).');
        }
        if (!parsed.process) {
          throw new Error('El archivo no contiene la sección principal "process".');
        }
        if (typeof parsed.process.id !== 'string') {
          throw new Error('El ID del proceso no es válido.');
        }
        if (typeof parsed.process.nombre !== 'string' || typeof parsed.process.proposito !== 'string') {
          throw new Error('El Nombre o el Propósito del proceso no tienen un formato válido.');
        }
        if (!Array.isArray(parsed.process.resultadosEsperados)) {
          throw new Error('La sección de Resultados Esperados debe ser un arreglo de textos.');
        }
        if (!Array.isArray(parsed.process.actividades)) {
          throw new Error('La sección de Actividades debe ser un arreglo.');
        }
        
        resolve(parsed);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Formato de archivo inválido.';
        reject(new Error(`Error de lectura: ${message}`));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Error al leer el archivo desde el disco.'));
    };
    
    reader.readAsText(file);
  });
};
