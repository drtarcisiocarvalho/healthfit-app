import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";

interface AvatarScan {
  photos: {
    frontal?: string;
    lateral?: string;
    costas?: string;
  };
  measurements: {
    height: number;
    weight: number;
    chest: number;
    waist: number;
    hips: number;
    arms: number;
    legs: number;
  };
  createdAt: string;
}

/**
 * Exporta relatório de progresso em formato HTML (que pode ser convertido para PDF)
 */
export async function exportProgressReport(scans: AvatarScan[]): Promise<void> {
  if (scans.length === 0) {
    throw new Error("Nenhum scan disponível para exportar");
  }

  const latestScan = scans[0];
  const oldestScan = scans[scans.length - 1];

  // Calcular mudanças
  const weightChange = latestScan.measurements.weight - oldestScan.measurements.weight;
  const waistChange = latestScan.measurements.waist - oldestScan.measurements.waist;
  const chestChange = latestScan.measurements.chest - oldestScan.measurements.chest;

  // Gerar HTML do relatório
  const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Relatório de Progresso - HealthFit</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #333;
      background: #f5f5f5;
      padding: 40px 20px;
    }
    
    .container {
      max-width: 800px;
      margin: 0 auto;
      background: white;
      border-radius: 16px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      overflow: hidden;
    }
    
    .header {
      background: linear-gradient(135deg, #0a7ea4 0%, #0d9ec9 100%);
      color: white;
      padding: 40px;
      text-align: center;
    }
    
    .header h1 {
      font-size: 32px;
      margin-bottom: 8px;
    }
    
    .header p {
      font-size: 16px;
      opacity: 0.9;
    }
    
    .content {
      padding: 40px;
    }
    
    .section {
      margin-bottom: 40px;
    }
    
    .section-title {
      font-size: 24px;
      font-weight: 700;
      margin-bottom: 20px;
      color: #0a7ea4;
      border-bottom: 3px solid #0a7ea4;
      padding-bottom: 8px;
    }
    
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }
    
    .stat-card {
      background: #f8f9fa;
      border-radius: 12px;
      padding: 20px;
      text-align: center;
      border: 2px solid #e9ecef;
    }
    
    .stat-label {
      font-size: 14px;
      color: #6c757d;
      margin-bottom: 8px;
    }
    
    .stat-value {
      font-size: 28px;
      font-weight: 700;
      color: #0a7ea4;
    }
    
    .stat-change {
      font-size: 14px;
      font-weight: 600;
      margin-top: 4px;
    }
    
    .stat-change.positive {
      color: #22c55e;
    }
    
    .stat-change.negative {
      color: #ef4444;
    }
    
    .measurements-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }
    
    .measurements-table th,
    .measurements-table td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #e9ecef;
    }
    
    .measurements-table th {
      background: #f8f9fa;
      font-weight: 600;
      color: #495057;
    }
    
    .measurements-table tr:hover {
      background: #f8f9fa;
    }
    
    .footer {
      background: #f8f9fa;
      padding: 30px;
      text-align: center;
      color: #6c757d;
      font-size: 14px;
    }
    
    .footer strong {
      color: #0a7ea4;
    }
    
    @media print {
      body {
        background: white;
        padding: 0;
      }
      
      .container {
        box-shadow: none;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📊 Relatório de Progresso</h1>
      <p>Gerado em ${new Date().toLocaleDateString("pt-BR", { 
        day: "numeric", 
        month: "long", 
        year: "numeric" 
      })}</p>
    </div>
    
    <div class="content">
      <!-- Resumo de Mudanças -->
      <div class="section">
        <h2 class="section-title">Resumo de Mudanças</h2>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-label">Peso</div>
            <div class="stat-value">${latestScan.measurements.weight}kg</div>
            <div class="stat-change ${weightChange < 0 ? 'negative' : 'positive'}">
              ${weightChange > 0 ? '+' : ''}${weightChange.toFixed(1)}kg
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-label">Cintura</div>
            <div class="stat-value">${latestScan.measurements.waist}cm</div>
            <div class="stat-change ${waistChange < 0 ? 'negative' : 'positive'}">
              ${waistChange > 0 ? '+' : ''}${waistChange}cm
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-label">Peito</div>
            <div class="stat-value">${latestScan.measurements.chest}cm</div>
            <div class="stat-change ${chestChange < 0 ? 'negative' : 'positive'}">
              ${chestChange > 0 ? '+' : ''}${chestChange}cm
            </div>
          </div>
        </div>
      </div>
      
      <!-- Medidas Atuais -->
      <div class="section">
        <h2 class="section-title">Medidas Corporais Atuais</h2>
        <table class="measurements-table">
          <thead>
            <tr>
              <th>Medida</th>
              <th>Valor Atual</th>
              <th>Valor Inicial</th>
              <th>Mudança</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Altura</td>
              <td>${latestScan.measurements.height}cm</td>
              <td>${oldestScan.measurements.height}cm</td>
              <td>-</td>
            </tr>
            <tr>
              <td>Peso</td>
              <td>${latestScan.measurements.weight}kg</td>
              <td>${oldestScan.measurements.weight}kg</td>
              <td>${weightChange > 0 ? '+' : ''}${weightChange.toFixed(1)}kg</td>
            </tr>
            <tr>
              <td>Peito</td>
              <td>${latestScan.measurements.chest}cm</td>
              <td>${oldestScan.measurements.chest}cm</td>
              <td>${chestChange > 0 ? '+' : ''}${chestChange}cm</td>
            </tr>
            <tr>
              <td>Cintura</td>
              <td>${latestScan.measurements.waist}cm</td>
              <td>${oldestScan.measurements.waist}cm</td>
              <td>${waistChange > 0 ? '+' : ''}${waistChange}cm</td>
            </tr>
            <tr>
              <td>Quadril</td>
              <td>${latestScan.measurements.hips}cm</td>
              <td>${oldestScan.measurements.hips}cm</td>
              <td>${(latestScan.measurements.hips - oldestScan.measurements.hips) > 0 ? '+' : ''}${latestScan.measurements.hips - oldestScan.measurements.hips}cm</td>
            </tr>
            <tr>
              <td>Braços</td>
              <td>${latestScan.measurements.arms}cm</td>
              <td>${oldestScan.measurements.arms}cm</td>
              <td>${(latestScan.measurements.arms - oldestScan.measurements.arms) > 0 ? '+' : ''}${latestScan.measurements.arms - oldestScan.measurements.arms}cm</td>
            </tr>
            <tr>
              <td>Pernas</td>
              <td>${latestScan.measurements.legs}cm</td>
              <td>${oldestScan.measurements.legs}cm</td>
              <td>${(latestScan.measurements.legs - oldestScan.measurements.legs) > 0 ? '+' : ''}${latestScan.measurements.legs - oldestScan.measurements.legs}cm</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Histórico de Scans -->
      <div class="section">
        <h2 class="section-title">Histórico de Scans</h2>
        <p style="color: #6c757d; margin-bottom: 16px;">
          Total de scans realizados: <strong>${scans.length}</strong>
        </p>
        <p style="color: #6c757d;">
          Período: ${new Date(oldestScan.createdAt).toLocaleDateString("pt-BR")} até ${new Date(latestScan.createdAt).toLocaleDateString("pt-BR")}
        </p>
      </div>
    </div>
    
    <div class="footer">
      <p>Relatório gerado pelo <strong>HealthFit</strong></p>
      <p style="margin-top: 8px;">Continue acompanhando sua evolução!</p>
    </div>
  </div>
</body>
</html>
  `;

  // Salvar HTML temporariamente
  const fileName = `healthfit-relatorio-${Date.now()}.html`;
  const fileUri = `${FileSystem.documentDirectory}${fileName}`;
  
  await FileSystem.writeAsStringAsync(fileUri, html, {
    encoding: FileSystem.EncodingType.UTF8,
  });

  // Compartilhar arquivo
  const isAvailable = await Sharing.isAvailableAsync();
  if (isAvailable) {
    await Sharing.shareAsync(fileUri, {
      mimeType: "text/html",
      dialogTitle: "Compartilhar Relatório de Progresso",
      UTI: "public.html",
    });
  } else {
    throw new Error("Compartilhamento não disponível neste dispositivo");
  }
}
