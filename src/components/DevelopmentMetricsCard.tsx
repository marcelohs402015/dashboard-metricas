import React from 'react';
import { DevelopmentMetrics } from '../types';

interface DevelopmentMetricsCardProps {
  metrics: DevelopmentMetrics;
  className?: string;
}

export const DevelopmentMetricsCard: React.FC<DevelopmentMetricsCardProps> = ({ 
  metrics, 
  className = '' 
}) => {
  const formatCurrency = (value: string) => {
    const numericValue = value.replace(/[$,]/g, '');
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'USD'
    }).format(parseFloat(numericValue));
  };

  return (
    <div className={`metrics-summary-card ${className}`}>
      {/* Estimativas de Desenvolvimento */}
      <div className="metrics-section">
        <h3 className="section-title">Estimativas de Desenvolvimento</h3>
        <div className="metrics-grid">
          <div className="metric-item">
            <div className="metric-icon">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div className="metric-content">
              <div className="metric-label">Custo Estimado</div>
              <div className="metric-value cost-value">
                {formatCurrency(metrics.estimatedMetrics.costToDevelop)}
              </div>
            </div>
          </div>

          <div className="metric-item">
            <div className="metric-icon">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="metric-content">
              <div className="metric-label">Prazo Estimado</div>
              <div className="metric-value schedule-value">
                {metrics.estimatedMetrics.scheduleEffort}
              </div>
            </div>
          </div>

          <div className="metric-item">
            <div className="metric-icon">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="metric-content">
              <div className="metric-label">Pessoas Necessárias</div>
              <div className="metric-value people-value">
                {metrics.estimatedMetrics.peopleRequired}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Informações de Processamento */}
      <div className="metrics-section">
        <h3 className="section-title">Informações de Processamento</h3>
        <div className="processing-info">
          <div className="info-item">
            <span className="info-label">Dados Processados:</span>
            <span className="info-value">
              {metrics.processingInfo.processedBytes.toLocaleString()} bytes
            </span>
          </div>
          <div className="info-item">
            <span className="info-label">Tamanho:</span>
            <span className="info-value">
              {metrics.processingInfo.processedMegabytes}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
