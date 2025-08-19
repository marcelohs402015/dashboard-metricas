// Configurações da aplicação
export const AppConfig = {
  // Informações básicas
  title: 'Dashboard Corporativo',
  version: '1.0.0',
  environment: process.env.NODE_ENV || 'development',
  
  // Configurações de API
  api: {
    baseUrl: process.env.REACT_APP_API_URL || 'http://localhost:3001',
    timeout: parseInt(process.env.REACT_APP_API_TIMEOUT || '5000'),
  },
  
  // Configurações de tema
  theme: {
    primaryColor: '#3b82f6',
    secondaryColor: '#6b7280',
    backgroundColor: '#f8fafc',
    headerColor: '#374151',
    sidebarColor: '#f3f4f6',
  },
  
  // Configurações de gráfico
  chart: {
    animationDuration: 1500,
    pointRadius: 4,
    lineWidth: 3,
    gridColor: '#f3f4f6',
  },
  
  // Configurações de responsividade
  breakpoints: {
    mobile: 640,
    tablet: 768,
    desktop: 1024,
    large: 1280,
  },
  
  // Configurações de performance
  performance: {
    debounceDelay: 300,
    throttleDelay: 100,
    maxItemsPerPage: 50,
  },
};

// Tipos de configuração
export interface AppConfigType {
  title: string;
  version: string;
  environment: string;
  api: {
    baseUrl: string;
    timeout: number;
  };
  theme: {
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    headerColor: string;
    sidebarColor: string;
  };
  chart: {
    animationDuration: number;
    pointRadius: number;
    lineWidth: number;
    gridColor: string;
  };
  breakpoints: {
    mobile: number;
    tablet: number;
    desktop: number;
    large: number;
  };
  performance: {
    debounceDelay: number;
    throttleDelay: number;
    maxItemsPerPage: number;
  };
}
