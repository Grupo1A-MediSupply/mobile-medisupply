import { 
  formatCurrency, 
  formatDate, 
  formatDateTime,
  formatPhone, 
  formatNIT, 
  capitalizeFirst,
  capitalizeWords,
  formatNumber,
  truncateText,
  formatOrderStatus,
  formatVisitStatus,
  formatPriority,
} from '../formatting';

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

    it('should handle string numbers', () => {
      expect(formatCurrency('1000')).toMatch(/\$\s*1[.,]000/);
      expect(formatCurrency('1234.56')).toMatch(/\$\s*1[.,]234[.,]56/);
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

  describe('formatDateTime', () => {
    it('should format date and time correctly', () => {
      const date = new Date('2024-10-10T14:30:00');
      const result = formatDateTime(date);
      expect(result).toMatch(/\d{2}\/\d{2}\/2024 14:30/);
    });

    it('should handle date strings', () => {
      const result = formatDateTime('2024-12-25T10:15:00');
      expect(result).toMatch(/\d{2}\/\d{2}\/2024 10:15/);
    });

    it('should handle edge cases', () => {
      expect(formatDateTime(null as any)).toBe('');
      expect(formatDateTime(undefined as any)).toBe('');
      expect(formatDateTime('invalid')).toBe('');
    });
  });

  describe('formatPhone', () => {
    it('should format phone numbers correctly', () => {
      expect(formatPhone('3001234567')).toBe('300 123 4567');
      expect(formatPhone('+573001234567')).toBe('+57 300 123 4567');
      expect(formatPhone('3109876543')).toBe('310 987 6543');
    });

    it('should handle edge cases', () => {
      expect(formatPhone('')).toBe('');
      expect(formatPhone(null as any)).toBe('');
      expect(formatPhone(undefined as any)).toBe('');
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
      expect(formatNIT('123-456-789')).toBe('123-456-789');
    });

    it('should handle edge cases', () => {
      expect(formatNIT('')).toBe('');
      expect(formatNIT(null as any)).toBe('');
      expect(formatNIT(undefined as any)).toBe('');
      expect(formatNIT('123')).toBe('123'); // Muy corto para formatear
    });

    it('should handle NITs with more than 10 digits', () => {
      expect(formatNIT('123456789012')).toContain('.');
      expect(formatNIT('123456789012345')).toContain('.');
    });

    it('should handle NITs with non-numeric characters', () => {
      // Si ya está formateado con guiones, se retorna tal cual
      expect(formatNIT('123-456-789-0')).toBe('123-456-789-0');
      // Pero si viene sin formatear, se formatea con puntos
      expect(formatNIT('1234567890')).toBe('123.456.789-0');
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

  describe('capitalizeWords', () => {
    it('should capitalize first letter of each word', () => {
      expect(capitalizeWords('hello world')).toBe('Hello World');
      expect(capitalizeWords('test string example')).toBe('Test String Example');
    });

    it('should handle edge cases', () => {
      expect(capitalizeWords('')).toBe('');
      expect(capitalizeWords(null as any)).toBe('');
      expect(capitalizeWords(undefined as any)).toBe('');
    });
  });

  describe('formatNumber', () => {
    it('should format numbers with thousand separators', () => {
      expect(formatNumber(1000)).toMatch(/1[.,]000/);
      expect(formatNumber(1234567)).toMatch(/1[.,]234[.,]567/);
    });

    it('should handle edge cases', () => {
      expect(formatNumber(null as any)).toBe('0');
      expect(formatNumber(undefined as any)).toBe('0');
      expect(formatNumber('invalid' as any)).toBe('0');
    });
  });

  describe('truncateText', () => {
    it('should truncate long text', () => {
      expect(truncateText('Hello World', 5)).toBe('Hello...');
      expect(truncateText('Test', 10)).toBe('Test');
    });

    it('should handle edge cases', () => {
      expect(truncateText('', 10)).toBe('');
      expect(truncateText(null as any, 10)).toBe('');
      expect(truncateText(undefined as any, 10)).toBe('');
    });
  });

  describe('formatOrderStatus', () => {
    it('should format order status correctly', () => {
      const result1 = formatOrderStatus('pending');
      expect(result1).toBeTruthy();
      expect(typeof result1).toBe('string');
      
      const result2 = formatOrderStatus('completed');
      expect(result2).toBeTruthy();
      
      const result3 = formatOrderStatus('cancelled');
      expect(result3).toBeTruthy();
      
      // Test with other statuses
      expect(formatOrderStatus('processing')).toBeTruthy();
      expect(formatOrderStatus('shipped')).toBeTruthy();
      expect(formatOrderStatus('delivered')).toBeTruthy();
    });
  });

  describe('formatVisitStatus', () => {
    it('should format visit status correctly', () => {
      const result1 = formatVisitStatus('pending');
      expect(result1).toBeTruthy();
      expect(typeof result1).toBe('string');
      
      const result2 = formatVisitStatus('in-progress');
      expect(result2).toBeTruthy();
      
      const result3 = formatVisitStatus('completed');
      expect(result3).toBeTruthy();
    });
  });

  describe('formatPriority', () => {
    it('should format priority correctly', () => {
      const result1 = formatPriority('high');
      expect(result1).toBeTruthy();
      expect(typeof result1).toBe('string');
      
      const result2 = formatPriority('medium');
      expect(result2).toBeTruthy();
      
      const result3 = formatPriority('low');
      expect(result3).toBeTruthy();
    });
  });

  describe('formatPhone additional cases', () => {
    it('should handle phones starting with 57', () => {
      expect(formatPhone('573001234567')).toBe('+57 300 123 4567');
    });
  });

  describe('formatNIT additional cases', () => {
    it('should handle NITs with more than 10 digits', () => {
      expect(formatNIT('123456789012')).toContain('.');
    });
  });
});
