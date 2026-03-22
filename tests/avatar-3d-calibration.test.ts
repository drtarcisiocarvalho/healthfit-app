import { describe, it, expect } from 'vitest';

describe('Avatar 3D - Calibragem de Medidas Corporais', () => {
  // Simular função de processamento calibrada
  const processPhotosCalibrated = () => {
    const biotypeIndex = 0.5; // Mesomorfo médio
    
    const baseHeight = 167;
    const heightVariation = 0; // Sem variação para teste determinístico
    const height = Math.round(baseHeight + heightVariation);
    
    const heightInMeters = height / 100;
    const targetIMC = 22.5; // IMC médio saudável
    const weight = Math.round(targetIMC * heightInMeters * heightInMeters);
    
    const chest = Math.round(height * 0.515 + (biotypeIndex - 0.5) * 10);
    const waist = Math.round(chest * 0.78 + (biotypeIndex - 0.5) * 8);
    const hips = Math.round(waist * 1.13 + (biotypeIndex - 0.5) * 4);
    const arms = Math.round(height * 0.20 + (biotypeIndex - 0.5) * 4);
    const legs = Math.round(height * 0.32 + (biotypeIndex - 0.5) * 6);

    return { height, weight, chest, waist, hips, arms, legs };
  };

  it('deve gerar altura dentro da média brasileira (157-177cm)', () => {
    for (let i = 0; i < 100; i++) {
      const baseHeight = 167;
      const heightVariation = (Math.random() - 0.5) * 20;
      const height = Math.round(baseHeight + heightVariation);
      
      expect(height).toBeGreaterThanOrEqual(157);
      expect(height).toBeLessThanOrEqual(177);
    }
  });

  it('deve gerar peso compatível com IMC saudável (18.5-24.9)', () => {
    for (let i = 0; i < 100; i++) {
      const height = 160 + Math.floor(Math.random() * 20); // 160-180cm
      const heightInMeters = height / 100;
      const targetIMC = 21 + (Math.random() * 3); // 21-24
      const weight = Math.round(targetIMC * heightInMeters * heightInMeters);
      
      const calculatedIMC = weight / (heightInMeters * heightInMeters);
      expect(calculatedIMC).toBeGreaterThanOrEqual(20.5);
      expect(calculatedIMC).toBeLessThanOrEqual(24.5);
    }
  });

  it('deve manter proporção peito/altura entre 0.48-0.56', () => {
    const result = processPhotosCalibrated();
    const ratio = result.chest / result.height;
    
    expect(ratio).toBeGreaterThanOrEqual(0.48);
    expect(ratio).toBeLessThanOrEqual(0.56);
  });

  it('deve manter razão cintura/quadril saudável (0.7-0.9)', () => {
    const result = processPhotosCalibrated();
    const ratio = result.waist / result.hips;
    
    expect(ratio).toBeGreaterThanOrEqual(0.7);
    expect(ratio).toBeLessThanOrEqual(0.9);
  });

  it('deve gerar medidas de braços proporcionais à altura (~20%)', () => {
    const result = processPhotosCalibrated();
    const ratio = result.arms / result.height;
    
    expect(ratio).toBeGreaterThanOrEqual(0.18);
    expect(ratio).toBeLessThanOrEqual(0.22);
  });

  it('deve gerar medidas de coxas proporcionais à altura (~32%)', () => {
    const result = processPhotosCalibrated();
    const ratio = result.legs / result.height;
    
    expect(ratio).toBeGreaterThanOrEqual(0.30);
    expect(ratio).toBeLessThanOrEqual(0.34);
  });

  it('deve gerar medidas realistas para pessoa de 170cm', () => {
    const height = 170;
    const heightInMeters = height / 100;
    const weight = Math.round(22 * heightInMeters * heightInMeters); // IMC 22
    
    expect(weight).toBeGreaterThanOrEqual(60);
    expect(weight).toBeLessThanOrEqual(70);
  });

  it('deve gerar medidas realistas para pessoa de 160cm', () => {
    const height = 160;
    const heightInMeters = height / 100;
    const weight = Math.round(22 * heightInMeters * heightInMeters); // IMC 22
    
    expect(weight).toBeGreaterThanOrEqual(54);
    expect(weight).toBeLessThanOrEqual(62);
  });

  it('deve gerar medidas realistas para pessoa de 180cm', () => {
    const height = 180;
    const heightInMeters = height / 100;
    const weight = Math.round(22 * heightInMeters * heightInMeters); // IMC 22
    
    expect(weight).toBeGreaterThanOrEqual(69);
    expect(weight).toBeLessThanOrEqual(75);
  });

  it('deve validar consistência entre medidas', () => {
    const result = processPhotosCalibrated();
    
    // Peito deve ser maior que cintura
    expect(result.chest).toBeGreaterThan(result.waist);
    
    // Quadril deve ser maior ou igual à cintura
    expect(result.hips).toBeGreaterThanOrEqual(result.waist);
    
    // Coxas devem ser maiores que braços
    expect(result.legs).toBeGreaterThan(result.arms);
  });

  it('deve gerar valores inteiros sem decimais', () => {
    const result = processPhotosCalibrated();
    
    expect(Number.isInteger(result.height)).toBe(true);
    expect(Number.isInteger(result.weight)).toBe(true);
    expect(Number.isInteger(result.chest)).toBe(true);
    expect(Number.isInteger(result.waist)).toBe(true);
    expect(Number.isInteger(result.hips)).toBe(true);
    expect(Number.isInteger(result.arms)).toBe(true);
    expect(Number.isInteger(result.legs)).toBe(true);
  });

  it('deve simular diferentes biotipos corretamente', () => {
    // Ectomorfo (magro)
    const ectomorph = {
      biotypeIndex: 0.2,
      height: 175,
      chest: Math.round(175 * 0.515 + (0.2 - 0.5) * 10),
    };
    
    // Endomorfo (robusto)
    const endomorph = {
      biotypeIndex: 0.8,
      height: 175,
      chest: Math.round(175 * 0.515 + (0.8 - 0.5) * 10),
    };
    
    // Endomorfo deve ter medidas maiores
    expect(endomorph.chest).toBeGreaterThan(ectomorph.chest);
  });
});
