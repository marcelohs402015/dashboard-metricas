import { DevelopmentMetrics } from '../types';

export const sampleDevelopmentMetrics: DevelopmentMetrics = {
  dataTable: [
    {
      label: "Plain Text",
      values: [1, 0, 0, 0, 0, 0]
    },
    {
      label: "batch.txt",
      values: [0, 0, 0, 0, 0]
    },
    {
      label: "Total",
      values: [40, 7175, 463, 837, 5875, 5]
    }
  ],
  estimatedMetrics: {
    costToDevelop: "$173,401",
    scheduleEffort: "7.07 months",
    peopleRequired: "2.18"
  },
  processingInfo: {
    processedBytes: 409509,
    processedMegabytes: "0.410 megabytes (SI)"
  }
};
