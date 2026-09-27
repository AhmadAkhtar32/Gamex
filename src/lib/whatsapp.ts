/* =========================================================
   WHATSAPP HELPERS
   ========================================================= */

/**
 * Gamex WhatsApp number.
 *
 * IMPORTANT:
 * International format, digits only.
 *
 * Example:
 * 0300 1234567
 * becomes
 * 923001234567
 */
export const GAMEX_WHATSAPP_NUMBER = "923036009123";

export function createWhatsAppUrl(message: string) {
  return `https://wa.me/${GAMEX_WHATSAPP_NUMBER}?text=${encodeURIComponent(
    message
  )}`;
}