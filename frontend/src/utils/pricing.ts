/**
 * Pricing Utility
 * 
 * The prices stored in the database are WHOLESALE prices.
 * The retail (public) price displayed to customers = wholesale × 2.
 * Wholesale prices are locked and require contacting us to unlock.
 */

/** Multiplier to convert wholesale → retail */
export const RETAIL_MULTIPLIER = 2;

/** Given a wholesale (database) price, return the retail price shown to customers */
export function getRetailPrice(wholesalePrice: number): number {
  return wholesalePrice * RETAIL_MULTIPLIER;
}

/** Format a price as USD string */
export function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}
