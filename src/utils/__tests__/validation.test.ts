import { validateEmail, validatePhone, validateNIT, validateRequired } from '../validation';

describe('validation utils', () => {
  describe('validateEmail', () => {
    it('should return true for valid email addresses', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'test+tag@example.org',
        '123@test.com',
      ];

      validEmails.forEach(email => {
        expect(validateEmail(email)).toBe(true);
      });
    });

    it('should return false for invalid email addresses', () => {
      const invalidEmails = [
        'invalid-email',
        '@example.com',
        'test@',
        'test.example.com',
        '',
        'test@.com',
        'test@example.',
      ];

      invalidEmails.forEach(email => {
        expect(validateEmail(email)).toBe(false);
      });
    });

    it('should handle edge cases', () => {
      expect(validateEmail(null as any)).toBe(false);
      expect(validateEmail(undefined as any)).toBe(false);
      expect(validateEmail(123 as any)).toBe(false);
    });
  });

  describe('validatePhone', () => {
    it('should return true for valid phone numbers', () => {
      const validPhones = [
        '+57 300 123 4567',
        '3001234567',
        '+57-1-234-5678',
        '3109876543',
        '+1 555 123 4567',
      ];

      validPhones.forEach(phone => {
        expect(validatePhone(phone)).toBe(true);
      });
    });

    it('should return false for invalid phone numbers', () => {
      const invalidPhones = [
        '123',
        '123456',
        'abc123456',
        '',
        '+',
        '+57',
      ];

      invalidPhones.forEach(phone => {
        expect(validatePhone(phone)).toBe(false);
      });
    });

    it('should handle edge cases', () => {
      expect(validatePhone(null as any)).toBe(false);
      expect(validatePhone(undefined as any)).toBe(false);
    });
  });

  describe('validateNIT', () => {
    it('should return true for valid NIT numbers', () => {
      const validNITs = [
        '1234567890',
        '123456789',
        '900123456',
        '8001234567',
      ];

      validNITs.forEach(nit => {
        expect(validateNIT(nit)).toBe(true);
      });
    });

    it('should return false for invalid NIT numbers', () => {
      const invalidNITs = [
        '12345678', // Muy corto
        '123456789012345', // Muy largo
        '123abc456', // Contiene letras
        '',
        '123-456-789',
      ];

      invalidNITs.forEach(nit => {
        expect(validateNIT(nit)).toBe(false);
      });
    });

    it('should handle edge cases', () => {
      expect(validateNIT(null as any)).toBe(false);
      expect(validateNIT(undefined as any)).toBe(false);
    });
  });

  describe('validateRequired', () => {
    it('should return true for non-empty strings', () => {
      expect(validateRequired('test')).toBe(true);
      expect(validateRequired('   test   ')).toBe(true);
      expect(validateRequired('123')).toBe(true);
    });

    it('should return false for empty or whitespace-only strings', () => {
      expect(validateRequired('')).toBe(false);
      expect(validateRequired('   ')).toBe(false);
      expect(validateRequired('\t\n')).toBe(false);
    });

    it('should handle edge cases', () => {
      expect(validateRequired(null as any)).toBe(false);
      expect(validateRequired(undefined as any)).toBe(false);
      expect(validateRequired(0 as any)).toBe(false);
      expect(validateRequired(false as any)).toBe(false);
    });
  });
});
