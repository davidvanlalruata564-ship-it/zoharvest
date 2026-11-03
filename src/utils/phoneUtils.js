/**
 * Utility functions for phone number normalization, display formatting,
 * and generating valid WhatsApp (wa.me) links with proper international country codes.
 */

/**
 * Normalizes any phone number into a valid WhatsApp wa.me numerical string.
 * WhatsApp wa.me links require:
 * 1. Only digits (no +, spaces, dashes, or parentheses)
 * 2. Country code prefix without leading zeros or '+'
 * 
 * If a 10-digit number is provided (standard for Indian mobile numbers),
 * it is automatically formatted with India's country code ('91').
 * If a number starts with '0' (e.g. 09436100000), the leading 0 is stripped and '91' is prefixed.
 */
export function formatWhatsAppNumber(phone) {
  if (!phone) return '';
  
  // Strip all non-digit characters
  let digits = String(phone).replace(/[^0-9]/g, '');
  if (!digits) return '';

  // Handle leading international call prefix '00'
  if (digits.startsWith('00')) {
    digits = digits.replace(/^00+/, '');
  }

  // Handle domestic trunk prefix '0' (e.g. 09436123456 -> 9436123456)
  if (digits.startsWith('0') && digits.length === 11) {
    digits = digits.slice(1);
  }

  // If 10 digits (standard Indian mobile numbers starting with 6, 7, 8, or 9),
  // prepend India country code 91
  if (digits.length === 10) {
    return `91${digits}`;
  }

  // If already 12 digits starting with 91, it is already valid
  if (digits.length === 12 && digits.startsWith('91')) {
    return digits;
  }

  return digits;
}

/**
 * Formats a phone number for elegant human-readable display.
 * e.g. '9436100000' -> '+91 94361 00000'
 */
export function formatDisplayPhone(phone) {
  if (!phone) return '';
  let digits = String(phone).replace(/[^0-9]/g, '');
  
  if (digits.startsWith('0') && digits.length === 11) {
    digits = digits.slice(1);
  }

  if (digits.length === 10) {
    return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
  }
  
  if (digits.length === 12 && digits.startsWith('91')) {
    const main = digits.slice(2);
    return `+91 ${main.slice(0, 5)} ${main.slice(5)}`;
  }
  
  return phone;
}

/**
 * Generates a full WhatsApp direct chat URL with proper country code formatting.
 */
export function getWhatsAppUrl(phone, message = '') {
  const formattedNumber = formatWhatsAppNumber(phone);
  if (!formattedNumber) return '';
  
  const baseUrl = `https://wa.me/${formattedNumber}`;
  if (message && message.trim()) {
    return `${baseUrl}?text=${encodeURIComponent(message.trim())}`;
  }
  return baseUrl;
}
