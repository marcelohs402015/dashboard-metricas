import { ChartDataPoint, FileProcessingResult, CodeMetricsProcessingResult, CodeMetricsData } from '../types';
import { CodeMetricsTransformer } from './codeMetricsTransformer';

export class FileProcessor {
  /**
   * Processa um arquivo de texto e converte em dados JSON
   */
  static async processTextFile(file: File): Promise<FileProcessingResult> {
    try {
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      
      // Tenta diferentes formatos de dados
      const result = this.parseDataLines(lines);
      
      if (result.success && result.data) {
        return {
          success: true,
          data: result.data
        };
      }
      
      return {
        success: false,
        error: 'Formato de arquivo não reconhecido. Use o formato: dia,valor (ex: Monday,15000)'
      };
      
    } catch (error) {
      return {
        success: false,
        error: `Erro ao processar arquivo: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      };
    }
  }

  /**
   * Processa arquivo de métricas de código fonte
   */
  static async processCodeMetricsFile(file: File): Promise<CodeMetricsProcessingResult> {
    try {
      const text = await file.text();
      
      // Verifica se é um arquivo de métricas de código
      if (this.isCodeMetricsFile(text)) {
        return CodeMetricsTransformer.transformContent(text);
      }
      
      return {
        success: false,
        error: 'Arquivo não parece ser um arquivo de métricas de código válido'
      };
      
    } catch (error) {
      return {
        success: false,
        error: `Erro ao processar arquivo: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      };
    }
  }

  /**
   * Verifica se o arquivo é um arquivo de métricas de código
   */
  private static isCodeMetricsFile(content: string): boolean {
    const lines = content.split('\n');
    console.log('Verificando arquivo com', lines.length, 'linhas');
    
    // Verifica se contém o cabeçalho típico de métricas de código
    const hasHeader = lines.some(line => 
      line.includes('Language') && 
      line.includes('Files') && 
      line.includes('Lines') && 
      line.includes('Blanks') && 
      line.includes('Comments') && 
      line.includes('Code') && 
      line.includes('Complexity')
    );
    
    console.log('Tem cabeçalho:', hasHeader);
    
    // Verifica se contém dados de linguagens (formato mais flexível)
    const hasLanguageData = lines.some(line => {
      const trimmed = line.trim();
      // Padrão mais flexível para detectar linhas de linguagem
      return /^[A-Za-z#+]+[\s\t]+[0-9]+[\s\t]+[0-9]+[\s\t]+[0-9]+[\s\t]+[0-9]+[\s\t]+[0-9]+[\s\t]+[0-9]+$/.test(trimmed);
    });
    
    console.log('Tem dados de linguagem:', hasLanguageData);
    
    // Verifica se contém dados de arquivos individuais
    const hasFileData = lines.some(line => 
      line.includes('~') && 
      (line.includes('.cs') || line.includes('.js') || line.includes('.ts') || line.includes('.py'))
    );
    
    console.log('Tem dados de arquivos:', hasFileData);
    
    // Se tem cabeçalho OU dados de linguagem OU dados de arquivos, considera válido
    const isValid = hasHeader || hasLanguageData || hasFileData;
    console.log('Arquivo é válido:', isValid);
    
    return isValid;
  }

  /**
   * Tenta diferentes formatos de parsing
   */
  private static parseDataLines(lines: string[]): FileProcessingResult {
    // Formato 1: "dia,valor" (ex: Monday,15000)
    const csvFormat = this.parseCSVFormat(lines);
    if (csvFormat.success) return csvFormat;

    // Formato 2: "dia: valor" (ex: Monday: 15000)
    const colonFormat = this.parseColonFormat(lines);
    if (colonFormat.success) return colonFormat;

    // Formato 3: "dia valor" (ex: Monday 15000)
    const spaceFormat = this.parseSpaceFormat(lines);
    if (spaceFormat.success) return spaceFormat;

    // Formato 4: JSON array
    const jsonFormat = this.parseJSONFormat(lines);
    if (jsonFormat.success) return jsonFormat;

    return {
      success: false,
      error: 'Formato não suportado'
    };
  }

  /**
   * Parse formato CSV: dia,valor
   */
  private static parseCSVFormat(lines: string[]): FileProcessingResult {
    const data: ChartDataPoint[] = [];
    
    for (const line of lines) {
      const parts = line.split(',').map(part => part.trim());
      if (parts.length === 2) {
        const day = parts[0];
        const value = parseFloat(parts[1]);
        
        if (!isNaN(value) && day) {
          data.push({ day, value });
        }
      }
    }
    
    return data.length > 0 
      ? { success: true, data }
      : { success: false, error: 'Formato CSV inválido' };
  }

  /**
   * Parse formato com dois pontos: dia: valor
   */
  private static parseColonFormat(lines: string[]): FileProcessingResult {
    const data: ChartDataPoint[] = [];
    
    for (const line of lines) {
      const colonIndex = line.indexOf(':');
      if (colonIndex > 0) {
        const day = line.substring(0, colonIndex).trim();
        const value = parseFloat(line.substring(colonIndex + 1).trim());
        
        if (!isNaN(value) && day) {
          data.push({ day, value });
        }
      }
    }
    
    return data.length > 0 
      ? { success: true, data }
      : { success: false, error: 'Formato com dois pontos inválido' };
  }

  /**
   * Parse formato com espaço: dia valor
   */
  private static parseSpaceFormat(lines: string[]): FileProcessingResult {
    const data: ChartDataPoint[] = [];
    
    for (const line of lines) {
      const parts = line.split(/\s+/).filter(part => part.trim());
      if (parts.length === 2) {
        const day = parts[0];
        const value = parseFloat(parts[1]);
        
        if (!isNaN(value) && day) {
          data.push({ day, value });
        }
      }
    }
    
    return data.length > 0 
      ? { success: true, data }
      : { success: false, error: 'Formato com espaço inválido' };
  }

  /**
   * Parse formato JSON
   */
  private static parseJSONFormat(lines: string[]): FileProcessingResult {
    try {
      const jsonText = lines.join('\n');
      const parsed = JSON.parse(jsonText);
      
      if (Array.isArray(parsed)) {
        const data: ChartDataPoint[] = [];
        
        for (const item of parsed) {
          if (item.day && typeof item.value === 'number') {
            data.push({ day: item.day, value: item.value });
          }
        }
        
        return data.length > 0 
          ? { success: true, data }
          : { success: false, error: 'Array JSON inválido' };
      }
      
      return { success: false, error: 'Formato JSON inválido' };
      
    } catch (error) {
      return { success: false, error: 'Erro ao parsear JSON' };
    }
  }

  /**
   * Gera dados de exemplo para demonstração
   */
  static generateSampleData(): ChartDataPoint[] {
    return [
      { day: 'Sunday', value: 15500 },
      { day: 'Monday', value: 21500 },
      { day: 'Tuesday', value: 18500 },
      { day: 'Wednesday', value: 24000 },
      { day: 'Thursday', value: 23500 },
      { day: 'Friday', value: 24000 },
      { day: 'Saturday', value: 13000 }
    ];
  }

  /**
   * Valida se os dados são válidos
   */
  static validateData(data: ChartDataPoint[]): boolean {
    if (!Array.isArray(data) || data.length === 0) {
      return false;
    }
    
    return data.every(item => 
      typeof item.day === 'string' && 
      item.day.trim() !== '' && 
      typeof item.value === 'number' && 
      !isNaN(item.value)
    );
  }
}
