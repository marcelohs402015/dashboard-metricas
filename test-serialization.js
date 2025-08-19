const fs = require('fs');

// Simula as interfaces TypeScript
const interfaces = {
  FileMetrics: {
    path: 'string',
    language: 'string', 
    lines: 'number',
    blanks: 'number',
    comments: 'number',
    code: 'number',
    complexity: 'number'
  },
  LanguageSummary: {
    language: 'string',
    files: 'number',
    lines: 'number',
    blanks: 'number',
    comments: 'number',
    code: 'number',
    complexity: 'number'
  },
  TotalMetrics: {
    files: 'number',
    lines: 'number',
    blanks: 'number',
    comments: 'number',
    code: 'number',
    complexity: 'number'
  },
  CodeMetricsData: {
    metadata: 'object',
    summary: 'LanguageSummary[]',
    files: 'FileMetrics[]',
    analytics: 'object'
  }
};

// Simula o CodeMetricsTransformer
class CodeMetricsTransformer {
  static transformContent(content) {
    try {
      const lines = content.split('\n').filter(line => line.trim());
      
      const result = {
        summary: [],
        files: [],
        totals: null
      };

      let currentSection = 'header';
      
      for (const line of lines) {
        // Identifica seções do arquivo
        if (line.includes('Language') && line.includes('Files')) {
          currentSection = 'summary';
          continue;
        }
        
        if (line.includes('Total')) {
          currentSection = 'totals';
          continue;
        }

        // Parse das linhas de resumo por linguagem
        if (currentSection === 'summary' && this.isLanguageSummary(line)) {
          const languageData = this.parseLanguageSummary(line);
          if (languageData) {
            result.summary.push(languageData);
          }
        }
        
        // Parse das linhas de arquivos individuais
        if (this.isFileLine(line)) {
          const fileData = this.parseFileLine(line);
          if (fileData) {
            result.files.push(fileData);
          }
        }
      }

      // Estrutura os dados finais
      const structuredData = this.structureData(result);
      
      return {
        success: true,
        data: structuredData
      };
      
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  static isLanguageSummary(line) {
    const trimmed = line.trim();
    return /^[A-Za-z#+]+\s+[0-9]+\s+[0-9]+\s+[0-9]+\s+[0-9]+\s+[0-9]+\s+[0-9]+$/.test(trimmed);
  }

  static parseLanguageSummary(line) {
    const parts = line.trim().split(/\s+/);
    console.log('Parseando linha de linguagem:', line);
    console.log('Partes encontradas:', parts);
    
    if (parts.length >= 7) {
      return {
        language: parts[0],
        files: parseInt(parts[1]),
        lines: parseInt(parts[2]),
        blanks: parseInt(parts[3]),
        comments: parseInt(parts[4]),
        code: parseInt(parts[5]),
        complexity: parseInt(parts[6])
      };
    }
    return null;
  }

  static isFileLine(line) {
    const trimmed = line.trim();
    return trimmed.includes('~') && trimmed.includes('.cs') && !trimmed.includes('Total');
  }

  static parseFileLine(line) {
    console.log('Parseando linha de arquivo:', line);
    
    const trimmedLine = line.trim();
    const parts = trimmedLine.split(/\s+/);
    
    if (parts.length >= 6) {
      const metrics = parts.slice(-5).map(Number);
      const filePath = parts.slice(0, -5).join(' ');
      
      console.log('Caminho do arquivo:', filePath);
      console.log('Métricas:', metrics);
      
      return {
        path: filePath,
        language: this.detectLanguage(filePath),
        lines: metrics[0],
        blanks: metrics[1],
        comments: metrics[2],
        code: metrics[3],
        complexity: metrics[4]
      };
    }
    
    console.log('Não conseguiu extrair métricas da linha');
    return null;
  }

  static detectLanguage(filePath) {
    if (filePath.includes('.cs')) return 'C#';
    if (filePath.includes('.js')) return 'JavaScript';
    if (filePath.includes('.ts')) return 'TypeScript';
    if (filePath.includes('.py')) return 'Python';
    return 'Unknown';
  }

  static structureData(parsedData) {
    const analytics = this.generateAnalytics(parsedData);
    
    return {
      metadata: {
        uploadDate: new Date().toISOString(),
        totalFiles: parsedData.files.length,
        totalLanguages: parsedData.summary.length
      },
      summary: parsedData.summary,
      files: parsedData.files,
      analytics: analytics
    };
  }

  static generateAnalytics(data) {
    const topFilesByLines = [...data.files]
      .sort((a, b) => b.lines - a.lines)
      .slice(0, 5)
      .map(file => ({
        name: file.path.split('/').pop(),
        lines: file.lines,
        path: file.path
      }));

    const languageDistribution = data.summary.map(lang => ({
      language: lang.language,
      files: lang.files,
      lines: lang.lines,
      percentage: ((lang.files / data.files.length) * 100).toFixed(1)
    }));

    return {
      topFilesByLines,
      languageDistribution,
      totalMetrics: {
        files: data.files.length,
        lines: data.files.reduce((sum, file) => sum + file.lines, 0),
        code: data.files.reduce((sum, file) => sum + file.code, 0),
        comments: data.files.reduce((sum, file) => sum + file.comments, 0),
        complexity: data.files.reduce((sum, file) => sum + file.complexity, 0)
      }
    };
  }
}

// Teste principal
console.log('🧪 TESTE DE SERIALIZAÇÃO DO ARQUIVO Fontes_Corp_short.txt');
console.log('=' .repeat(60));

try {
  // Lê o arquivo
  const content = fs.readFileSync('data/Fontes_Corp_short.txt', 'utf8');
  console.log('✅ Arquivo lido com sucesso');
  console.log(`📄 Tamanho: ${content.length} caracteres`);
  console.log(`📝 Linhas: ${content.split('\n').length}`);
  
  // Testa a transformação
  console.log('\n🔄 Iniciando transformação...');
  const result = CodeMetricsTransformer.transformContent(content);
  
  if (result.success) {
    console.log('✅ Transformação realizada com sucesso!');
    
    const data = result.data;
    console.log('\n📊 RESULTADO DA SERIALIZAÇÃO:');
    console.log('=' .repeat(40));
    
    console.log(`📁 Total de arquivos: ${data.files.length}`);
    console.log(`🌐 Total de linguagens: ${data.summary.length}`);
    console.log(`📅 Data de upload: ${data.metadata.uploadDate}`);
    
    console.log('\n🌐 RESUMO POR LINGUAGEM:');
    data.summary.forEach(lang => {
      console.log(`  ${lang.language}: ${lang.files} arquivos, ${lang.lines.toLocaleString()} linhas`);
    });
    
    console.log('\n📁 TOP 5 ARQUIVOS POR LINHAS:');
    data.analytics.topFilesByLines.forEach((file, index) => {
      console.log(`  ${index + 1}. ${file.name}: ${file.lines.toLocaleString()} linhas`);
    });
    
    console.log('\n📈 MÉTRICAS TOTAIS:');
    const totals = data.analytics.totalMetrics;
    console.log(`  Arquivos: ${totals.files}`);
    console.log(`  Linhas: ${totals.lines.toLocaleString()}`);
    console.log(`  Código: ${totals.code.toLocaleString()}`);
    console.log(`  Comentários: ${totals.comments.toLocaleString()}`);
    console.log(`  Complexidade: ${totals.complexity.toLocaleString()}`);
    
    // Testa se o JSON é válido
    const jsonString = JSON.stringify(data, null, 2);
    console.log('\n✅ JSON gerado com sucesso!');
    console.log(`📏 Tamanho do JSON: ${jsonString.length} caracteres`);
    
    // Salva o JSON para verificação
    fs.writeFileSync('dashboard-corp/test-output.json', jsonString);
    console.log('💾 JSON salvo em: dashboard-corp/test-output.json');
    
    console.log('\n🎉 TESTE CONCLUÍDO COM SUCESSO!');
    console.log('O arquivo pode ser serializado corretamente para o dashboard.');
    
  } else {
    console.log('❌ Erro na transformação:', result.error);
  }
  
} catch (error) {
  console.log('❌ Erro durante o teste:', error.message);
}
