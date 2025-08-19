import { DevelopmentMetrics, DataTableRow, EstimatedMetrics, ProcessingInfo } from '../types';

export class DevelopmentMetricsParser {
  /**
   * Processa o conteúdo do arquivo de métricas de desenvolvimento
   * @param content - Conteúdo do arquivo de texto
   * @returns Objeto com as métricas estruturadas
   */
  static parseContent(content: string): { success: boolean; data?: DevelopmentMetrics; error?: string } {
    try {
      const lines = content.split('\n').filter(line => line.trim());
      
      const dataTable = this.parseDataTable(lines);
      const estimatedMetrics = this.parseEstimatedMetrics(lines);
      const processingInfo = this.parseProcessingInfo(lines);

      if (!dataTable || !estimatedMetrics || !processingInfo) {
        return {
          success: false,
          error: 'Não foi possível extrair todas as seções necessárias do arquivo'
        };
      }

      const developmentMetrics: DevelopmentMetrics = {
        dataTable,
        estimatedMetrics,
        processingInfo
      };

      return {
        success: true,
        data: developmentMetrics
      };

    } catch (error) {
      return {
        success: false,
        error: `Erro ao processar métricas de desenvolvimento: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      };
    }
  }

  /**
   * Extrai a tabela de dados do conteúdo
   */
  private static parseDataTable(lines: string[]): DataTableRow[] | null {
    const dataTable: DataTableRow[] = [];
    let inDataTableSection = false;

    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // Identifica o início da seção de dados
      if (trimmedLine.includes('Plain Text') || trimmedLine.includes('batch.txt')) {
        inDataTableSection = true;
      }

      if (inDataTableSection) {
        const row = this.parseDataTableRow(trimmedLine);
        if (row) {
          dataTable.push(row);
        }

        // Para quando encontrar a linha "Total"
        if (trimmedLine.startsWith('Total')) {
          break;
        }
      }
    }

    return dataTable.length > 0 ? dataTable : null;
  }

  /**
   * Parse uma linha da tabela de dados
   */
  private static parseDataTableRow(line: string): DataTableRow | null {
    const parts = line.trim().split(/\s+/);
    
    if (parts.length < 2) return null;

    const label = parts[0];
    const values = parts.slice(1).map(val => {
      const num = parseFloat(val);
      return isNaN(num) ? 0 : num;
    });

    return {
      label,
      values
    };
  }

  /**
   * Extrai as métricas estimadas de desenvolvimento
   */
  private static parseEstimatedMetrics(lines: string[]): EstimatedMetrics | null {
    const metrics: Partial<EstimatedMetrics> = {};

    for (const line of lines) {
      const trimmedLine = line.trim();
      
      if (trimmedLine.includes('Estimated Cost to Develop')) {
        const match = trimmedLine.match(/\$([\d,]+)/);
        if (match) {
          metrics.costToDevelop = `$${match[1]}`;
        }
      }
      
      if (trimmedLine.includes('Estimated Schedule Effort')) {
        const match = trimmedLine.match(/([\d.]+)\s+months/);
        if (match) {
          metrics.scheduleEffort = `${match[1]} months`;
        }
      }
      
      if (trimmedLine.includes('Estimated People Required')) {
        const match = trimmedLine.match(/([\d.]+)/);
        if (match) {
          metrics.peopleRequired = match[1];
        }
      }
    }

    if (metrics.costToDevelop && metrics.scheduleEffort && metrics.peopleRequired) {
      return metrics as EstimatedMetrics;
    }

    return null;
  }

  /**
   * Extrai informações de processamento
   */
  private static parseProcessingInfo(lines: string[]): ProcessingInfo | null {
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      if (trimmedLine.includes('Processed:')) {
        const bytesMatch = trimmedLine.match(/(\d+)\s+bytes/);
        const mbMatch = trimmedLine.match(/([\d.]+)\s+megabytes/);
        
        if (bytesMatch && mbMatch) {
          return {
            processedBytes: parseInt(bytesMatch[1]),
            processedMegabytes: `${mbMatch[1]} megabytes (SI)`
          };
        }
      }
    }

    return null;
  }

  /**
   * Valida se o conteúdo contém métricas de desenvolvimento
   */
  static isValidDevelopmentMetricsContent(content: string): boolean {
    const lines = content.split('\n');
    const hasDataTable = lines.some(line => line.includes('Plain Text') || line.includes('batch.txt'));
    const hasEstimatedMetrics = lines.some(line => line.includes('Estimated Cost to Develop'));
    const hasProcessingInfo = lines.some(line => line.includes('Processed:'));

    return hasDataTable && hasEstimatedMetrics && hasProcessingInfo;
  }
}
