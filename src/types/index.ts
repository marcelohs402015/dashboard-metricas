// Tipos para dados do dashboard
export interface ChartDataPoint {
  day: string;
  value: number;
}

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  uploadedAt: Date;
  data: ChartDataPoint[];
}

export interface DashboardData {
  chartData: ChartDataPoint[];
  summary: {
    totalPoints: number;
    averageValue: number;
    maxValue: number;
    minValue: number;
  };
}

// Tipos para processamento de arquivos
export interface FileProcessingResult {
  success: boolean;
  data?: ChartDataPoint[];
  error?: string;
}

// Novos tipos para métricas de código fonte
export interface FileMetrics {
  path: string;
  language: string;
  lines: number;
  blanks: number;
  comments: number;
  code: number;
  complexity: number;
}

export interface LanguageSummary {
  language: string;
  files: number;
  lines: number;
  blanks: number;
  comments: number;
  code: number;
  complexity: number;
}

export interface TotalMetrics {
  files: number;
  lines: number;
  blanks: number;
  comments: number;
  code: number;
  complexity: number;
}

export interface CodeMetricsData {
  metadata: {
    generatedAt: string;
    sourceFile: string;
    totalFiles: number;
    totalLines: number;
  };
  summary: {
    byLanguage: LanguageSummary[];
    totals: TotalMetrics | null;
  };
  files: FileMetrics[];
  analytics: {
    topLanguages: LanguageSummary[];
    topFiles: FileMetrics[];
  };
}

export interface CodeMetricsFile {
  id: string;
  name: string;
  size: number;
  uploadedAt: Date;
  data: CodeMetricsData;
}

export interface CodeMetricsProcessingResult {
  success: boolean;
  data?: CodeMetricsData;
  error?: string;
}
