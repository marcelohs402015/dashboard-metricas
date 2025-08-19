import React from 'react';
import { DevelopmentMetricsCard } from './DevelopmentMetricsCard';
import { sampleDevelopmentMetrics } from '../data/sampleDevelopmentMetrics';

const DevelopmentMetricsPage: React.FC = () => {
  return (
    <div className="development-metrics-page">
      <DevelopmentMetricsCard metrics={sampleDevelopmentMetrics} className="full-screen" />
    </div>
  );
};

export default DevelopmentMetricsPage;
