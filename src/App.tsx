import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { CodeMetricsData } from './types';
import { sampleCodeMetricsData } from './data/sampleData';

// Componente de ícones SVG
const Icon: React.FC<{ name: string; className?: string }> = ({ name, className = '' }) => {
  const icons: { [key: string]: string } = {
    home: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
    chart: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
    file: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    code: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4',
    trending: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
    plus: 'M12 4v16m8-8H4',
    stop: 'M6 18L18 6M6 6l12 12'
  };

  return (
    <svg className={`w-5 h-5 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icons[name]} />
    </svg>
  );
};

// Componente Header
const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="header-left">
        <div className="logo">
          <div className="logo-text">mstech</div>
          <div className="logo-symbol">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M8 16L12 12L16 16L12 20L8 16Z" fill="#FF6B35"/>
              <path d="M16 16L20 12L24 16L20 20L16 16Z" fill="#FF6B35"/>
              <path d="M12 12L16 8L20 12L16 16L12 12Z" fill="#FF6B35"/>
              <path d="M12 20L16 24L20 20L16 16L12 20Z" fill="#FF6B35"/>
            </svg>
          </div>
        </div>
        <div className="company-name">Dashboard de Métricas de Código</div>
      </div>
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Buscar arquivos..."
        />
      </div>
    </header>
  );
};

// Componente Sidebar
const Sidebar: React.FC<{ activeItem: string; onItemClick: (item: string) => void }> = ({ activeItem, onItemClick }) => {
  return (
    <aside className="sidebar">
      <div className="sidebar-section">
        <div className="sidebar-title">Navegação</div>
          <div
          className={`nav-item ${activeItem === 'dashboard' ? 'active' : ''}`}
          onClick={() => onItemClick('dashboard')}
          >
            <div className="nav-icon">
            <Icon name="home" />
          </div>
          Dashboard
      </div>
        <div 
          className={`nav-item ${activeItem === 'files' ? 'active' : ''}`}
          onClick={() => onItemClick('files')}
        >
          <div className="nav-icon">
            <Icon name="plus" />
          </div>
          Processar Dados
        </div>
      </div>
    </aside>
  );
};

// Interface para arquivo cadastrado
interface FileConfig {
  id: string;
  name: string;
  path: string;
  isProcessing: boolean;
  isProcessed: boolean;
  processedAt?: string;
  data?: CodeMetricsData;
}

// Componente de Cadastro de Arquivos
const FileRegistration: React.FC<{ onFileProcessed: (data: CodeMetricsData, fileName: string) => void }> = ({ onFileProcessed }) => {
  const [files, setFiles] = useState<FileConfig[]>(() => {
    // Carrega arquivos salvos do localStorage
    const savedFiles = localStorage.getItem('registeredFiles');
    if (savedFiles) {
      const parsedFiles = JSON.parse(savedFiles);
      // Garante que nenhum arquivo esteja em processamento ao carregar
      return parsedFiles.map((file: FileConfig) => ({
        ...file,
        isProcessing: false
      }));
    }
    // Arquivos padrão para demonstração se não houver salvos
    return [
      {
        id: '1',
        name: 'Fontes_Corp_short.txt',
        path: 'data/Fontes_Corp_short.txt',
        isProcessing: false,
        isProcessed: true,
        processedAt: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Fontes_Corp.txt',
        path: 'data/Fontes_Corp.txt',
        isProcessing: false,
        isProcessed: false
      }
    ];
  });
  const [newFile, setNewFile] = useState({ name: '', path: '' });
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingFileId, setProcessingFileId] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);



  // Salva arquivos no localStorage sempre que a lista mudar
  useEffect(() => {
    localStorage.setItem('registeredFiles', JSON.stringify(files));
  }, [files]);

  const addFile = () => {
    // Validação dos campos
    const trimmedName = newFile.name.trim();
    const trimmedPath = newFile.path.trim();
    
    if (!trimmedName || !trimmedPath) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    // Verifica se já existe um arquivo com o mesmo nome
    const existingFile = files.find(f => f.name.toLowerCase() === trimmedName.toLowerCase());
    if (existingFile) {
      alert('Já existe um arquivo cadastrado com este nome.');
      return;
    }

    // Cria o objeto FileConfig apenas com os dados dos campos
    const fileConfig: FileConfig = {
      id: Date.now().toString(),
      name: trimmedName,
      path: trimmedPath,
      isProcessing: false,
      isProcessed: false
    };

    // Adiciona o arquivo à lista
    setFiles(prev => [...prev, fileConfig]);
    
    // Limpa os campos do formulário
    setNewFile({ name: '', path: '' });
    
    console.log('Arquivo adicionado:', fileConfig);
  };

  const processFile = async (fileConfig: FileConfig) => {
    // Verifica se já há um arquivo sendo processado
    const isAnyProcessing = files.some(f => f.isProcessing);
    if (isAnyProcessing) {
      alert('Aguarde o processamento do arquivo atual terminar.');
      return;
    }

    console.log('Iniciando processamento do arquivo:', fileConfig.name);

    // Cria um novo AbortController para este processamento
    abortControllerRef.current = new AbortController();
    const { signal } = abortControllerRef.current;

    // Simula o processamento do arquivo
    setIsProcessing(true);
    setProcessingFileId(fileConfig.id);
    
    // Atualiza o status do arquivo
    setFiles(prev => prev.map(f => 
      f.id === fileConfig.id 
        ? { ...f, isProcessing: true }
        : f
    ));

    console.log('Status de processamento atualizado. isProcessing:', true);

    try {
      // Simula delay de processamento com verificação de cancelamento
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
      
      // Aqui você faria a leitura real do arquivo
      // Por enquanto, usa os dados de exemplo
      const processedData: CodeMetricsData = {
        ...sampleCodeMetricsData,
        metadata: {
          ...sampleCodeMetricsData.metadata,
          sourceFile: fileConfig.name,
          generatedAt: new Date().toISOString()
        }
      };

      // Atualiza o arquivo como processado
      setFiles(prev => prev.map(f => 
        f.id === fileConfig.id 
          ? { 
              ...f, 
              isProcessing: false, 
              isProcessed: true, 
              processedAt: new Date().toISOString(),
              data: processedData
            }
          : f
      ));

      // Atualiza o dashboard
      onFileProcessed(processedData, fileConfig.name);
      
    } catch (error) {
      console.error('Erro ao processar arquivo:', error);
      
      // Se foi cancelado, não mostra erro
      if (error instanceof Error && error.message.includes('cancelado')) {
        console.log('Processamento cancelado pelo usuário');
      } else {
        alert('Erro ao processar arquivo. Tente novamente.');
      }
      
      setFiles(prev => prev.map(f => 
        f.id === fileConfig.id 
          ? { ...f, isProcessing: false }
          : f
      ));
    } finally {
      setIsProcessing(false);
      setProcessingFileId(null);
      abortControllerRef.current = null;
    }
  };

  const cancelProcessing = () => {
    console.log('Função cancelProcessing chamada');
    console.log('abortControllerRef.current:', abortControllerRef.current);
    console.log('isProcessing:', isProcessing);
    console.log('files processing:', files.filter(f => f.isProcessing).length);
    
    // Limpa os estados imediatamente
    setIsProcessing(false);
    setProcessingFileId(null);
    
    // Atualiza o status dos arquivos
    setFiles(prev => prev.map(f => ({ ...f, isProcessing: false })));
    
    // Cancela o processamento se houver um AbortController ativo
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      console.log('Solicitação de cancelamento enviada...');
    }
    
    // Limpa a referência do AbortController
    abortControllerRef.current = null;
    
    console.log('Estados limpos após cancelamento');
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const resetToDefault = () => {
    // Limpa o localStorage
    localStorage.removeItem('registeredFiles');
    localStorage.removeItem('processedFilesData');
    
    // Recarrega a página para resetar para o estado padrão
    window.location.reload();
  };

  return (
    <div className="file-registration">
      <div className="registration-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1>Processar Dados</h1>
            <p>Adicione arquivos de métricas de código para processar e visualizar no dashboard</p>
          </div>
          <button 
            onClick={resetToDefault}
            style={{
              padding: '8px 16px',
              backgroundColor: '#6b7280',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
            title="Resetar para estado inicial"
          >
            Reset Demo
          </button>
        </div>
      </div>

      {/* Formulário de cadastro */}
      <div className="registration-form">
        <h3>Novo Arquivo</h3>
        <div className="form-row">
          <div className="form-group">
            <label>Nome do Arquivo:</label>
            <input
              type="text"
              value={newFile.name}
              onChange={(e) => setNewFile({ ...newFile, name: e.target.value.trim() })}
              onBlur={(e) => setNewFile({ ...newFile, name: e.target.value.trim() })}
              placeholder="Ex: Fontes_Corp.txt"
              maxLength={100}
            />
          </div>
          <div className="form-group">
            <label>Caminho do Arquivo:</label>
            <input
              type="text"
              value={newFile.path}
              onChange={(e) => setNewFile({ ...newFile, path: e.target.value.trim() })}
              onBlur={(e) => setNewFile({ ...newFile, path: e.target.value.trim() })}
              placeholder="Ex: /home/user/data/Fontes_Corp.txt"
              maxLength={200}
            />
          </div>
          <button 
            className="btn-add"
            onClick={addFile}
            disabled={!newFile.name || !newFile.path}
          >
            <Icon name="plus" />
            Adicionar
          </button>
        </div>
      </div>

      {/* Lista de arquivos cadastrados */}
      <div className="files-list">
        <h3>Arquivos Cadastrados</h3>
        

        
        {/* Debug: Status de processamento */}
        <div style={{ 
          background: '#f0f0f0', 
          padding: '10px', 
          marginBottom: '10px', 
          borderRadius: '5px',
          fontSize: '12px',
          fontFamily: 'monospace'
        }}>
          Debug: isProcessing = {isProcessing.toString()}, 
          ProcessingFiles = {files.filter(f => f.isProcessing).length}
        </div>
        
        {/* Botão de cancelamento global - sempre visível quando processando */}
        {isProcessing && (
          <div className="cancel-processing-container">
            <div className="cancel-processing-info">
              <div className="spinner"></div>
              <span>Processando arquivo... (Clique em "Interromper" para cancelar)</span>
            </div>
            <button 
              className="btn-cancel"
              onClick={cancelProcessing}
              title="Cancelar processamento"
            >
              <Icon name="stop" />
              Cancelar Processamento
            </button>
          </div>
        )}
        
        {files.length === 0 ? (
          <div className="empty-files">
            <Icon name="file" className="empty-icon" />
            <p>Nenhum arquivo cadastrado</p>
          </div>
        ) : (
          <div className="files-grid">
            {files.map((file) => (
              <div key={file.id} className="file-card">
                <div className="file-info">
                  <h4>{file.name}</h4>
                  <p className="file-path">{file.path}</p>
                  {file.isProcessed && (
                    <p className="processed-info">
                      Processado em: {new Date(file.processedAt!).toLocaleString()}
                    </p>
                  )}
                </div>
                <div className="file-actions">
                  {file.isProcessing ? (
                    <div className="processing-status">
                      <div className="spinner"></div>
                      <span>Processando...</span>
                    </div>
                  ) : file.isProcessed ? (
                    <div className="processed-badge">
                      <Icon name="chart" />
                      Processado
                    </div>
                  ) : (
                    <button 
                      className="btn-process"
                      onClick={() => processFile(file)}
                      disabled={isProcessing}
                    >
                      <Icon name="code" />
                      Processar
                    </button>
                  )}
                  <button 
                    className="btn-remove"
                    onClick={() => removeFile(file.id)}
                    disabled={file.isProcessing}
                  >
                    Remover
                  </button>
                </div>
              </div>
          ))}
        </div>
        )}
      </div>
    </div>
  );
};

// Componente Dashboard Principal
const Dashboard: React.FC<{ 
  data: CodeMetricsData | null;
  processedFiles: {[key: string]: CodeMetricsData};
  selectedFile: string;
  onFileSelect: (fileName: string) => void;
}> = ({ data, processedFiles, selectedFile, onFileSelect }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('pt-BR').format(num);
  };

  const getStatusClass = (complexity: number): string => {
    if (complexity > 100) return 'shipped';
    if (complexity > 50) return 'processing';
    return 'delivered';
  };

  const getStatusText = (complexity: number): string => {
    if (complexity > 100) return 'High';
    if (complexity > 50) return 'Medium';
    return 'Low';
  };

  // Cálculos de paginação
  const totalItems = data?.files.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = data?.files.slice(startIndex, endIndex) || [];

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const goToPrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  if (!data) {
    return (
      <div className="dashboard-empty">
        <div className="empty-content">
          <Icon name="file" className="empty-icon" />
          <h2>Nenhum arquivo processado</h2>
          <p>Cadastre e processe um arquivo para visualizar as métricas</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Cards de Métricas Principais */}
      <div className="metrics-cards">
        <div className="metric-card">
          <div className="metric-content">
            <div className="metric-header">
              <span className="metric-title">Files</span>
              <div className="metric-icon files">
                <Icon name="file" />
              </div>
            </div>
            <div className="metric-value">{formatNumber(data.metadata.totalFiles)}</div>
            <div className="metric-footer">
              <span className="metric-subtitle">Arquivos analisados</span>
              <span className="metric-change positive">↑ 100%</span>
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-content">
            <div className="metric-header">
              <span className="metric-title">Lines</span>
              <div className="metric-icon revenue">
                <Icon name="code" />
              </div>
            </div>
            <div className="metric-value">{formatNumber(data.metadata.totalLines)}</div>
            <div className="metric-footer">
              <span className="metric-subtitle">Linhas de código</span>
              <span className="metric-change positive">↑ 15.2%</span>
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-content">
            <div className="metric-header">
              <span className="metric-title">Code</span>
              <div className="metric-icon views">
                <Icon name="chart" />
              </div>
            </div>
            <div className="metric-value">{formatNumber(data.summary.byLanguage[0]?.code || 0)}</div>
            <div className="metric-footer">
              <span className="metric-subtitle">Linhas efetivas</span>
              <span className="metric-change positive">↑ 8.1%</span>
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-content">
            <div className="metric-header">
              <span className="metric-title">Blanks</span>
              <div className="metric-icon blanks">
                <Icon name="file" />
              </div>
            </div>
            <div className="metric-value">{formatNumber(data.summary.byLanguage[0]?.blanks || 0)}</div>
            <div className="metric-footer">
              <span className="metric-subtitle">Linhas em branco</span>
              <span className="metric-change positive">↑ 5.1%</span>
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-content">
            <div className="metric-header">
              <span className="metric-title">Comments</span>
              <div className="metric-icon comments">
                <Icon name="chart" />
              </div>
            </div>
            <div className="metric-value">{formatNumber(data.summary.byLanguage[0]?.comments || 0)}</div>
            <div className="metric-footer">
              <span className="metric-subtitle">Linhas de comentários</span>
              <span className="metric-change positive">↑ 3.7%</span>
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-content">
            <div className="metric-header">
              <span className="metric-title">Complexity</span>
              <div className="metric-icon profit">
                <Icon name="code" />
              </div>
            </div>
            <div className="metric-value">{formatNumber(data.summary.byLanguage[0]?.complexity || 0)}</div>
            <div className="metric-footer">
              <span className="metric-subtitle">Complexidade total</span>
              <span className="metric-change negative">↓ 2.3%</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Header com linguagem em destaque - movido para baixo dos cards */}
      <div className="language-highlight">
        <div className="language-info">
          <div className="language-badge">
            <span>Language: C#</span>
          </div>
          <div className="file-info">
            <span>Arquivo: {data.metadata.sourceFile}</span>
          </div>
        </div>
        {Object.keys(processedFiles).length > 1 && (
          <div className="file-selector">
            <label htmlFor="file-select">Selecionar Arquivo:</label>
            <select 
              id="file-select"
              value={selectedFile}
              onChange={(e) => onFileSelect(e.target.value)}
              className="file-select"
            >
              {Object.keys(processedFiles).map(fileName => (
                <option key={fileName} value={fileName}>
                  {fileName}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
      
      {/* Tabela de Arquivos */}
      <div className="files-section">
        <div className="table-header-bar">
          <h3>Arquivos Analisados</h3>
          <div className="table-actions">
            <input type="text" placeholder="Search Here" className="search-input" />
            <button className="sort-button">
              Sort By <Icon name="chart" />
            </button>
          </div>
        </div>
        
        <div className="modern-table">
          <div className="table-headers">
            <div className="header-cell">Arquivo</div>
            <div className="header-cell">Lines</div>
            <div className="header-cell">Blanks</div>
            <div className="header-cell">Comments</div>
            <div className="header-cell">Code</div>
            <div className="header-cell">Complexity</div>
          </div>
          
          <div className="table-rows">
            {currentItems.map((file, index) => (
              <div key={startIndex + index} className="table-row-modern">
                <div className="table-cell file-col">
                  <div className="file-icon">
                    <Icon name="file" />
                  </div>
                  <div className="file-details">
                    <div className="file-name-main">{file.path.split('/').pop()}</div>
                    <div className="file-path">{file.path}</div>
                  </div>
                </div>
                <div className="table-cell">{formatNumber(file.lines)}</div>
                <div className="table-cell">{formatNumber(file.blanks)}</div>
                <div className="table-cell">{formatNumber(file.comments)}</div>
                <div className="table-cell">{formatNumber(file.code)}</div>
                <div className="table-cell">{file.complexity}</div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="table-footer">
          <span>Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} Entries</span>
          <div className="pagination">
            <button 
              className={`page-btn ${currentPage === 1 ? 'disabled' : ''}`}
              onClick={goToPrevious}
              disabled={currentPage === 1}
            >
              Prev
            </button>
            
            {/* Páginas anteriores */}
            {currentPage > 2 && (
              <button className="page-btn" onClick={() => goToPage(1)}>
                1
              </button>
            )}
            {currentPage > 3 && <span className="page-dots">...</span>}
            
            {/* Página anterior */}
            {currentPage > 1 && (
              <button className="page-btn" onClick={() => goToPage(currentPage - 1)}>
                {currentPage - 1}
              </button>
            )}
            
            {/* Página atual */}
            <button className="page-btn active">
              {currentPage}
            </button>
            
            {/* Página seguinte */}
            {currentPage < totalPages && (
              <button className="page-btn" onClick={() => goToPage(currentPage + 1)}>
                {currentPage + 1}
              </button>
            )}
            
            {/* Páginas seguintes */}
            {currentPage < totalPages - 2 && <span className="page-dots">...</span>}
            {currentPage < totalPages - 1 && (
              <button className="page-btn" onClick={() => goToPage(totalPages)}>
                {totalPages}
              </button>
            )}
            
            <button 
              className={`page-btn ${currentPage === totalPages ? 'disabled' : ''}`}
              onClick={goToNext}
              disabled={currentPage === totalPages}
            >
              next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

function App() {
  const [activeItem, setActiveItem] = useState('dashboard');
  const [data, setData] = useState<CodeMetricsData | null>(null);
  const [processedFiles, setProcessedFiles] = useState<{[key: string]: CodeMetricsData}>(() => {
    // Carrega dados processados salvos
    const savedData = localStorage.getItem('processedFilesData');
    if (savedData) {
      return JSON.parse(savedData);
    }
    // Dados padrão para demonstração - apenas Fontes_Corp_short.txt processado
    return {
      'Fontes_Corp_short.txt': {
        ...sampleCodeMetricsData,
        metadata: {
          ...sampleCodeMetricsData.metadata,
          sourceFile: 'Fontes_Corp_short.txt',
          generatedAt: new Date().toISOString()
        }
      }
    };
  });
  const [selectedFile, setSelectedFile] = useState<string>('Fontes_Corp_short.txt');

  // Carrega dados do arquivo selecionado
  useEffect(() => {
    if (processedFiles[selectedFile]) {
      setData(processedFiles[selectedFile]);
    }
  }, [selectedFile, processedFiles]);

  // Salva dados processados no localStorage
  useEffect(() => {
    localStorage.setItem('processedFilesData', JSON.stringify(processedFiles));
  }, [processedFiles]);

  const handleFileProcessed = (processedData: CodeMetricsData, fileName: string) => {
    // Salva os dados processados
    setProcessedFiles(prev => ({
      ...prev,
      [fileName]: processedData
    }));
    // Seleciona o arquivo recém-processado
    setSelectedFile(fileName);
    setActiveItem('dashboard'); // Volta para o dashboard após processar
  };

  const renderContent = () => {
    switch (activeItem) {
      case 'dashboard':
        return (
          <Dashboard 
            data={data} 
            processedFiles={processedFiles}
            selectedFile={selectedFile}
            onFileSelect={setSelectedFile}
          />
        );
      case 'files':
        return <FileRegistration onFileProcessed={handleFileProcessed} />;
      default:
        return (
          <Dashboard 
            data={data} 
            processedFiles={processedFiles}
            selectedFile={selectedFile}
            onFileSelect={setSelectedFile}
          />
        );
    }
  };

  return (
    <div className="app">
      <Header />
      <div className="main-content">
        <Sidebar activeItem={activeItem} onItemClick={setActiveItem} />
        <main className="content">
        {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;
