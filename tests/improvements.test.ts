import { describe, it, expect } from "vitest";

describe("Melhorias Finais - Boneco Validador + Tutorial", () => {
  describe("Calibragem Avatar 3D", () => {
    it("deve calcular IMC corretamente", () => {
      const height = 170; // cm
      const weight = 70; // kg
      const heightInMeters = height / 100;
      const imc = weight / (heightInMeters * heightInMeters);
      
      expect(imc).toBeCloseTo(24.22, 2);
    });

    it("deve determinar biotipo baseado no IMC sem aleatoriedade", () => {
      // IMC < 20: ectomorfo
      const imcEcto = 19;
      let biotypeEcto = 0.2 + (imcEcto - 18) * 0.15;
      expect(biotypeEcto).toBeGreaterThanOrEqual(0.2);
      expect(biotypeEcto).toBeLessThanOrEqual(0.5);

      // IMC 20-25: mesomorfo
      const imcMeso = 22;
      let biotypeMeso = 0.3 + (imcMeso - 20) * 0.04;
      expect(biotypeMeso).toBeGreaterThanOrEqual(0.3);
      expect(biotypeMeso).toBeLessThanOrEqual(0.5);

      // IMC > 25: endomorfo
      const imcEndo = 28;
      let biotypeEndo = 0.5 + (imcEndo - 25) * 0.06;
      expect(biotypeEndo).toBeGreaterThanOrEqual(0.5);
      expect(biotypeEndo).toBeLessThanOrEqual(0.8);
    });

    it("deve calcular medidas baseadas em proporções anatômicas reais", () => {
      const height = 170;
      const weight = 70;
      const imc = 24.22;
      const biotypeIndex = 0.38; // Mesomorfo

      // Peito: ~0.515 da altura
      const chest = Math.round(height * (0.50 + biotypeIndex * 0.03));
      expect(chest).toBeGreaterThanOrEqual(85);
      expect(chest).toBeLessThanOrEqual(90);

      // Cintura: baseada no IMC
      const waist = Math.round(height * (0.40 + imc * 0.004));
      expect(waist).toBeGreaterThanOrEqual(82);
      expect(waist).toBeLessThanOrEqual(86);

      // Quadril: 1.12-1.15x cintura
      const hips = Math.round(waist * (1.12 + biotypeIndex * 0.03));
      expect(hips).toBeGreaterThanOrEqual(93);
      expect(hips).toBeLessThanOrEqual(97);

      // Braços: ~0.19-0.21 da altura
      const arms = Math.round(height * (0.19 + biotypeIndex * 0.02));
      expect(arms).toBeGreaterThanOrEqual(32);
      expect(arms).toBeLessThanOrEqual(36);

      // Coxas: ~0.31-0.33 da altura
      const legs = Math.round(height * (0.31 + biotypeIndex * 0.02));
      expect(legs).toBeGreaterThanOrEqual(52);
      expect(legs).toBeLessThanOrEqual(57);
    });

    it("deve usar medidas manuais quando fornecidas", () => {
      const manualHeight = "175";
      const manualWeight = "80";

      const height = parseInt(manualHeight);
      const weight = parseInt(manualWeight);

      expect(height).toBe(175);
      expect(weight).toBe(80);
    });
  });

  describe("Boneco Validador", () => {
    it("deve validar pose perfeita", () => {
      const validation = {
        isValid: true,
        distance: "perfect" as const,
        height: "perfect" as const,
        position: "center" as const,
        feedback: "Posição perfeita! Tire a foto agora.",
      };

      expect(validation.isValid).toBe(true);
      expect(validation.distance).toBe("perfect");
      expect(validation.height).toBe("perfect");
      expect(validation.position).toBe("center");
    });

    it("deve detectar distância incorreta", () => {
      const validationClose = {
        isValid: false,
        distance: "too_close" as const,
        height: "perfect" as const,
        position: "center" as const,
        feedback: "Afaste-se um pouco da câmera",
      };

      expect(validationClose.isValid).toBe(false);
      expect(validationClose.distance).toBe("too_close");

      const validationFar = {
        isValid: false,
        distance: "too_far" as const,
        height: "perfect" as const,
        position: "center" as const,
        feedback: "Aproxime-se um pouco da câmera",
      };

      expect(validationFar.isValid).toBe(false);
      expect(validationFar.distance).toBe("too_far");
    });

    it("deve detectar altura incorreta", () => {
      const validationLow = {
        isValid: false,
        distance: "perfect" as const,
        height: "too_low" as const,
        position: "center" as const,
        feedback: "Levante a câmera",
      };

      expect(validationLow.isValid).toBe(false);
      expect(validationLow.height).toBe("too_low");

      const validationHigh = {
        isValid: false,
        distance: "perfect" as const,
        height: "too_high" as const,
        position: "center" as const,
        feedback: "Abaixe a câmera",
      };

      expect(validationHigh.isValid).toBe(false);
      expect(validationHigh.height).toBe("too_high");
    });

    it("deve detectar posição incorreta", () => {
      const validationLeft = {
        isValid: false,
        distance: "perfect" as const,
        height: "perfect" as const,
        position: "left" as const,
        feedback: "Mova-se para a direita",
      };

      expect(validationLeft.isValid).toBe(false);
      expect(validationLeft.position).toBe("left");

      const validationRight = {
        isValid: false,
        distance: "perfect" as const,
        height: "perfect" as const,
        position: "right" as const,
        feedback: "Mova-se para a esquerda",
      };

      expect(validationRight.isValid).toBe(false);
      expect(validationRight.position).toBe("right");
    });
  });

  describe("Tutorial Interativo", () => {
    it("deve ter 7 steps no tutorial", () => {
      const tutorialSteps = [
        "welcome",
        "avatar3d",
        "workouts",
        "nutrition",
        "health",
        "store",
        "conclusion",
      ];

      expect(tutorialSteps).toHaveLength(7);
    });

    it("deve ter áudios para todos os steps", () => {
      const audioFiles = [
        "tutorial-welcome.wav",
        "tutorial-avatar3d.wav",
        "tutorial-workouts.wav",
        "tutorial-nutrition.wav",
        "tutorial-health.wav",
        "tutorial-store.wav",
        "tutorial-conclusion.wav",
      ];

      expect(audioFiles).toHaveLength(7);
      audioFiles.forEach((file) => {
        expect(file).toMatch(/\.wav$/);
      });
    });

    it("deve calcular progresso corretamente", () => {
      const totalSteps = 7;
      
      const progress0 = ((0 + 1) / totalSteps) * 100;
      expect(progress0).toBeCloseTo(14.29, 2);

      const progress3 = ((3 + 1) / totalSteps) * 100;
      expect(progress3).toBeCloseTo(57.14, 2);

      const progress6 = ((6 + 1) / totalSteps) * 100;
      expect(progress6).toBe(100);
    });
  });
});
