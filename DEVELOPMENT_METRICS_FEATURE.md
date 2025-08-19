# Métricas de Desenvolvimento - Dashboard de Métricas de Código

## Visão Geral

Esta funcionalidade permite processar e exibir métricas de desenvolvimento no dashboard, incluindo estimativas de custo, prazo e recursos necessários para projetos de software.

## Estrutura dos Dados

### Formato do Arquivo de Entrada

O sistema espera arquivos de texto com o seguinte formato padrão:

```
Plain Text    1    0    0    0    0    0
batch.txt    0    0    0    0    0
Total    40    7175    463    837    5875    5

Estimated Development Metrics:
Estimated Cost to Develop (organic): $173,401
Estimated Schedule Effort (organic): 7.07 months
Estimated People Required (organic): 2.18

Processing Information:
Processed: 409509 bytes, 0.410 megabytes (SI)
```

### Seções do Arquivo

1. **Tabela de Dados**: Contém métricas por tipo de arquivo
2. **Métricas Estimadas**: Custos, prazos e recursos humanos
3. **Informações de Processamento**: Dados sobre o processamento

## Implementação Técnica

### Tipos TypeScript

```typescript
export interface DevelopmentMetrics {
  dataTable: DataTableRow[];
  estimatedMetrics: EstimatedMetrics;
  processingInfo: ProcessingInfo;
}

export interface DataTableRow {
  label: string;
  values: number[];
}

export interface EstimatedMetrics {
  costToDevelop: string;
  scheduleEffort: string;
  peopleRequired: string;
}

export interface ProcessingInfo {
  processedBytes: number;
  processedMegabytes: string;
}
```

### Parser

O parser está localizado em `src/services/developmentMetricsParser.ts` e inclui:

- **Validação de conteúdo**: Verifica se o arquivo contém métricas de desenvolvimento
- **Parse da tabela de dados**: Extrai métricas por tipo de arquivo
- **Parse das estimativas**: Extrai custos, prazos e recursos
- **Parse das informações de processamento**: Extrai dados de processamento

### Componente React

O componente `DevelopmentMetricsCard` exibe:

- **Tabela de dados**: Formatação visual dos dados processados
- **Métricas estimadas**: Cards com custo, prazo e pessoas necessárias
- **Informações de processamento**: Dados sobre bytes processados

## Integração com o Dashboard

### Processamento Automático

O sistema detecta automaticamente se um arquivo contém métricas de desenvolvimento e:

1. Processa o conteúdo usando o parser especializado
2. Adiciona os dados ao objeto `CodeMetricsData`
3. Exibe o componente no dashboard quando disponível

### Localização no Dashboard

As métricas de desenvolvimento aparecem:
- Após os cards de métricas principais
- Antes da tabela de arquivos
- Apenas quando dados estão disponíveis

## Uso

### 1. Preparar o Arquivo

Crie um arquivo de texto com o formato especificado acima.

### 2. Processar no Dashboard

1. Acesse a seção "Processar Dados"
2. Faça upload do arquivo
3. O sistema detectará automaticamente as métricas de desenvolvimento
4. Visualize os resultados no dashboard

### 3. Visualização

O dashboard exibirá:
- **Tabela de dados**: Métricas por tipo de arquivo
- **Estimativas**: Custo, prazo e recursos necessários
- **Processamento**: Informações sobre dados processados

## Arquivos de Teste

### Exemplo de Dados

Arquivo: `data/development-metrics-example.txt`

### Teste do Parser

Execute o teste com:
```bash
node test-development-metrics.js
```

### Teste de Serialização

Execute o teste completo com:
```bash
node test-serialization.js
```

## Estilos CSS

Os estilos estão definidos em `src/App.css` e incluem:

- **Cards responsivos**: Adaptação para diferentes tamanhos de tela
- **Gradientes**: Design moderno com gradientes
- **Animações**: Transições suaves
- **Cores temáticas**: Diferentes cores para diferentes tipos de métricas

## Validação

### Critérios de Validação

O sistema valida se o arquivo contém:
- Linhas com "Plain Text" ou "batch.txt"
- Linhas com "Estimated Cost to Develop"
- Linhas com "Processed:"

### Tratamento de Erros

- Arquivos inválidos são ignorados
- Erros de parsing são registrados
- Dados parciais são processados quando possível

## Extensibilidade

### Adicionar Novos Tipos de Métricas

1. Estenda os tipos TypeScript
2. Atualize o parser
3. Adicione componentes de visualização
4. Atualize os estilos CSS

### Personalização

- Cores e estilos podem ser personalizados via CSS
- Layout pode ser modificado no componente React
- Parser pode ser estendido para novos formatos

## Troubleshooting

### Problemas Comuns

1. **Arquivo não detectado**: Verifique o formato do arquivo
2. **Dados não exibidos**: Verifique se o parser está funcionando
3. **Erros de estilo**: Verifique se o CSS está carregado

### Debug

Use os arquivos de teste para verificar:
- Funcionamento do parser
- Formato dos dados
- Validação de conteúdo

## Contribuição

Para contribuir com melhorias:

1. Mantenha a compatibilidade com o formato existente
2. Adicione testes para novas funcionalidades
3. Documente mudanças na API
4. Atualize os tipos TypeScript quando necessário
