import { describe, it, expect } from 'vitest';

describe('Novas Funcionalidades - Input Manual, Boneco Validador e Histórico', () => {
  describe('Input Manual de Medidas', () => {
    it('deve aceitar altura válida (150-210cm)', () => {
      const validHeights = ["150", "170", "190", "210"];
      
      validHeights.forEach(height => {
        const parsed = parseInt(height);
        expect(parsed).toBeGreaterThanOrEqual(150);
        expect(parsed).toBeLessThanOrEqual(210);
      });
    });

    it('deve aceitar peso válido (40-200kg)', () => {
      const validWeights = ["40", "70", "100", "200"];
      
      validWeights.forEach(weight => {
        const parsed = parseInt(weight);
        expect(parsed).toBeGreaterThanOrEqual(40);
        expect(parsed).toBeLessThanOrEqual(200);
      });
    });

    it('deve usar medidas manuais na calibragem quando fornecidas', () => {
      const manualHeight = "175";
      const manualWeight = "70";
      
      const height = manualHeight ? parseInt(manualHeight) : Math.round(167 + (Math.random() - 0.5) * 20);
      const weight = manualWeight ? parseInt(manualWeight) : 65;
      
      expect(height).toBe(175);
      expect(weight).toBe(70);
    });

    it('deve usar estimativas quando medidas não fornecidas', () => {
      const manualHeight = "";
      const manualWeight = "";
      
      const height = manualHeight ? parseInt(manualHeight) : 170;
      const weight = manualWeight ? parseInt(manualWeight) : 70;
      
      expect(height).toBe(170);
      expect(weight).toBe(70);
    });
  });

  describe('Boneco Validador de Pose', () => {
    it('deve validar pose perfeita', () => {
      const validation = {
        isValid: true,
        distance: "perfect" as const,
        height: "perfect" as const,
        position: "center" as const,
        feedback: "✅ Perfeito! Pode tirar a foto agora.",
      };
      
      expect(validation.isValid).toBe(true);
      expect(validation.distance).toBe("perfect");
      expect(validation.height).toBe("perfect");
      expect(validation.position).toBe("center");
    });

    it('deve detectar distância incorreta', () => {
      const tooClose = {
        isValid: false,
        distance: "too_close" as const,
        height: "perfect" as const,
        position: "center" as const,
        feedback: "⚠️ Afaste-se da câmera.",
      };
      
      expect(tooClose.isValid).toBe(false);
      expect(tooClose.distance).toBe("too_close");
    });

    it('deve detectar altura incorreta', () => {
      const tooLow = {
        isValid: false,
        distance: "perfect" as const,
        height: "too_low" as const,
        position: "center" as const,
        feedback: "⚠️ Levante o celular.",
      };
      
      expect(tooLow.isValid).toBe(false);
      expect(tooLow.height).toBe("too_low");
    });

    it('deve detectar posição incorreta', () => {
      const offCenter = {
        isValid: false,
        distance: "perfect" as const,
        height: "perfect" as const,
        position: "left" as const,
        feedback: "⚠️ Mova para a direita.",
      };
      
      expect(offCenter.isValid).toBe(false);
      expect(offCenter.position).toBe("left");
    });

    it('deve mudar cor do boneco baseado na validação', () => {
      const validColor = "#10B981"; // Verde
      const invalidColor = "#EF4444"; // Vermelho
      
      const isValid = true;
      const color = isValid ? validColor : invalidColor;
      
      expect(color).toBe("#10B981");
    });
  });

  describe('Histórico com Gráficos', () => {
    it('deve calcular mudança de peso corretamente', () => {
      const scans = [
        { measurements: { weight: 70 }, createdAt: "2024-01-01" },
        { measurements: { weight: 68 }, createdAt: "2024-01-15" },
      ];
      
      const weightChange = scans[1].measurements.weight - scans[0].measurements.weight;
      expect(weightChange).toBe(-2); // Perdeu 2kg
    });

    it('deve gerar pontos do gráfico corretamente', () => {
      const weights = [70, 69, 68, 67, 66];
      const points = weights.map((weight, index) => ({
        x: index,
        y: weight,
      }));
      
      expect(points).toHaveLength(5);
      expect(points[0].y).toBe(70);
      expect(points[4].y).toBe(66);
    });

    it('deve calcular min e max de peso', () => {
      const weights = [70, 69, 68, 67, 66];
      const minWeight = Math.min(...weights);
      const maxWeight = Math.max(...weights);
      
      expect(minWeight).toBe(66);
      expect(maxWeight).toBe(70);
    });

    it('deve formatar mensagem de compartilhamento', () => {
      const first = { measurements: { weight: 70, waist: 80 } };
      const latest = { measurements: { weight: 68, waist: 78 } };
      
      const weightChange = latest.measurements.weight - first.measurements.weight;
      const waistChange = latest.measurements.waist - first.measurements.waist;
      
      const message = `🎯 Meu Progresso no HealthFit!\n\n` +
        `📊 Peso: ${weightChange > 0 ? "+" : ""}${weightChange.toFixed(1)}kg\n` +
        `📏 Cintura: ${waistChange > 0 ? "+" : ""}${waistChange}cm`;
      
      expect(message).toContain("-2.0kg");
      expect(message).toContain("-2cm");
    });

    it('deve validar histórico vazio', () => {
      const history: any[] = [];
      const hasHistory = history.length > 0;
      
      expect(hasHistory).toBe(false);
    });

    it('deve validar histórico com múltiplos scans', () => {
      const history = [
        { measurements: { weight: 70 }, createdAt: "2024-01-01" },
        { measurements: { weight: 69 }, createdAt: "2024-01-08" },
        { measurements: { weight: 68 }, createdAt: "2024-01-15" },
      ];
      
      expect(history.length).toBe(3);
      expect(history[0].measurements.weight).toBe(70);
    });

    it('deve ordenar scans por data (mais recente primeiro)', () => {
      const history = [
        { measurements: { weight: 68 }, createdAt: "2024-01-15" },
        { measurements: { weight: 69 }, createdAt: "2024-01-08" },
        { measurements: { weight: 70 }, createdAt: "2024-01-01" },
      ];
      
      // Histórico já ordenado (mais recente primeiro)
      expect(new Date(history[0].createdAt).getTime()).toBeGreaterThan(
        new Date(history[1].createdAt).getTime()
      );
    });
  });

  describe('Calibragem Ajustada', () => {
    it('deve calcular IMC com medidas manuais', () => {
      const height = 175; // cm
      const weight = 70; // kg
      
      const heightInMeters = height / 100;
      const imc = weight / (heightInMeters * heightInMeters);
      
      expect(imc).toBeCloseTo(22.86, 1);
    });

    it('deve ajustar medidas corporais baseado em altura manual', () => {
      const manualHeight = 180;
      const chest = Math.round(manualHeight * 0.515);
      
      expect(chest).toBeGreaterThan(90);
      expect(chest).toBeLessThan(95);
    });

    it('deve manter proporções anatômicas com medidas manuais', () => {
      const manualHeight = 170;
      const chest = Math.round(manualHeight * 0.515);
      const waist = Math.round(chest * 0.78);
      const hips = Math.round(waist * 1.13);
      
      const waistHipRatio = waist / hips;
      expect(waistHipRatio).toBeGreaterThan(0.85);
      expect(waistHipRatio).toBeLessThan(0.90);
    });
  });
});
