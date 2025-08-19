# 📊 Dashboard de Métricas de Código Corporativo

Um dashboard moderno e responsivo desenvolvido em React com TypeScript para análise e visualização de estatísticas de código fonte corporativo. A aplicação oferece uma interface intuitiva para processamento de arquivos de métricas e análise detalhada de código.

## 🎯 Visão Geral

O Dashboard de Métricas de Código é uma ferramenta corporativa que permite:

- **Processamento de arquivos** de métricas de código fonte
- **Visualização de estatísticas** detalhadas por linguagem e arquivo
- **Análise de complexidade** e qualidade do código
- **Interface responsiva** para diferentes dispositivos
- **Cancelamento de processamento** em tempo real

## 🚀 Funcionalidades Principais

### 📁 **Gestão de Arquivos**
- **Cadastro de arquivos** para processamento
- **Arquivos padrão** pré-configurados (Fontes_Corp_short.txt, Fontes_Corp.txt)
- **Persistência local** usando localStorage
- **Validação de entrada** com feedback visual
- **Remoção de arquivos** da lista

### ⚡ **Processamento Inteligente**
- **Processamento assíncrono** com feedback visual
- **Cancelamento em tempo real** durante o processamento
- **Prevenção de múltiplos processamentos** simultâneos
- **Tratamento robusto de erros** com mensagens contextuais
- **Limpeza automática** de recursos após conclusão

### 📊 **Dashboard de Métricas**
- **Métricas principais** em cards destacados:
  - Total de arquivos analisados
  - Total de linhas de código
  - Linhas de código efetivas
- **Seletor de arquivos** processados
- **Indicadores visuais** de status e performance

### 📈 **Análise Detalhada**
- **Tabela paginada** com todos os arquivos
- **Métricas por arquivo**:
  - Caminho do arquivo
  - Linguagem de programação
  - Total de linhas
  - Linhas em branco
  - Linhas de comentário
  - Linhas de código efetivas
  - Complexidade ciclomática
- **Indicadores de status** por complexidade (Low, Medium, High)
- **Navegação por páginas** com controles intuitivos

### 🎨 **Interface Moderna**
- **Design responsivo** para desktop, tablet e mobile
- **Tema corporativo** com cores profissionais
- **Animações suaves** e transições elegantes
- **Ícones SVG** customizados
- **Feedback visual** em tempo real

## 🛠️ Tecnologias Utilizadas

### **Frontend**
- **React 18** com TypeScript
- **CSS3** com design system customizado
- **SVG** para gráficos e ícones
- **LocalStorage** para persistência de dados

### **Padrões de Design**
- **Component Pattern** para reutilização
- **Service Layer Pattern** para lógica de negócio
- **Context Pattern** para gerenciamento de estado
- **AbortController** para cancelamento de operações

### **Arquitetura**
- **Separação de responsabilidades** (Presentation, Business Logic, Data Access)
- **Componentes modulares** e reutilizáveis
- **TypeScript** para type safety
- **Responsive Design** com media queries

## 📦 Instalação e Execução

### **Pré-requisitos**
- Node.js 16+ 
- npm ou yarn

### **Instalação**
```bash
# Clonar o repositório
git clone <repository-url>
cd dashboard-corp

# Instalar dependências
npm install

# Executar em modo de desenvolvimento
npm start

# Build para produção
npm run build
```

### **Acesso**
- **Desenvolvimento**: http://localhost:3000
- **Produção**: Após build, servir arquivos da pasta `build/`

## 🎯 Como Usar

### **1. Navegação**
- **Dashboard**: Visualização principal das métricas
- **Processar Dados**: Cadastro e processamento de arquivos

### **2. Cadastro de Arquivos**
1. Acesse "Processar Dados" no menu lateral
2. Adicione novos arquivos com nome e caminho
3. Clique em "Adicionar" para salvar

### **3. Processamento**
1. Clique em "Processar" no arquivo desejado
2. Aguarde o processamento (2 segundos simulados)
3. Use "Cancelar Processamento" se necessário
4. Visualize os resultados no Dashboard

### **4. Análise de Dados**
1. Navegue para o Dashboard após processamento
2. Visualize métricas principais nos cards
3. Analise detalhes na tabela paginada
4. Use o seletor para alternar entre arquivos processados

## 📊 Estrutura de Dados

### **CodeMetricsData**
```typescript
interface CodeMetricsData {
  metadata: {
    generatedAt: string;
    sourceFile: string;
    totalFiles: number;
    totalLines: number;
  };
  summary: {
    byLanguage: LanguageSummary[];
    totals: TotalMetrics;
  };
  files: FileMetrics[];
  analytics: {
    topLanguages: LanguageSummary[];
    topFiles: FileMetrics[];
  };
}
```

### **FileMetrics**
```typescript
interface FileMetrics {
  path: string;
  language: string;
  lines: number;
  blanks: number;
  comments: number;
  code: number;
  complexity: number;
}
```

## 🎨 Componentes Principais

### **App.tsx**
- Componente principal da aplicação
- Gerenciamento de rotas e navegação
- Estado global da aplicação

### **Header**
- Logo da empresa e nome do sistema
- Barra de pesquisa (funcionalidade futura)
- Botão de logout

### **Sidebar**
- Navegação principal
- Indicador de página ativa
- Design responsivo

### **FileRegistration**
- Cadastro de arquivos para processamento
- Lista de arquivos cadastrados
- Controles de processamento e cancelamento

### **Dashboard**
- Visualização de métricas principais
- Tabela detalhada de arquivos
- Paginação e navegação
- Seletor de arquivos processados

## 🔧 Funcionalidades Técnicas

### **Cancelamento de Processamento**
- **AbortController** para cancelamento seguro
- **Limpeza automática** de recursos
- **Feedback visual** durante cancelamento
- **Prevenção de vazamentos** de memória

### **Persistência de Dados**
- **LocalStorage** para arquivos cadastrados
- **LocalStorage** para dados processados
- **Recuperação automática** ao reiniciar aplicação

### **Validação e Segurança**
- **Validação de entrada** em formulários
- **Prevenção de processamentos simultâneos**
- **Tratamento robusto de erros**
- **Sanitização de dados**

### **Performance**
- **Componentes otimizados** com React.memo
- **Lazy loading** de dados
- **Paginação** para grandes volumes
- **Animações CSS** otimizadas

## 📱 Responsividade

### **Desktop (>1024px)**
- Layout completo com sidebar lateral
- Tabelas com todas as colunas
- Cards de métricas em linha

### **Tablet (768px - 1024px)**
- Sidebar compacta
- Tabelas responsivas
- Cards adaptados

### **Mobile (<768px)**
- Layout em coluna
- Navegação otimizada
- Tabelas com scroll horizontal
- Botões de ação adaptados

## 🎨 Design System

### **Cores**
- **Primary**: #FF6B35 (laranja corporativo)
- **Secondary**: #3B82F6 (azul)
- **Success**: #10B981 (verde)
- **Warning**: #F59E0B (amarelo)
- **Error**: #EF4444 (vermelho)
- **Background**: #F8FAFC (cinza claro)

### **Tipografia**
- **Font Family**: System fonts (San Francisco, Segoe UI, etc.)
- **Headings**: Font-weight 600-700
- **Body**: Font-weight 400-500
- **Captions**: Font-weight 500

### **Espaçamento**
- **Base Unit**: 0.25rem (4px)
- **Padding**: 0.5rem - 2rem
- **Margin**: 0.5rem - 2rem
- **Border Radius**: 0.375rem - 0.5rem

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

## 🐛 Troubleshooting

### **Problemas Comuns**

#### **Erro de Porta em Uso**
```bash
# Verificar processos na porta 3000
lsof -i :3000

# Matar processo se necessário
kill -9 <PID>
```

#### **Dados não Persistem**
- Verificar se localStorage está habilitado
- Limpar cache do navegador
- Verificar console para erros

#### **Processamento Não Cancela**
- Verificar se AbortController é suportado
- Atualizar navegador para versão mais recente
- Verificar console para erros

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abra um Pull Request

### **Padrões de Contribuição**
- Seguir convenções de código TypeScript
- Adicionar testes para novas funcionalidades
- Documentar mudanças no README
- Manter responsividade em todos os dispositivos

## 📞 Suporte

- **Issues**: Abra uma issue no GitHub
- **Documentação**: Consulte os arquivos técnicos
- **Email**: [seu-email@empresa.com]

## 📚 Documentação Adicional

- [Documentação Técnica](TECHNICAL_DOCS.md)
- [Funcionalidade de Cancelamento](CANCEL_PROCESSING_FEATURE.md)
- [Guia de Estilo](STYLE_GUIDE.md)

---

**Desenvolvido com ❤️ por Marcelo Hernandes - Equipe MSTech**
