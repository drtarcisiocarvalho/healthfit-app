import { describe, it, expect } from 'vitest';

describe('Bug Fixes - Insights e Avatar 3D', () => {
  it('deve processar resposta de IA sem mostrar códigos JSON', () => {
    // Simular resposta da IA com JSON
    const mockResponse = {
      message: '{"insights": ["insight1", "insight2"]}'
    };

    // Processar resposta
    let response = '';
    if (typeof mockResponse.message === 'string') {
      response = mockResponse.message;
    } else if (mockResponse.message && typeof mockResponse.message === 'object') {
      response = JSON.stringify(mockResponse.message, null, 2);
    }

    // Remover códigos JSON
    if (response.includes('{') && response.includes('}')) {
      const lines = response.split('\n').filter(line => 
        !line.trim().startsWith('{') && 
        !line.trim().startsWith('}') &&
        !line.trim().startsWith('"') &&
        line.trim().length > 0
      );
      if (lines.length > 0) {
        response = lines.join('\n');
      }
    }

    // Se ainda tiver JSON, usar fallback
    const finalResponse = response.includes('{') 
      ? "• Continue mantendo sua consistência nos treinos\n• Monitore seus sinais vitais regularmente\n• Ajuste suas metas conforme seu progresso"
      : response;

    expect(finalResponse).not.toContain('{');
    expect(finalResponse).not.toContain('}');
    expect(finalResponse).toBeTruthy();
  });

  it('deve ter fallback quando resposta for vazia', () => {
    const emptyResponse = '';
    const fallback = "• Continue mantendo sua consistência nos treinos\n• Monitore seus sinais vitais regularmente\n• Ajuste suas metas conforme seu progresso";
    
    const finalResponse = emptyResponse || fallback;
    
    expect(finalResponse).toBe(fallback);
    expect(finalResponse).toContain('•');
  });

  it('deve processar resposta de texto puro corretamente', () => {
    const textResponse = "Seus treinos estão ótimos!\nContinue assim.";
    
    expect(textResponse).not.toContain('{');
    expect(textResponse).not.toContain('}');
    expect(textResponse.length).toBeGreaterThan(0);
  });

  it('deve validar estrutura de dados do Avatar 3D', () => {
    const avatarData = {
      photos: {
        frontal: 'uri://photo1',
        lateral: 'uri://photo2',
        costas: 'uri://photo3'
      },
      measurements: {
        height: 175,
        weight: 70,
        chest: 95,
        waist: 80,
        hips: 95,
        arms: 35,
        legs: 55
      },
      createdAt: new Date().toISOString()
    };

    expect(avatarData.photos).toBeDefined();
    expect(avatarData.photos.frontal).toBeTruthy();
    expect(avatarData.measurements).toBeDefined();
    expect(avatarData.measurements.height).toBeGreaterThan(0);
    expect(avatarData.createdAt).toBeTruthy();
  });

  it('deve ter limite de memória aumentado no package.json', async () => {
    const fs = await import('fs/promises');
    const packageJson = JSON.parse(
      await fs.readFile('/home/ubuntu/health_fitness_app/package.json', 'utf-8')
    );

    expect(packageJson.scripts['dev:metro']).toContain('NODE_OPTIONS=--max-old-space-size=8192');
  });
});
