/**
 * Utilidades de formateo para la aplicación MediSupply
 */

/**
 * Formatea un número como moneda colombiana
 * @param amount - Cantidad a formatear
 * @returns String formateado como moneda
 */
export const formatCurrency = (amount: number | string): string => {
  if (amount === null || amount === undefined || isNaN(Number(amount))) {
    return '$0';
  }

  const numAmount = Number(amount);
  
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(numAmount);
};

/**
 * Formatea una fecha en formato dd/mm/yyyy
 * @param date - Fecha a formatear (Date, string o timestamp)
 * @returns String con la fecha formateada
 */
export const formatDate = (date: Date | string | number): string => {
  if (!date) {
    return '';
  }

  try {
    const dateObj = new Date(date);
    
    if (isNaN(dateObj.getTime())) {
      return '';
    }

    const day = dateObj.getDate().toString().padStart(2, '0');
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const year = dateObj.getFullYear();

    return `${day}/${month}/${year}`;
  } catch (error) {
    return '';
  }
};

/**
 * Formatea una fecha y hora en formato dd/mm/yyyy hh:mm
 * @param date - Fecha a formatear
 * @returns String con la fecha y hora formateada
 */
export const formatDateTime = (date: Date | string | number): string => {
  if (!date) {
    return '';
  }

  try {
    const dateObj = new Date(date);
    
    if (isNaN(dateObj.getTime())) {
      return '';
    }

    const day = dateObj.getDate().toString().padStart(2, '0');
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const year = dateObj.getFullYear();
    const hours = dateObj.getHours().toString().padStart(2, '0');
    const minutes = dateObj.getMinutes().toString().padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}`;
  } catch (error) {
    return '';
  }
};

/**
 * Formatea un número de teléfono colombiano
 * @param phone - Número de teléfono a formatear
 * @returns String con el teléfono formateado
 */
export const formatPhone = (phone: string): string => {
  if (!phone || typeof phone !== 'string') {
    return '';
  }

  // Remover caracteres no numéricos excepto +
  const cleanPhone = phone.replace(/[^\d+]/g, '');
  
  // Si ya está formateado, retornarlo
  if (cleanPhone.includes(' ')) {
    return cleanPhone;
  }

  // Formatear números colombianos
  if (cleanPhone.startsWith('+57')) {
    const number = cleanPhone.substring(3);
    if (number.length === 10) {
      return `+57 ${number.substring(0, 3)} ${number.substring(3, 6)} ${number.substring(6)}`;
    }
  } else if (cleanPhone.startsWith('57')) {
    const number = cleanPhone.substring(2);
    if (number.length === 10) {
      return `+57 ${number.substring(0, 3)} ${number.substring(3, 6)} ${number.substring(6)}`;
    }
  } else if (cleanPhone.length === 10) {
    return `${cleanPhone.substring(0, 3)} ${cleanPhone.substring(3, 6)} ${cleanPhone.substring(6)}`;
  }

  return cleanPhone;
};

/**
 * Formatea un NIT colombiano
 * @param nit - NIT a formatear
 * @returns String con el NIT formateado
 */
export const formatNIT = (nit: string): string => {
  if (!nit || typeof nit !== 'string') {
    return '';
  }

  // Remover caracteres no numéricos
  const cleanNIT = nit.replace(/\D/g, '');
  
  // Si ya está formateado, retornarlo
  if (nit.includes('.') || nit.includes('-')) {
    return nit;
  }

  // Formatear según la longitud
  if (cleanNIT.length >= 9) {
    if (cleanNIT.length === 10) {
      return `${cleanNIT.substring(0, 3)}.${cleanNIT.substring(3, 6)}.${cleanNIT.substring(6, 9)}-${cleanNIT.substring(9)}`;
    } else if (cleanNIT.length === 9) {
      return `${cleanNIT.substring(0, 3)}.${cleanNIT.substring(3, 6)}.${cleanNIT.substring(6)}`;
    } else {
      // Para NITs más largos, formatear de manera similar
      const groups = [];
      let remaining = cleanNIT;
      
      while (remaining.length > 3) {
        groups.push(remaining.substring(0, 3));
        remaining = remaining.substring(3);
      }
      
      if (remaining.length > 0) {
        groups.push(remaining);
      }
      
      return groups.join('.');
    }
  }

  return cleanNIT;
};

/**
 * Capitaliza la primera letra de una cadena
 * @param str - Cadena a capitalizar
 * @returns Cadena con la primera letra en mayúscula
 */
export const capitalizeFirst = (str: string): string => {
  if (!str || typeof str !== 'string') {
    return '';
  }

  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Capitaliza la primera letra de cada palabra
 * @param str - Cadena a capitalizar
 * @returns Cadena con cada palabra capitalizada
 */
export const capitalizeWords = (str: string): string => {
  if (!str || typeof str !== 'string') {
    return '';
  }

  return str
    .split(' ')
    .map(word => capitalizeFirst(word))
    .join(' ');
};

/**
 * Formatea un número con separadores de miles
 * @param num - Número a formatear
 * @returns String con el número formateado
 */
export const formatNumber = (num: number | string): string => {
  if (num === null || num === undefined || isNaN(Number(num))) {
    return '0';
  }

  return new Intl.NumberFormat('es-CO').format(Number(num));
};

/**
 * Trunca un texto a un número específico de caracteres
 * @param text - Texto a truncar
 * @param maxLength - Longitud máxima
 * @returns Texto truncado con "..." si es necesario
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (!text || typeof text !== 'string') {
    return '';
  }

  if (text.length <= maxLength) {
    return text;
  }

  return text.substring(0, maxLength) + '...';
};

/**
 * Formatea un estado de pedido para mostrar
 * @param status - Estado del pedido
 * @returns Estado formateado para mostrar
 */
export const formatOrderStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    pending: 'Pendiente',
    processing: 'Procesando',
    shipped: 'Enviado',
    delivered: 'Entregado',
    cancelled: 'Cancelado',
  };

  return statusMap[status] || status;
};

/**
 * Formatea un estado de visita para mostrar
 * @param status - Estado de la visita
 * @returns Estado formateado para mostrar
 */
export const formatVisitStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    pending: 'Pendiente',
    'in-progress': 'En Progreso',
    completed: 'Completada',
    cancelled: 'Cancelada',
  };

  return statusMap[status] || status;
};

/**
 * Formatea una prioridad para mostrar
 * @param priority - Prioridad
 * @returns Prioridad formateada para mostrar
 */
export const formatPriority = (priority: string): string => {
  const priorityMap: Record<string, string> = {
    low: 'Baja',
    medium: 'Media',
    high: 'Alta',
    urgent: 'Urgente',
  };

  return priorityMap[priority] || priority;
};
