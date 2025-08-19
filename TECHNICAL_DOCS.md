# Documentação Técnica - CodeStats Dashboard

## 📋 Visão Geral

O CodeStats Dashboard é uma aplicação React moderna desenvolvida para análise e visualização de estatísticas de código fonte corporativo. A aplicação implementa padrões de design sólidos, arquitetura escalável e boas práticas de desenvolvimento.

## 🏗️ Arquitetura

### Padrões de Design Implementados

#### 1. Singleton Pattern
```typescript
// DataService.ts
export class DataService {
  private static instance: DataService;
  
  public static getInstance(): DataService {
    if (!DataService.instance) {
      DataService.instance = new DataService();
    }
    return DataService.instance;
  }
}
```

**Benefícios:**
- Garante uma única instância do serviço
- Controle centralizado de recursos
- Melhora performance evitando múltiplas instâncias

#### 2. Service Layer Pattern
```typescript
// DataService.ts
export class DataService {
  public async processFileData(fileContent: string): Promise<DashboardData>
  public paginateData<T>(data: T[], page: number, itemsPerPage: number)
  public filterFiles(files: CodeFile[], filters: FilterOptions): CodeFile[]
}
```

**Benefícios:**
- Separação clara de responsabilidades
- Reutilização de lógica de negócio
- Facilita testes unitários

#### 3. Context Pattern
```typescript
// ThemeContext.tsx
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  // ...
};
```

**Benefícios:**
- Gerenciamento global de estado
- Evita prop drilling
- Facilita compartilhamento de estado entre componentes

#### 4. Configuration Object Pattern
```typescript
// config/index.ts
export const config = {
  app: { name: 'CodeStats Dashboard', version: '1.0.0' },
  api: { baseUrl: 'http://localhost:3001', timeout: 30000 },
  features: { fileUpload: true, darkMode: true },
  // ...
};
```

**Benefícios:**
- Configuração centralizada
- Facilita mudanças de ambiente
- Melhora manutenibilidade

### Estrutura de Camadas

```
┌─────────────────────────────────────┐
│           Presentation Layer        │
│  (Components, Pages, Contexts)      │
├─────────────────────────────────────┤
│           Business Logic Layer      │
│  (Services, Utils, Hooks)           │
├─────────────────────────────────────┤
│           Data Access Layer         │
│  (API Calls, Local Storage)         │
└─────────────────────────────────────┘
```

## 🔧 Componentes Principais

### 1. Dashboard Component
**Responsabilidade:** Exibição principal de estatísticas e gráficos

**Características:**
- Gráficos interativos com Recharts
- Cards de resumo com métricas principais
- Tabs para diferentes visualizações
- Loading states e error handling

**Props:**
```typescript
interface DashboardProps {
  data?: DashboardData;
  loading?: boolean;
  error?: string | null;
}
```

### 2. FileUpload Component
**Responsabilidade:** Upload e gerenciamento de arquivos

**Características:**
- Drag and drop interface
- Validação de tipos de arquivo
- Progress feedback
- Lista de arquivos carregados

**Props:**
```typescript
interface FileUploadProps {
  onFileUpload: (file: File) => void;
  uploadedFiles: UploadedFile[];
  onFileSelect: (file: UploadedFile) => void;
  onFileDelete: (fileId: string) => void;
}
```

### 3. FileList Component
**Responsabilidade:** Listagem paginada de arquivos

**Características:**
- Paginação inteligente
- Filtros avançados
- Ordenação por múltiplos critérios
- Busca em tempo real

**Props:**
```typescript
interface FileListProps {
  files: CodeFile[];
  onFileSelect?: (file: CodeFile) => void;
}
```

## 📊 Sistema de Dados

### Estrutura de Dados

```typescript
interface CodeFile {
  path: string;        // Caminho do arquivo
  lines: number;       // Total de linhas
  blanks: number;      // Linhas em branco
  comments: number;    // Linhas de comentário
  code: number;        // Linhas de código
  complexity: number;  // Complexidade ciclomática
}

interface LanguageStats {
  language: string;    // Linguagem de programação
  files: number;       // Número de arquivos
  lines: number;       // Total de linhas
  blanks: number;      // Linhas em branco
  comments: number;    // Linhas de comentário
  code: number;        // Linhas de código
  complexity: number;  // Complexidade total
}
```

### Processamento de Dados

#### Parser de Arquivo
```typescript
private parseFileLine(line: string): CodeFile | null {
  try {
    const cleanLine = line.replace(/^~/, '');
    const parts = cleanLine.split(/\s+/);
    
    // Encontra o índice onde começam os números
    let numberIndex = 0;
    for (let i = 0; i < parts.length; i++) {
      if (!isNaN(parseInt(parts[i]))) {
        numberIndex = i;
        break;
      }
    }

    const path = parts.slice(0, numberIndex).join(' ');
    const numbers = parts.slice(numberIndex);

    return {
      path: path.trim(),
      lines: parseInt(numbers[0]),
      blanks: parseInt(numbers[1]),
      comments: parseInt(numbers[2]),
      code: parseInt(numbers[3]),
      complexity: parseInt(numbers[4])
    };
  } catch (error) {
    console.warn('Erro ao parsear linha:', line, error);
    return null;
  }
}
```

## 🎨 Sistema de Design

### Design Tokens

```css
/* Cores */
--primary-50: #eff6ff;
--primary-500: #3b82f6;
--primary-600: #2563eb;
--primary-900: #1e3a8a;

/* Tipografia */
--font-family: 'Inter', system-ui, sans-serif;
--font-size-sm: 0.875rem;
--font-size-base: 1rem;
--font-size-lg: 1.125rem;
--font-size-xl: 1.25rem;

/* Espaçamento */
--spacing-1: 0.25rem;
--spacing-2: 0.5rem;
--spacing-4: 1rem;
--spacing-6: 1.5rem;
--spacing-8: 2rem;
```

### Componentes Base

#### Card Component
```css
.card {
  @apply bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700;
}
```

#### Button Components
```css
.btn-primary {
  @apply bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200;
}

.btn-secondary {
  @apply bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors duration-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200;
}
```

## 🔍 Sistema de Logging

### Estrutura de Logs

```typescript
interface LogEntry {
  timestamp: string;    // ISO 8601 timestamp
  level: LogLevel;      // DEBUG, INFO, WARN, ERROR, FATAL
  message: string;      // Mensagem principal
  context?: string;     // Contexto da operação
  data?: any;          // Dados adicionais
  error?: Error;       // Objeto de erro (se aplicável)
}
```

### Níveis de Log

```typescript
enum LogLevel {
  DEBUG = 0,    // Informações detalhadas para debugging
  INFO = 1,     // Informações gerais da aplicação
  WARN = 2,     // Avisos que não impedem funcionamento
  ERROR = 3,    // Erros que afetam funcionalidade
  FATAL = 4,    // Erros críticos que impedem funcionamento
}
```

### Uso do Logger

```typescript
// Log de informação
logInfo('Arquivo processado com sucesso', 'FileProcessor', { 
  fileCount: 1500, 
  processingTime: 2500 
});

// Log de erro
logError('Falha ao processar arquivo', 'FileProcessor', { 
  fileName: 'data.txt' 
}, error);

// Log de performance
logPerformance('file_processing', 2500, 'FileProcessor');

// Log de métrica de negócio
logMetric('files_processed', 1500, 'FileProcessor');
```

## 🧪 Testes

### Estrutura de Testes

```
src/
├── __tests__/
│   ├── components/
│   │   ├── Dashboard.test.tsx
│   │   ├── FileList.test.tsx
│   │   └── FileUpload.test.tsx
│   ├── services/
│   │   └── dataService.test.ts
│   └── utils/
│       └── logger.test.ts
```

### Padrões de Teste

#### Teste de Componente
```typescript
describe('Dashboard Component', () => {
  it('should render loading state', () => {
    render(<Dashboard loading={true} />);
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('should render error state', () => {
    render(<Dashboard error="Erro de carregamento" />);
    expect(screen.getByText('Erro de carregamento')).toBeInTheDocument();
  });

  it('should render dashboard data', () => {
    const mockData = createMockDashboardData();
    render(<Dashboard data={mockData} />);
    expect(screen.getByText('15,352')).toBeInTheDocument(); // Total files
  });
});
```

#### Teste de Serviço
```typescript
describe('DataService', () => {
  let dataService: DataService;

  beforeEach(() => {
    dataService = DataService.getInstance();
  });

  it('should process file data correctly', async () => {
    const fileContent = createMockFileContent();
    const result = await dataService.processFileData(fileContent);
    
    expect(result.summary.totalFiles).toBe(15352);
    expect(result.languages).toHaveLength(1);
    expect(result.files).toHaveLength(2);
  });

  it('should filter files correctly', () => {
    const files = createMockFiles();
    const filtered = dataService.filterFiles(files, {
      minComplexity: 500,
      searchTerm: 'backend'
    });
    
    expect(filtered).toHaveLength(1);
    expect(filtered[0].complexity).toBeGreaterThanOrEqual(500);
  });
});
```

## 🚀 Performance

### Otimizações Implementadas

#### 1. Memoização de Componentes
```typescript
const Dashboard = React.memo<DashboardProps>(({ data, loading, error }) => {
  // Component implementation
});
```

#### 2. Lazy Loading
```typescript
const FileList = React.lazy(() => import('./components/FileList'));
const FileUpload = React.lazy(() => import('./components/FileUpload'));
```

#### 3. Virtualização (Preparado)
```typescript
// Para listas grandes, implementar virtualização
import { FixedSizeList as List } from 'react-window';

const VirtualizedFileList = ({ files }) => (
  <List
    height={400}
    itemCount={files.length}
    itemSize={50}
    itemData={files}
  >
    {FileRow}
  </List>
);
```

#### 4. Debounce para Busca
```typescript
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};
```

### Métricas de Performance

- **First Contentful Paint (FCP)**: < 1.5s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **Cumulative Layout Shift (CLS)**: < 0.1
- **Time to Interactive (TTI)**: < 3.5s

## 🔒 Segurança

### Validações Implementadas

#### 1. Validação de Upload
```typescript
const validateFile = (file: File): ValidationResult => {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = ['text/plain', 'text/csv'];
  
  if (file.size > maxSize) {
    return { valid: false, error: 'Arquivo muito grande' };
  }
  
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Tipo de arquivo não suportado' };
  }
  
  return { valid: true };
};
```

#### 2. Sanitização de Dados
```typescript
const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // Remove caracteres perigosos
    .trim()
    .substring(0, 1000); // Limita tamanho
};
```

#### 3. Content Security Policy
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';">
```

## 📈 Monitoramento

### Métricas de Negócio

```typescript
// Métricas de uso
logMetric('files_uploaded', uploadedFiles.length, 'FileUpload');
logMetric('files_processed', processedFiles.length, 'DataProcessor');
logMetric('dashboard_views', viewCount, 'Dashboard');

// Métricas de performance
logPerformance('file_processing', processingTime, 'DataProcessor');
logPerformance('dashboard_rendering', renderTime, 'Dashboard');
```

### Error Tracking

```typescript
// Captura de erros não tratados
window.addEventListener('error', (event) => {
  logError('Unhandled error', 'GlobalErrorHandler', {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno
  }, event.error);
});

// Captura de rejeições de promises
window.addEventListener('unhandledrejection', (event) => {
  logError('Unhandled promise rejection', 'GlobalErrorHandler', {
    reason: event.reason
  });
});
```

## 🔄 Deploy e CI/CD

### Scripts de Build

```json
{
  "scripts": {
    "build": "react-scripts build",
    "build:analyze": "npm run build && npx webpack-bundle-analyzer build/static/js/*.js",
    "build:staging": "REACT_APP_ENVIRONMENT=staging npm run build",
    "build:production": "REACT_APP_ENVIRONMENT=production npm run build"
  }
}
```

### Configuração de Ambiente

```bash
# .env.development
REACT_APP_API_URL=http://localhost:3001
REACT_APP_ENVIRONMENT=development

# .env.staging
REACT_APP_API_URL=https://staging-api.codestats.com
REACT_APP_ENVIRONMENT=staging

# .env.production
REACT_APP_API_URL=https://api.codestats.com
REACT_APP_ENVIRONMENT=production
```

## 📚 Próximos Passos

### Melhorias Planejadas

1. **Backend Integration**
   - API REST para persistência de dados
   - Autenticação e autorização
   - Upload de arquivos para servidor

2. **Funcionalidades Avançadas**
   - Comparação entre diferentes versões
   - Análise de tendências temporais
   - Exportação de relatórios

3. **Performance**
   - Implementação de virtualização para listas grandes
   - Cache inteligente com React Query
   - Lazy loading de componentes

4. **Monitoramento**
   - Integração com Sentry para error tracking
   - Analytics com Google Analytics
   - Métricas de performance com Web Vitals

---

**Documentação mantida e atualizada seguindo as melhores práticas de documentação técnica**
