/**
 * Utilidades de validación para la aplicación MediSupply
 */

/**
 * Valida si un email tiene formato válido
 * @param email - Email a validar
 * @returns true si el email es válido, false en caso contrario
 */
export const validateEmail = (email: string): boolean => {
  if (!email || typeof email !== 'string') {
    return false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

/**
 * Valida si un número de teléfono tiene formato válido
 * @param phone - Número de teléfono a validar
 * @returns true si el teléfono es válido, false en caso contrario
 */
export const validatePhone = (phone: string): boolean => {
  if (!phone || typeof phone !== 'string') {
    return false;
  }

  // Remover espacios, guiones y paréntesis
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
  
  // Debe tener al menos 10 dígitos y máximo 15
  const phoneRegex = /^\+?[1-9]\d{9,14}$/;
  return phoneRegex.test(cleanPhone);
};

/**
 * Valida si un NIT tiene formato válido
 * @param nit - NIT a validar
 * @returns true si el NIT es válido, false en caso contrario
 */
export const validateNIT = (nit: string): boolean => {
  if (!nit || typeof nit !== 'string') {
    return false;
  }

  // NIT debe tener entre 9 y 11 dígitos, solo números
  const nitRegex = /^\d{9,11}$/;
  return nitRegex.test(nit.trim());
};

/**
 * Valida si un campo es requerido y no está vacío
 * @param value - Valor a validar
 * @returns true si el valor no está vacío, false en caso contrario
 */
export const validateRequired = (value: any): boolean => {
  if (value === null || value === undefined) {
    return false;
  }

  if (typeof value === 'string') {
    return value.trim().length > 0;
  }

  if (typeof value === 'number') {
    return value > 0;
  }

  if (typeof value === 'boolean') {
    return value === true;
  }

  if (Array.isArray(value)) {
    return value.length > 0;
  }

  if (typeof value === 'object') {
    return Object.keys(value).length > 0;
  }

  return true;
};

/**
 * Valida si una contraseña cumple con los requisitos mínimos
 * @param password - Contraseña a validar
 * @returns true si la contraseña es válida, false en caso contrario
 */
export const validatePassword = (password: string): boolean => {
  if (!password || typeof password !== 'string') {
    return false;
  }

  // Mínimo 8 caracteres, al menos una letra mayúscula, una minúscula y un número
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

/**
 * Valida si un precio es válido
 * @param price - Precio a validar
 * @returns true si el precio es válido, false en caso contrario
 */
export const validatePrice = (price: number | string): boolean => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  
  if (isNaN(numPrice)) {
    return false;
  }

  return numPrice >= 0;
};

/**
 * Valida si un stock es válido
 * @param stock - Stock a validar
 * @returns true si el stock es válido, false en caso contrario
 */
export const validateStock = (stock: number | string): boolean => {
  const numStock = typeof stock === 'string' ? parseInt(stock, 10) : stock;
  
  if (isNaN(numStock)) {
    return false;
  }

  return Number.isInteger(numStock) && numStock >= 0;
};

/**
 * Valida si una fecha es válida
 * @param date - Fecha a validar
 * @returns true si la fecha es válida, false en caso contrario
 */
export const validateDate = (date: string): boolean => {
  if (!date || typeof date !== 'string') {
    return false;
  }

  const dateObj = new Date(date);
  return dateObj instanceof Date && !isNaN(dateObj.getTime());
};

/**
 * Valida si una fecha de vencimiento es futura
 * @param expiryDate - Fecha de vencimiento a validar
 * @returns true si la fecha es futura, false en caso contrario
 */
export const validateExpiryDate = (expiryDate: string): boolean => {
  if (!validateDate(expiryDate)) {
    return false;
  }

  const today = new Date();
  const expiry = new Date(expiryDate);
  
  return expiry > today;
};
