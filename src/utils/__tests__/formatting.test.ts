import { formatCurrency, formatDate, formatPhone, formatNIT, capitalizeFirst } from '../formatting';

describe('formatting utils', () => {
  describe('formatCurrency', () => {
    it('should format numbers as Colombian pesos', () => {
      expect(formatCurrency(1000)).toMatch(/\$\s*1[.,]000/);
      expect(formatCurrency(1234567)).toMatch(/\$\s*1[.,]234[.,]567/);
      expect(formatCurrency(0)).toMatch(/\$\s*0/);
    });

    it('should handle decimal numbers', () => {
      expect(formatCurrency(1000.5)).toMatch(/\$\s*1[.,]000[.,]5/);
      expect(formatCurrency(1234.99)).toMatch(/\$\s*1[.,]234[.,]99/);
    });

    it('should handle edge cases', () => {
      expect(formatCurrency(null as any)).toBe('$0');
      expect(formatCurrency(undefined as any)).toBe('$0');
      expect(formatCurrency(NaN)).toBe('$0');
      expect(formatCurrency('invalid' as any)).toBe('$0');
    });
  });

  describe('formatDate', () => {
    it('should format dates correctly', () => {
      const date = new Date('2024-10-10');
      expect(formatDate(date)).toMatch(/\d{2}\/\d{2}\/2024/);
      
      const dateString = '2024-12-25';
      expect(formatDate(dateString)).toMatch(/\d{2}\/\d{2}\/2024/);
    });

    it('should handle different date formats', () => {
      expect(formatDate('2024-01-01')).toMatch(/\d{2}\/\d{2}\/(2023|2024)/);
      expect(formatDate('2024-12-31')).toMatch(/\d{2}\/\d{2}\/(2023|2024)/);
    });

    it('should handle edge cases', () => {
      expect(formatDate(null as any)).toBe('');
      expect(formatDate(undefined as any)).toBe('');
      expect(formatDate('invalid')).toBe('');
    });
  });

  describe('formatPhone', () => {
    it('should format phone numbers correctly', () => {
      expect(formatPhone('3001234567')).toBe('300 123 4567');
      expect(formatPhone('+573001234567')).toBe('+57 300 123 4567');
      expect(formatPhone('3109876543')).toBe('310 987 6543');
    });

    it('should handle already formatted numbers', () => {
      expect(formatPhone('300 123 4567')).toBe('300 123 4567');
      expect(formatPhone('+57 300 123 4567')).toBe('+57 300 123 4567');
    });

    it('should handle edge cases', () => {
      expect(formatPhone('')).toBe('');
      expect(formatPhone(null as any)).toBe('');
      expect(formatPhone(undefined as any)).toBe('');
    });
  });

  describe('formatNIT', () => {
    it('should format NIT numbers correctly', () => {
      expect(formatNIT('1234567890')).toBe('123.456.789-0');
      expect(formatNIT('123456789')).toBe('123.456.789');
      expect(formatNIT('900123456')).toBe('900.123.456');
    });

    it('should handle already formatted NITs', () => {
      expect(formatNIT('123.456.789-0')).toBe('123.456.789-0');
      expect(formatNIT('123.456.789')).toBe('123.456.789');
    });

    it('should handle edge cases', () => {
      expect(formatNIT('')).toBe('');
      expect(formatNIT(null as any)).toBe('');
      expect(formatNIT(undefined as any)).toBe('');
      expect(formatNIT('123')).toBe('123'); // Muy corto para formatear
    });
  });

  describe('capitalizeFirst', () => {
    it('should capitalize first letter of strings', () => {
      expect(capitalizeFirst('hello')).toBe('Hello');
      expect(capitalizeFirst('world')).toBe('World');
      expect(capitalizeFirst('test string')).toBe('Test string');
    });

    it('should handle already capitalized strings', () => {
      expect(capitalizeFirst('Hello')).toBe('Hello');
      expect(capitalizeFirst('WORLD')).toBe('WORLD');
    });

    it('should handle edge cases', () => {
      expect(capitalizeFirst('')).toBe('');
      expect(capitalizeFirst(null as any)).toBe('');
      expect(capitalizeFirst(undefined as any)).toBe('');
    });
  });
});
