import { CodeMetricsData } from '../types';

// Dados de exemplo baseados no arquivo Fontes_Corp_short.txt
export const sampleCodeMetricsData: CodeMetricsData = {
  metadata: {
    generatedAt: new Date().toISOString(),
    sourceFile: 'Fontes_Corp_short.txt',
    totalFiles: 24,
    totalLines: 2791797
  },
  summary: {
    byLanguage: [
      {
        language: 'C#',
        files: 15352,
        lines: 2791797,
        blanks: 803965,
        comments: 416722,
        code: 1571110,
        complexity: 101839
      }
    ],
    totals: {
      files: 24,
      lines: 2791797,
      blanks: 803965,
      comments: 416722,
      code: 1571110,
      complexity: 101839
    }
  },
  files: [
    {
      path: '~/com/caixa/backend/zl3001s.cs',
      language: 'C#',
      lines: 17532,
      blanks: 6976,
      comments: 4128,
      code: 6428,
      complexity: 646
    },
    {
      path: '~com/caixa/backend/szemb412.cs',
      language: 'C#',
      lines: 15958,
      blanks: 4876,
      comments: 4957,
      code: 6125,
      complexity: 725
    },
    {
      path: '~com/caixa/backend/szemb302.cs',
      language: 'C#',
      lines: 15367,
      blanks: 4884,
      comments: 4361,
      code: 6122,
      complexity: 636
    },
    {
      path: '~com/caixa/backend/zecpm030.cs',
      language: 'C#',
      lines: 14502,
      blanks: 3983,
      comments: 4559,
      code: 5960,
      complexity: 971
    },
    {
      path: '~com/caixa/backend/zecpt030.cs',
      language: 'C#',
      lines: 14499,
      blanks: 3983,
      comments: 4555,
      code: 5961,
      complexity: 971
    },
    {
      path: '~com/caixa/backend/zecpb030.cs',
      language: 'C#',
      lines: 14493,
      blanks: 3988,
      comments: 4584,
      code: 5921,
      complexity: 959
    },
    {
      path: '~com/caixa/backend/zecps030.cs',
      language: 'C#',
      lines: 13977,
      blanks: 3632,
      comments: 4157,
      code: 6188,
      complexity: 654
    },
    {
      path: '~/com/caixa/backend/zl3610b.cs',
      language: 'C#',
      lines: 13005,
      blanks: 4017,
      comments: 4229,
      code: 4759,
      complexity: 373
    },
    {
      path: '~com/caixa/backend/szcpb113.cs',
      language: 'C#',
      lines: 12181,
      blanks: 3187,
      comments: 3439,
      code: 5555,
      complexity: 449
    },
    {
      path: '~com/caixa/backend/szcpt113.cs',
      language: 'C#',
      lines: 12176,
      blanks: 3186,
      comments: 3439,
      code: 5551,
      complexity: 450
    },
    {
      path: '~com/caixa/backend/zecps000.cs',
      language: 'C#',
      lines: 11083,
      blanks: 3901,
      comments: 3080,
      code: 4102,
      complexity: 872
    },
    {
      path: '~com/caixa/backend/szemb404.cs',
      language: 'C#',
      lines: 10877,
      blanks: 3534,
      comments: 2976,
      code: 4367,
      complexity: 419
    },
    {
      path: '~com/caixa/backend/zecps032.cs',
      language: 'C#',
      lines: 10824,
      blanks: 2468,
      comments: 3711,
      code: 4645,
      complexity: 394
    },
    {
      path: '~com/caixa/backend/szemb410.cs',
      language: 'C#',
      lines: 10546,
      blanks: 3347,
      comments: 2914,
      code: 4285,
      complexity: 428
    },
    {
      path: '~com/caixa/backend/szemb403.cs',
      language: 'C#',
      lines: 10103,
      blanks: 3244,
      comments: 2726,
      code: 4133,
      complexity: 386
    },
    {
      path: '~com/caixa/backend/szcpb200.cs',
      language: 'C#',
      lines: 9886,
      blanks: 2617,
      comments: 3457,
      code: 3812,
      complexity: 430
    },
    {
      path: '~com/caixa/backend/szemb409.cs',
      language: 'C#',
      lines: 9826,
      blanks: 3054,
      comments: 2636,
      code: 4136,
      complexity: 422
    },
    {
      path: '~/com/caixa/backend/zl3810b.cs',
      language: 'C#',
      lines: 9773,
      blanks: 2930,
      comments: 3328,
      code: 3515,
      complexity: 277
    },
    {
      path: '~com/caixa/backend/szemb407.cs',
      language: 'C#',
      lines: 9698,
      blanks: 3110,
      comments: 2603,
      code: 3985,
      complexity: 357
    },
    {
      path: '~com/caixa/backend/rsfis033.cs',
      language: 'C#',
      lines: 9687,
      blanks: 2991,
      comments: 3021,
      code: 3675,
      complexity: 470
    },
    {
      path: '~com/caixa/backend/zecpb011.cs',
      language: 'C#',
      lines: 9555,
      blanks: 2823,
      comments: 3225,
      code: 3507,
      complexity: 971
    },
    {
      path: '~com/caixa/backend/szcpb011.cs',
      language: 'C#',
      lines: 9516,
      blanks: 2552,
      comments: 2565,
      code: 4399,
      complexity: 216
    },
    {
      path: '~com/caixa/backend/szemb415.cs',
      language: 'C#',
      lines: 9468,
      blanks: 3105,
      comments: 2444,
      code: 3919,
      complexity: 419
    },
    {
      path: '~com/caixa/backend/szemb417.cs',
      language: 'C#',
      lines: 9464,
      blanks: 3176,
      comments: 2416,
      code: 3872,
      complexity: 398
    }
  ],
  analytics: {
    topLanguages: [
      {
        language: 'C#',
        files: 15352,
        lines: 2791797,
        blanks: 803965,
        comments: 416722,
        code: 1571110,
        complexity: 101839
      }
    ],
    topFiles: [
      {
        path: '~/com/caixa/backend/zl3001s.cs',
        language: 'C#',
        lines: 17532,
        blanks: 6976,
        comments: 4128,
        code: 6428,
        complexity: 646
      },
      {
        path: '~com/caixa/backend/szemb412.cs',
        language: 'C#',
        lines: 15958,
        blanks: 4876,
        comments: 4957,
        code: 6125,
        complexity: 725
      },
      {
        path: '~com/caixa/backend/szemb302.cs',
        language: 'C#',
        lines: 15367,
        blanks: 4884,
        comments: 4361,
        code: 6122,
        complexity: 636
      },
      {
        path: '~com/caixa/backend/zecpm030.cs',
        language: 'C#',
        lines: 14502,
        blanks: 3983,
        comments: 4559,
        code: 5960,
        complexity: 971
      },
      {
        path: '~com/caixa/backend/zecpt030.cs',
        language: 'C#',
        lines: 14499,
        blanks: 3983,
        comments: 4555,
        code: 5961,
        complexity: 971
      }
    ]
  }
};
