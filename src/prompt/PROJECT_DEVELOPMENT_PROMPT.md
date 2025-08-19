# 🚀 Prompt de Desenvolvimento do Projeto - Dashboard de Métricas de Código

## 📋 Contexto do Projeto

### **Objetivo**
Desenvolver um dashboard moderno e responsivo para análise e visualização de estatísticas de código fonte corporativo, permitindo processamento de arquivos de métricas e análise detalhada de qualidade de código.

### **Público-Alvo**
- Equipes de desenvolvimento corporativo
- Analistas de qualidade de código
- Gerentes de projeto técnico
- Arquitetos de software

## 🏗️ Arquitetura e Design Patterns

### **Padrões de Design Implementados**

#### 1. **Singleton Pattern**
```typescript
// DataService.ts - Garantir uma única instância do serviço
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

#### 2. **Service Layer Pattern**
```typescript
// Separação clara de responsabilidades
export class DataService {
  public async processFileData(fileContent: string): Promise<DashboardData>
  public paginateData<T>(data: T[], page: number, itemsPerPage: number)
  public filterFiles(files: CodeFile[], filters: FilterOptions): CodeFile[]
}
```

#### 3. **Context Pattern**
```typescript
// Gerenciamento global de estado sem prop drilling
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  // ...
};
```

#### 4. **Configuration Object Pattern**
```typescript
// Configuração centralizada
export const config = {
  app: { name: 'CodeStats Dashboard', version: '1.0.0' },
  api: { baseUrl: 'http://localhost:3001', timeout: 30000 },
  features: { fileUpload: true, darkMode: true },
  // ...
};
```

### **Estrutura de Camadas**
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

## 🛠️ Stack Tecnológica

### **Frontend Core**
- **React 19.1.1** - Biblioteca principal para UI
- **TypeScript 4.9.5** - Type safety e melhor DX
- **React Router DOM 7.8.1** - Roteamento da aplicação

### **UI/UX Libraries**
- **Tailwind CSS 4.1.12** - Framework CSS utilitário
- **Headless UI 2.2.7** - Componentes acessíveis
- **Heroicons 2.2.0** - Ícones SVG
- **Lucide React 0.540.0** - Ícones adicionais
- **Recharts 3.1.2** - Gráficos interativos

### **State Management & Data Fetching**
- **TanStack React Query 5.85.3** - Gerenciamento de estado servidor
- **Context API** - Estado global da aplicação
- **LocalStorage** - Persistência local de dados

### **Testing**
- **Testing Library React 16.3.0** - Testes de componentes
- **Testing Library DOM 10.4.1** - Testes de DOM
- **Testing Library User Event 13.5.0** - Simulação de interações
- **Jest** - Framework de testes

### **Development Tools**
- **React Scripts 5.0.1** - Scripts de desenvolvimento
- **Web Vitals 2.1.4** - Métricas de performance
- **ESLint** - Linting de código

## 🎯 Funcionalidades Principais

### **1. Gestão de Arquivos**
- Cadastro de arquivos para processamento
- Arquivos padrão pré-configurados
- Persistência local usando localStorage
- Validação de entrada com feedback visual
- Remoção de arquivos da lista

### **2. Processamento Inteligente**
- Processamento assíncrono com feedback visual
- **Cancelamento em tempo real** durante o processamento
- Prevenção de múltiplos processamentos simultâneos
- Tratamento robusto de erros com mensagens contextuais
- Limpeza automática de recursos após conclusão

### **3. Dashboard de Métricas**
- Métricas principais em cards destacados
- Seletor de arquivos processados
- Indicadores visuais de status e performance

### **4. Análise Detalhada**
- Tabela paginada com todos os arquivos
- Métricas por arquivo (linhas, comentários, complexidade)
- Indicadores de status por complexidade
- Navegação por páginas com controles intuitivos

## 🔧 Implementação Técnica

### **Cancelamento de Processamento (Feature Destaque)**

#### **AbortController Integration**
```typescript
const processFile = async (fileConfig: FileConfig) => {
  // Cria AbortController para este processamento
  abortControllerRef.current = new AbortController();
  const { signal } = abortControllerRef.current;

  try {
    // Simula processamento com verificação de cancelamento
    await new Promise((resolve, reject) => {
      const timeout = setTimeout(resolve, 2000);
      
      signal.addEventListener('abort', () => {
        clearTimeout(timeout);
        reject(new Error('Processamento cancelado pelo usuário'));
      });
    });
    
    // Verifica se foi cancelado antes de continuar
    if (signal.aborted) {
      throw new Error('Processamento cancelado');
    }
    
    // Continua processamento...
  } catch (error) {
    // Tratamento específico para cancelamento
    if (error instanceof Error && error.message.includes('cancelado')) {
      console.log('Processamento cancelado pelo usuário');
    } else {
      alert('Erro ao processar arquivo. Tente novamente.');
    }
  } finally {
    // Limpeza de estados
    setIsProcessing(false);
    setProcessingFileId(null);
    abortControllerRef.current = null;
  }
};
```

### **Sistema de Dados**

#### **Estrutura de Dados**
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

#### **Parser de Arquivo**
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

### **Design Tokens**
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

### **Componentes Base**
```css
.card {
  @apply bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700;
}

.btn-primary {
  @apply bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200;
}
```

## 🔍 Sistema de Logging

### **Estrutura de Logs**
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

### **Uso do Logger**
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
```

## 🧪 Testes

### **Padrões de Teste**
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

## 🚀 Performance

### **Otimizações Implementadas**

#### **1. Memoização de Componentes**
```typescript
const Dashboard = React.memo<DashboardProps>(({ data, loading, error }) => {
  // Component implementation
});
```

#### **2. Lazy Loading**
```typescript
const FileList = React.lazy(() => import('./components/FileList'));
const FileUpload = React.lazy(() => import('./components/FileUpload'));
```

#### **3. Debounce para Busca**
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

### **Métricas de Performance**
- **First Contentful Paint (FCP)**: < 1.5s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **Cumulative Layout Shift (CLS)**: < 0.1
- **Time to Interactive (TTI)**: < 3.5s

## 🔒 Segurança

### **Validações Implementadas**
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

### **Sanitização de Dados**
```typescript
const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // Remove caracteres perigosos
    .trim()
    .substring(0, 1000); // Limita tamanho
};
```

## 📱 Responsividade

### **Breakpoints**
- **Desktop (>1024px)**: Layout completo com sidebar lateral
- **Tablet (768px - 1024px)**: Sidebar compacta, tabelas responsivas
- **Mobile (<768px)**: Layout em coluna, navegação otimizada

### **Design Responsivo**
```css
/* Desktop */
@media (min-width: 1024px) {
  .sidebar { width: 280px; }
  .main-content { margin-left: 280px; }
}

/* Tablet */
@media (max-width: 1023px) and (min-width: 768px) {
  .sidebar { width: 200px; }
  .main-content { margin-left: 200px; }
}

/* Mobile */
@media (max-width: 767px) {
  .sidebar { transform: translateX(-100%); }
  .main-content { margin-left: 0; }
}
```

## 🔄 Processo de Desenvolvimento

### **1. Planejamento e Arquitetura**
- Definição de requisitos funcionais e não funcionais
- Escolha da stack tecnológica
- Design da arquitetura de componentes
- Definição de padrões de design

### **2. Setup do Projeto**
```bash
# Criação do projeto React com TypeScript
npx create-react-app dashboard-corp --template typescript

# Instalação de dependências
npm install @headlessui/react @heroicons/react tailwindcss
npm install @tanstack/react-query react-router-dom recharts
npm install @testing-library/react @testing-library/jest-dom
```

### **3. Estruturação de Pastas**
```
src/
├── components/          # Componentes reutilizáveis
├── pages/              # Páginas da aplicação
├── services/           # Lógica de negócio
├── types/              # Definições TypeScript
├── utils/              # Utilitários
├── hooks/              # Custom hooks
├── context/            # Context providers
└── styles/             # Estilos globais
```

### **4. Desenvolvimento Iterativo**
- Implementação de componentes base
- Integração de funcionalidades
- Testes unitários e de integração
- Refinamento de UX/UI

### **5. Otimizações**
- Análise de performance
- Implementação de lazy loading
- Otimização de bundle
- Melhorias de acessibilidade

## 📈 Métricas de Qualidade

### **Cobertura de Testes**
- **Componentes**: 85%+
- **Serviços**: 90%+
- **Utilitários**: 95%+

### **Performance**
- **Bundle Size**: < 500KB gzipped
- **Lighthouse Score**: 90+ em todas as categorias
- **Core Web Vitals**: Dentro dos padrões recomendados

### **Acessibilidade**
- **WCAG 2.1 AA**: Conformidade completa
- **Screen Reader**: Compatibilidade total
- **Keyboard Navigation**: Navegação completa por teclado

## 🔮 Funcionalidades Futuras

### **Próximas Versões**
1. **Upload de Arquivos**: Drag & drop de arquivos
2. **Exportação**: PDF, Excel, CSV
3. **Filtros Avançados**: Por linguagem, complexidade, data
4. **Gráficos Interativos**: Charts.js ou D3.js
5. **Comparação**: Entre diferentes versões
6. **Alertas**: Notificações de métricas críticas

### **Melhorias Técnicas**
1. **Web Workers**: Processamento em background
2. **Service Workers**: Cache offline
3. **PWA**: Progressive Web App
4. **Backend API**: Integração com servidor
5. **Autenticação**: Login e autorização
6. **Database**: Persistência em banco de dados

## 📚 Documentação

### **Arquivos de Documentação**
- **README.md**: Visão geral e instruções de uso
- **TECHNICAL_DOCS.md**: Documentação técnica detalhada
- **CANCEL_PROCESSING_FEATURE.md**: Documentação da funcionalidade de cancelamento
- **PROJECT_DEVELOPMENT_PROMPT.md**: Este arquivo

### **Padrões de Documentação**
- Documentação inline para funções complexas
- Comentários explicando "porquê", não "o que"
- Exemplos de uso para APIs públicas
- Diagramas de arquitetura quando necessário

## 🎯 Lições Aprendidas

### **Sucessos**
1. **Cancelamento de Processamento**: Implementação robusta com AbortController
2. **Design System**: Consistência visual em toda aplicação
3. **Performance**: Otimizações efetivas com React.memo e lazy loading
4. **Testes**: Cobertura abrangente com Testing Library

### **Desafios Superados**
1. **Parsing de Arquivos**: Lógica robusta para diferentes formatos
2. **Estado Global**: Gerenciamento eficiente sem prop drilling
3. **Responsividade**: Adaptação perfeita para todos os dispositivos
4. **Performance**: Otimização de renderização para grandes volumes de dados

### **Melhorias Futuras**
1. **Backend Integration**: Migração para arquitetura full-stack
2. **Real-time Updates**: WebSockets para atualizações em tempo real
3. **Advanced Analytics**: Machine learning para insights de código
4. **Team Collaboration**: Funcionalidades multi-usuário

## 🤝 Contribuição e Manutenção

### **Padrões de Contribuição**
- Seguir convenções de código TypeScript
- Adicionar testes para novas funcionalidades
- Documentar mudanças no README
- Manter responsividade em todos os dispositivos

### **Code Review Checklist**
- [ ] Código segue padrões estabelecidos
- [ ] Testes passam e cobertura adequada
- [ ] Documentação atualizada
- [ ] Performance não degradada
- [ ] Acessibilidade mantida

---

**Desenvolvido com ❤️ seguindo as melhores práticas de engenharia de software corporativo**

*Este prompt documenta o processo completo de desenvolvimento do Dashboard de Métricas de Código, servindo como referência para futuras manutenções e evoluções do projeto.*
