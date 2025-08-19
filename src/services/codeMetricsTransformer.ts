import { 
  FileMetrics, 
  LanguageSummary, 
  TotalMetrics, 
  CodeMetricsData, 
  CodeMetricsProcessingResult 
} from '../types';

export class CodeMetricsTransformer {
  /**
   * Transforma o conteúdo do arquivo de métricas em JSON estruturado
   */
  static transformContent(content: string): CodeMetricsProcessingResult {
    try {
      const lines = content.split('\n').filter(line => line.trim());
      
      const result = {
        summary: [] as LanguageSummary[],
        files: [] as FileMetrics[],
        totals: null as TotalMetrics | null
      };

      let currentSection = 'header';
      
      for (const line of lines) {
        // Identifica seções do arquivo
        if (line.includes('Language') && line.includes('Files')) {
          currentSection = 'summary';
          continue;
        }
        
        if (line.includes('Total')) {
          currentSection = 'totals';
          continue;
        }

        // Parse das linhas de resumo por linguagem
        if (currentSection === 'summary' && this.isLanguageSummary(line)) {
          const languageData = this.parseLanguageSummary(line);
          if (languageData) {
            result.summary.push(languageData);
          }
        }
        
        // Parse das linhas de arquivos individuais
        if (this.isFileLine(line)) {
          const fileData = this.parseFileLine(line);
          if (fileData) {
            result.files.push(fileData);
          }
        }
        
        // Parse do total
        if (currentSection === 'totals' && line.includes('Total')) {
          result.totals = this.parseTotalLine(line);
        }
      }

      const jsonData = this.structureData(result);
      
      return {
        success: true,
        data: jsonData
      };
      
    } catch (error) {
      return {
        success: false,
        error: `Erro durante a transformação: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      };
    }
  }

  /**
   * Verifica se a linha é um resumo de linguagem
   */
  private static isLanguageSummary(line: string): boolean {
    // Padrão mais flexível: "C#                       15352   2791797   803965    416722  1571110     101839"
    const trimmed = line.trim();
    // Verifica se a linha tem o padrão: linguagem + espaços + 6 números
    return /^[A-Za-z#+]+[\s\t]+[0-9]+[\s\t]+[0-9]+[\s\t]+[0-9]+[\s\t]+[0-9]+[\s\t]+[0-9]+[\s\t]+[0-9]+$/.test(trimmed);
  }

  /**
   * Parse de linha de resumo de linguagem
   */
  private static parseLanguageSummary(line: string): LanguageSummary | null {
    const parts = line.trim().split(/\s+/);
    console.log('Parseando linha de linguagem:', line);
    console.log('Partes encontradas:', parts);
    
    if (parts.length >= 7) {
      return {
        language: parts[0],
        files: parseInt(parts[1]),
        lines: parseInt(parts[2]),
        blanks: parseInt(parts[3]),
        comments: parseInt(parts[4]),
        code: parseInt(parts[5]),
        complexity: parseInt(parts[6])
      };
    }
    return null;
  }

  /**
   * Verifica se a linha é um arquivo individual
   */
  private static isFileLine(line: string): boolean {
    // Padrão: "~/com/caixa/backend/zl3001s.cs     17532     6976      4128     6428        646"
    const trimmed = line.trim();
    return trimmed.includes('~') && trimmed.includes('.cs') && !trimmed.includes('Total');
  }

  /**
   * Parse de linha de arquivo individual
   */
  private static parseFileLine(line: string): FileMetrics | null {
    console.log('Parseando linha de arquivo:', line);
    
    // Remove espaços extras e divide a linha
    const trimmedLine = line.trim();
    
    // Usa split por espaços para extrair métricas (últimos 5 números)
    const parts = trimmedLine.split(/\s+/);
    if (parts.length >= 6) {
      // Os últimos 5 números são as métricas
      const metrics = parts.slice(-5).map(Number);
      const filePath = parts.slice(0, -5).join(' ');
      
      console.log('Caminho do arquivo:', filePath);
      console.log('Métricas:', metrics);
      
      return {
        path: filePath,
        language: this.detectLanguage(filePath),
        lines: metrics[0],
        blanks: metrics[1],
        comments: metrics[2],
        code: metrics[3],
        complexity: metrics[4]
      };
    }
    
    console.log('Não conseguiu extrair métricas da linha');
    return null;
  }

  /**
   * Detecta a linguagem baseada na extensão do arquivo
   */
  private static detectLanguage(filePath: string): string {
    const ext = filePath.toLowerCase().split('.').pop() || '';
    const languageMap: Record<string, string> = {
      'cs': 'C#',
      'xml': 'XML',
      'yaml': 'YAML',
      'yml': 'YAML',
      'json': 'JSON',
      'sh': 'Shell',
      'bat': 'Batch',
      'sql': 'SQL'
    };
    return languageMap[ext] || 'Unknown';
  }

  /**
   * Parse da linha de total
   */
  private static parseTotalLine(line: string): TotalMetrics | null {
    const parts = line.trim().split(/\s+/);
    if (parts.length >= 7) {
      return {
        files: parseInt(parts[1]),
        lines: parseInt(parts[2]),
        blanks: parseInt(parts[3]),
        comments: parseInt(parts[4]),
        code: parseInt(parts[5]),
        complexity: parseInt(parts[6])
      };
    }
    return null;
  }

  /**
   * Estrutura os dados em formato JSON final
   */
  private static structureData(parsedData: {
    summary: LanguageSummary[];
    files: FileMetrics[];
    totals: TotalMetrics | null;
  }): CodeMetricsData {
    return {
      metadata: {
        generatedAt: new Date().toISOString(),
        sourceFile: 'Fontes_Corp.txt',
        totalFiles: parsedData.totals?.files || 0,
        totalLines: parsedData.totals?.lines || 0
      },
      summary: {
        byLanguage: parsedData.summary,
        totals: parsedData.totals
      },
      files: parsedData.files,
      analytics: this.generateAnalytics(parsedData)
    };
  }

  /**
   * Gera métricas analíticas adicionais
   */
  private static generateAnalytics(data: { summary: LanguageSummary[]; files: FileMetrics[] }) {
    const topFilesByLines = [...data.files]
      .sort((a, b) => b.lines - a.lines)
      .slice(0, 5);

    const languageDistribution = data.summary.map(lang => ({
      language: lang.language,
      files: lang.files,
      lines: lang.lines,
      percentage: ((lang.files / data.files.length) * 100).toFixed(1)
    }));

    return {
      topLanguages: data.summary,
      topFiles: topFilesByLines
    };
  }
}
