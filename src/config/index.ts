/**
 * Configurações centralizadas da aplicação
 * Implementa padrão Configuration Object para gerenciamento de configurações
 */
export const config = {
  // Informações da aplicação
  app: {
    name: 'CodeStats Dashboard',
    version: '1.0.0',
    environment: (process.env.NODE_ENV as 'development' | 'production' | 'test' | 'staging') || 'development',
  },

  // Configurações de API
  api: {
    baseUrl: process.env.REACT_APP_API_URL || 'http://localhost:3001',
    timeout: parseInt(process.env.REACT_APP_API_TIMEOUT || '30000'),
    retries: 3,
  },

  // Configurações de features
  features: {
    fileUpload: true,
    darkMode: true,
    analytics: false,
    pagination: {
      defaultPageSize: 20,
      pageSizeOptions: [10, 20, 50, 100],
    },
  },

  // Configurações de UI
  ui: {
    theme: {
      primaryColor: '#3b82f6',
      successColor: '#10b981',
      warningColor: '#f59e0b',
      errorColor: '#ef4444',
    },
    animations: {
      duration: 200,
      easing: 'ease-in-out',
    },
  },

  // Configurações de dados
  data: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    supportedFormats: ['.txt', '.csv'],
    cacheExpiration: 5 * 60 * 1000, // 5 minutos
  },

  // Configurações de segurança
  security: {
    maxUploadAttempts: 3,
    allowedFileTypes: ['text/plain', 'text/csv'],
    contentSecurityPolicy: {
      'default-src': ["'self'"],
      'script-src': ["'self'", "'unsafe-inline'"],
      'style-src': ["'self'", "'unsafe-inline'"],
      'img-src': ["'self'", 'data:', 'https:'],
    },
  },
};

/**
 * Validação de configurações
 */
export const validateConfig = (): void => {
  const requiredFields = [
    'app.name',
    'app.version',
    'api.baseUrl',
    'features.fileUpload',
  ];

  requiredFields.forEach(field => {
    const value = field.split('.').reduce((obj: any, key) => obj?.[key], config);
    if (value === undefined || value === null) {
      throw new Error(`Configuração obrigatória não encontrada: ${field}`);
    }
  });
};

/**
 * Configurações específicas por ambiente
 */
export const getEnvironmentConfig = () => {
  switch (config.app.environment) {
    case 'production':
      return {
        ...config,
        api: {
          ...config.api,
          baseUrl: process.env.REACT_APP_API_URL || 'https://api.codestats.com',
        },
        features: {
          ...config.features,
          analytics: true,
        },
      };
    
    case 'staging':
      return {
        ...config,
        api: {
          ...config.api,
          baseUrl: process.env.REACT_APP_API_URL || 'https://staging-api.codestats.com',
        },
      };
    
    case 'development':
    case 'test':
    default:
      return config;
  }
};

export default config;
