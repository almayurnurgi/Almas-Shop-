/**
 * ALMAS-SHOP - Validações de Contacto e Identidade Moçambique
 */

/**
 * Validador rigoroso de formato de email (ex: nome@dominio.com)
 */
export function isValidEmail(emailStr: string): boolean {
  if (!emailStr || typeof emailStr !== 'string') return false;
  const trimmed = emailStr.trim();
  // Regex compatível com padrões internacionais RFC 5322
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return emailRegex.test(trimmed);
}

/**
 * Validador de número de telefone de Moçambique:
 * - Operadoras móveis em Moçambique: 82, 83 (Tmcel), 84, 85 (Vodacom), 86, 87 (Movitel)
 * - Aceita com ou sem prefixo internacional (+258, 00258 ou 258)
 * - Deve conter exatamente 9 dígitos na parte nacional, iniciando por 82, 83, 84, 85, 86 ou 87
 */
export function isValidMozambiquePhone(phoneStr: string): boolean {
  if (!phoneStr || typeof phoneStr !== 'string') return false;
  // Remove espaços, traços, parênteses e pontos
  const cleaned = phoneStr.replace(/[\s\-\(\)\.]/g, '');
  // Remove prefixos moçambicanos se presentes
  const national = cleaned.replace(/^(\+258|00258|258)/, '');
  // Verifica se tem 9 dígitos e se inicia por 82, 83, 84, 85, 86 ou 87
  return /^8[2-7]\d{7}$/.test(national);
}

/**
 * Formata um número moçambicano para exibição limpa (+258 8X XXX XXXX)
 */
export function formatMozambiquePhone(phoneStr: string): string {
  if (!phoneStr) return '';
  const cleaned = phoneStr.replace(/[\s\-\(\)\.]/g, '');
  const national = cleaned.replace(/^(\+258|00258|258)/, '');
  if (/^8[2-7]\d{7}$/.test(national)) {
    return `+258 ${national.slice(0, 2)} ${national.slice(2, 5)} ${national.slice(5)}`;
  }
  return phoneStr;
}
