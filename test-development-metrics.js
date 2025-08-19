const fs = require('fs');

// Parser para métricas de desenvolvimento
class DevelopmentMetricsParser {
  static parseContent(content) {
    try {
      const lines = content.split('\n').filter(line => line.trim());
      
      const dataTable = this.parseDataTable(lines);
      const estimatedMetrics = this.parseEstimatedMetrics(lines);
      const processingInfo = this.parseProcessingInfo(lines);

      if (!dataTable || !estimatedMetrics || !processingInfo) {
        return {
          success: false,
          error: 'Não foi possível extrair todas as seções necessárias do arquivo'
        };
      }

      const developmentMetrics = {
        dataTable,
        estimatedMetrics,
        processingInfo
      };

      return {
        success: true,
        data: developmentMetrics
      };

    } catch (error) {
      return {
        success: false,
        error: `Erro ao processar métricas de desenvolvimento: ${error.message}`
      };
    }
  }

  static parseDataTable(lines) {
    const dataTable = [];
    let inDataTableSection = false;

    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // Identifica o início da seção de dados
      if (trimmedLine.includes('Plain Text') || trimmedLine.includes('batch.txt')) {
        inDataTableSection = true;
      }

      if (inDataTableSection) {
        const row = this.parseDataTableRow(trimmedLine);
        if (row) {
          dataTable.push(row);
        }

        // Para quando encontrar a linha "Total"
        if (trimmedLine.startsWith('Total')) {
          break;
        }
      }
    }

    return dataTable.length > 0 ? dataTable : null;
  }

  static parseDataTableRow(line) {
    const parts = line.trim().split(/\s+/);
    
    if (parts.length < 2) return null;

    const label = parts[0];
    const values = parts.slice(1).map(val => {
      const num = parseFloat(val);
      return isNaN(num) ? 0 : num;
    });

    return {
      label,
      values
    };
  }

  static parseEstimatedMetrics(lines) {
    const metrics = {};

    for (const line of lines) {
      const trimmedLine = line.trim();
      
      if (trimmedLine.includes('Estimated Cost to Develop')) {
        const match = trimmedLine.match(/\$([\d,]+)/);
        if (match) {
          metrics.costToDevelop = `$${match[1]}`;
        }
      }
      
      if (trimmedLine.includes('Estimated Schedule Effort')) {
        const match = trimmedLine.match(/([\d.]+)\s+months/);
        if (match) {
          metrics.scheduleEffort = `${match[1]} months`;
        }
      }
      
      if (trimmedLine.includes('Estimated People Required')) {
        const match = trimmedLine.match(/([\d.]+)/);
        if (match) {
          metrics.peopleRequired = match[1];
        }
      }
    }

    if (metrics.costToDevelop && metrics.scheduleEffort && metrics.peopleRequired) {
      return metrics;
    }

    return null;
  }

  static parseProcessingInfo(lines) {
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      if (trimmedLine.includes('Processed:')) {
        const bytesMatch = trimmedLine.match(/(\d+)\s+bytes/);
        const mbMatch = trimmedLine.match(/([\d.]+)\s+megabytes/);
        
        if (bytesMatch && mbMatch) {
          return {
            processedBytes: parseInt(bytesMatch[1]),
            processedMegabytes: `${mbMatch[1]} megabytes (SI)`
          };
        }
      }
    }

    return null;
  }

  static isValidDevelopmentMetricsContent(content) {
    const lines = content.split('\n');
    const hasDataTable = lines.some(line => line.includes('Plain Text') || line.includes('batch.txt'));
    const hasEstimatedMetrics = lines.some(line => line.includes('Estimated Cost to Develop'));
    const hasProcessingInfo = lines.some(line => line.includes('Processed:'));

    return hasDataTable && hasEstimatedMetrics && hasProcessingInfo;
  }
}

// Teste do parser de métricas de desenvolvimento
console.log('🧪 TESTE DO PARSER DE MÉTRICAS DE DESENVOLVIMENTO');
console.log('=' .repeat(60));

try {
  // Lê o arquivo de exemplo
  const content = fs.readFileSync('data/development-metrics-example.txt', 'utf8');
  console.log('✅ Arquivo de exemplo lido com sucesso');
  console.log(`📄 Tamanho: ${content.length} caracteres`);
  console.log(`📝 Linhas: ${content.split('\n').length}`);
  
  // Verifica se o conteúdo é válido
  const isValid = DevelopmentMetricsParser.isValidDevelopmentMetricsContent(content);
  console.log(`🔍 Conteúdo válido para métricas de desenvolvimento: ${isValid ? '✅ Sim' : '❌ Não'}`);
  
  if (isValid) {
    // Testa o parser
    console.log('\n🔄 Iniciando parsing...');
    const result = DevelopmentMetricsParser.parseContent(content);
    
    if (result.success) {
      console.log('✅ Parsing realizado com sucesso!');
      
      const data = result.data;
      console.log('\n📊 RESULTADO DO PARSING:');
      console.log('=' .repeat(40));
      
      console.log('\n📋 TABELA DE DADOS:');
      data.dataTable.forEach((row, index) => {
        console.log(`  ${row.label}: [${row.values.join(', ')}]`);
      });
      
      console.log('\n💰 MÉTRICAS ESTIMADAS:');
      console.log(`  Custo: ${data.estimatedMetrics.costToDevelop}`);
      console.log(`  Prazo: ${data.estimatedMetrics.scheduleEffort}`);
      console.log(`  Pessoas: ${data.estimatedMetrics.peopleRequired}`);
      
      console.log('\n📊 INFORMAÇÕES DE PROCESSAMENTO:');
      console.log(`  Bytes: ${data.processingInfo.processedBytes.toLocaleString()}`);
      console.log(`  Tamanho: ${data.processingInfo.processedMegabytes}`);
      
      // Testa se o JSON é válido
      const jsonString = JSON.stringify(data, null, 2);
      console.log('\n✅ JSON gerado com sucesso!');
      console.log(`📏 Tamanho do JSON: ${jsonString.length} caracteres`);
      
      // Salva o JSON para verificação
      fs.writeFileSync('test-development-metrics-output.json', jsonString);
      console.log('💾 JSON salvo em: test-development-metrics-output.json');
      
      console.log('\n🎉 TESTE CONCLUÍDO COM SUCESSO!');
      console.log('O parser de métricas de desenvolvimento está funcionando corretamente.');
      
    } else {
      console.log('❌ Erro no parsing:', result.error);
    }
  } else {
    console.log('❌ O arquivo não contém métricas de desenvolvimento válidas');
  }
  
} catch (error) {
  console.log('❌ Erro durante o teste:', error.message);
}
